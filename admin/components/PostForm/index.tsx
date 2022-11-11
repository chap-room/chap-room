import styles from "./style.module.scss";
import { useRef, useState } from "react";
import TextArea from "@/shared/components/TextArea";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Radio from "@/shared/components/Radio";
import Editor from "@/admin/components/PostForm/Editor";

interface PostFormData {
  pageSlug: string;
  pageTitle: string;
  title: string;
  categories: { id: number; name: string }[];
  keywords: string[];
  metaDescription: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string | null;
  display: boolean;
  content: string;
}

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSave: (data: PostFormData) => Promise<any>;
}

export default function PostForm({ defaultValues, onSave }: PostFormProps) {
  const [pageSlug, setPageSlug] = useState(defaultValues?.pageSlug || "");
  const [pageTitle, setPageTitle] = useState(defaultValues?.pageTitle || "");
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [categories, setCategories] = useState(defaultValues?.categories || []);
  const [keywords, setKeywords] = useState(defaultValues?.keywords || []);
  const [metaDescription, setMetaDescription] = useState(
    defaultValues?.metaDescription || ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    defaultValues?.thumbnailUrl || null
  );
  const [thumbnailAlt, setThumbnailAlt] = useState(
    defaultValues?.thumbnailAlt || ""
  );
  const [display, setDisplay] = useState(defaultValues?.display || false);
  const getPostContentRef = useRef<(() => string | null) | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Form}>
          <div className={styles.Label}>عنوان نمایشی:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ placeholder: "عنوان نمایشی" }}
              value={title}
              onChange={setTitle}
            />
          </div>
          <div className={styles.Label}>عنوان صفحه:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ placeholder: "عنوان صفحه" }}
              value={pageTitle}
              onChange={setPageTitle}
            />
          </div>
          <div className={styles.Label}>لینک صفحه:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ placeholder: "لینک صفحه" }}
              value={pageSlug}
              onChange={setPageSlug}
            />
          </div>
          <div className={styles.Label}>توضیحات متا:</div>
          <div className={styles.Input}>
            <TextArea
              placeholder="توضیحات متا"
              value={metaDescription}
              onTextChange={setMetaDescription}
              rows={4}
            />
          </div>
        </div>
        <div className={styles.Form}>
          <div className={styles.Label}>Alt تصویر:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ placeholder: "Alt تصویر" }}
              value={thumbnailAlt}
              onChange={setThumbnailAlt}
            />
          </div>
          <div className={styles.Label}>نوع:</div>
          <div className={styles.Input}>{/* <Radio /> */}</div>
        </div>
        <div>
          <Editor
            id="PostContent"
            initialContent={defaultValues?.content}
            getContentRef={getPostContentRef}
          />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            // setIsSubmitting(true);
            // onSave({
            //   label,
            //   recipientName,
            //   recipientPhoneNumber,
            //   recipientPostalCode,
            //   recipientDeliveryProvince,
            //   recipientDeliveryCity,
            //   recipientDeliveryAddress,
            // }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
