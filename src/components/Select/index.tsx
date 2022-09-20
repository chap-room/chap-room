import styles from "./style.module.scss";
import { ReactComponent as ExpandMoreIcon } from "../../assets/icons/expandMore.svg";

import React, { useRef, useState, useLayoutEffect } from "react";
import {
  useFloating,
  offset,
  flip,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingFocusManager,
  autoUpdate,
  size,
} from "@floating-ui/react-dom-interactions";

type SelectProps =
  | {
      placeholder?: undefined;
      options: Record<string, string>;
      value: string;
      onChange: (newValue: string) => void;
      readOnly?: boolean;
    }
  | {
      placeholder: string;
      options: Record<string, string>;
      value: string | null;
      onChange: (newValue: string | null) => void;
      readOnly?: boolean;
    };

export default function Select({
  placeholder,
  options,
  onChange,
  value = null,
  readOnly,
}: SelectProps) {
  const listItemsRef = useRef<Array<HTMLDivElement | null>>([]);
  const listValueRef = useRef<(string | null)[]>(
    placeholder ? [null, ...Object.keys(options)] : Object.keys(options)
  );
  const listLabelRef = useRef<string[]>(
    placeholder
      ? [placeholder, ...Object.values(options)]
      : Object.values(options)
  );

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, listValueRef.current.indexOf(value))
  );
  const [pointer, setPointer] = useState(false);

  if (!open && pointer) {
    setPointer(false);
  }

  const { x, y, reference, floating, strategy, context } = useFloating({
    open: !readOnly && open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useClick(context, {
        enabled: !readOnly
      }),
      useRole(context, { role: "listbox" }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
      }),
      useTypeahead(context, {
        listRef: listLabelRef,
        onMatch: open ? setActiveIndex : setSelectedIndex,
        activeIndex,
        selectedIndex,
      }),
    ]
  );

  useLayoutEffect(() => {
    if (open && activeIndex != null && !pointer) {
      requestAnimationFrame(() => {
        listItemsRef.current[activeIndex]?.scrollIntoView({
          block: "nearest",
        });
      });
    }
  }, [open, activeIndex, pointer]);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    if (placeholder) {
      onChange(listValueRef.current[index]);
    } else {
      onChange(listValueRef.current[index]!);
    }
    setOpen(false);
    setActiveIndex(null);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSelect.apply(null, [index]);
    }

    if (event.key === " ") {
      event.preventDefault();
    }
  }

  function handleKeyUp(index: number, event: React.KeyboardEvent) {
    if (event.key === " " && !context.dataRef.current.typing) {
      handleSelect.apply(null, [index]);
    }
  }

  return (
    <>
      <div
        {...getReferenceProps({
          ref: reference,
          className: styles.Select,
        })}
      >
        <span>{listLabelRef.current[selectedIndex]}</span>
        <div className={styles.Spacer} />
        <ExpandMoreIcon className={styles.ExpandMore} />
      </div>
      {open && (
        <FloatingFocusManager context={context} preventTabbing>
          <div
            {...getFloatingProps({
              ref: floating,
              className: styles.Dropdown,
              style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                overflow: "auto",
              },
              onPointerMove() {
                setPointer(true);
              },
              onKeyDown(event) {
                setPointer(false);

                if (event.key === "Tab") {
                  setOpen(false);
                }
              },
            })}
          >
            {listLabelRef.current.map((label, index) => (
              <div
                key={listValueRef.current[index]}
                role="option"
                ref={(node) => (listItemsRef.current[index] = node)}
                tabIndex={activeIndex === index ? 0 : 1}
                aria-selected={activeIndex === index}
                data-selected={selectedIndex === index}
                {...getItemProps({
                  onClick: handleSelect.bind(null, index),
                  onKeyDown: handleKeyDown.bind(null, index),
                  onKeyUp: handleKeyUp.bind(null, index),
                })}
              >
                {label}
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
