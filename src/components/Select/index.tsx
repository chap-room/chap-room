import styles from "./style.module.scss";
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
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
import { ReactComponent as ExpandMoreIcon } from "../../assets/icons/expandMore.svg";

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
  const listElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const listValueRef = useRef<(string | null)[]>(
    placeholder ? [null, ...Object.keys(options)] : Object.keys(options)
  );
  const listLabelsRef = useRef<string[]>(
    placeholder
      ? [placeholder, ...Object.values(options)]
      : Object.values(options)
  );

  useEffect(() => {
    const newListElements: (HTMLDivElement | null)[] = [];
    const newListValue: (string | null)[] = placeholder ? [null] : [];
    const newListLabels: string[] = placeholder ? [placeholder] : [];

    const existingElements: Record<string, HTMLDivElement | null> = {};
    listValueRef.current.forEach((itemValue, index) => {
      if (itemValue !== null) {
        existingElements[itemValue] = listElementsRef.current[index];
      }
    });

    Object.entries(options).forEach(([itemValue, itemLabel]) => {
      newListElements.push(
        existingElements[itemValue] ? existingElements[itemValue] : null
      );
      newListValue.push(itemValue);
      newListLabels.push(itemLabel);
    });

    listElementsRef.current = newListElements;
    listValueRef.current = newListValue;
    listLabelsRef.current = newListLabels;
  }, [options, placeholder]);

  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, listValueRef.current.indexOf(value));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
        enabled: !readOnly,
      }),
      useRole(context, { role: "listbox" }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listElementsRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
      }),
      useTypeahead(context, {
        listRef: listLabelsRef,
        onMatch: open
          ? setActiveIndex
          : (index) => {
              if (placeholder) {
                onChange(listValueRef.current[index]);
              } else {
                onChange(listValueRef.current[index]!);
              }
            },
        activeIndex,
        selectedIndex,
      }),
    ]
  );

  useLayoutEffect(() => {
    if (open && activeIndex != null && !pointer) {
      requestAnimationFrame(() => {
        listElementsRef.current[activeIndex]?.scrollIntoView({
          block: "nearest",
        });
      });
    }
  }, [open, activeIndex, pointer]);

  function handleSelect(index: number) {
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
          tabIndex: 0,
        })}
      >
        <span className={styles.Text}>
          {listLabelsRef.current[selectedIndex]}
        </span>
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
            {listLabelsRef.current.map((label, index) => (
              <div
                key={listValueRef.current[index]}
                role="option"
                ref={(node) => (listElementsRef.current[index] = node)}
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
