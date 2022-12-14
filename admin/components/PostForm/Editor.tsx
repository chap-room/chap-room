import { MutableRefObject, useRef } from "react";
import { Editor as TinymceEditor } from "tinymce";
import { Editor as TinymceReact } from "@tinymce/tinymce-react";
// @ts-ignore
import VazirMatnFontFace from "!!css-loader!vazirmatn/Vazirmatn-font-face.css";
// @ts-ignore
import IransansFontFace from "!!css-loader!@/shared/assets/scss/iransans.scss";
import { request, uploadBlogPostImage } from "@/admin/api";

interface EditorProps {
  id: string;
  initialContent?: string;
  getContentRef: MutableRefObject<(() => string | null) | null>;
}

export default function Editor({
  id,
  initialContent,
  getContentRef,
}: EditorProps) {
  const editorRef = useRef<TinymceEditor | null>(null);

  if (getContentRef) {
    getContentRef.current = () => {
      return editorRef.current?.getContent() || null;
    };
  }

  return (
    <TinymceReact
      id={id}
      onInit={(evt, editor) => (editorRef.current = editor)}
      tinymceScriptSrc={
        (process.env.PUBLIC_URL || "") + "/tinymce/tinymce.min.js"
      }
      initialValue={initialContent}
      init={{
        height: 500,
        branding: false,
        promotion: false,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar: [
          "undo redo",
          "blocks fontfamily fontsize",
          "bold italic forecolor backcolor",
          "alignleft aligncenter alignright alignjustify",
          "bullist numlist outdent indent",
          "removeformat help",
        ].join(" | "),
        font_family_formats: [
          "ایران سنس=IRANSans,Arial,sans-serif",
          "وزیر متن=Vazirmatn,Arial,sans-serif",
          "Andale Mono=andale mono,times",
          "Arial=arial,helvetica,sans-serif",
          "Arial Black=arial black,avant garde",
          "Book Antiqua=book antiqua,palatino",
          "Comic Sans MS=comic sans ms,sans-serif",
          "Courier New=courier new,courier",
          "Georgia=georgia,palatino",
          "Helvetica=helvetica",
          "Impact=impact,chicago",
          "Symbol=symbol",
          "Tahoma=tahoma,arial,helvetica,sans-serif",
          "Terminal=terminal,monaco",
          "Times New Roman=times new roman,times",
          "Trebuchet MS=trebuchet ms,geneva",
          "Verdana=verdana,geneva",
          "Webdings=webdings",
          "Wingdings=wingdings,zapf dingbats",
        ].join("; "),
        content_style: [
          VazirMatnFontFace.toString(),
          IransansFontFace.toString(),
          "body { font-family: IRANSans,Arial,sans-serif; font-size:14px }",
        ].join("\n"),
        directionality: "rtl",
        language: "fa",
        image_title: true,
        automatic_uploads: true,
        file_picker_types: "image",
        images_upload_handler: (blobInfo, progress) => {
          return uploadBlogPostImage(
            new File([blobInfo.blob()], blobInfo.filename()),
            progress
          )[0].then((data) => data!.url);
        },
      }}
    />
  );
}
