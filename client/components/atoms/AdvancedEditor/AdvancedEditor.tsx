// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import "./AdvancedEditor.scss";
import { AdvancedEditorProps } from "../../../common/types";

const normalizeEditorValue = (value: any) => {
  if (!value || value === "<p><br></p>") {
    return "";
  }

  return value;
};

const AdvancedEditor: FC<AdvancedEditorProps> = ({
  label = "",
  error,
  name,
  onChange,
  value = "",
}) => {
  const normalizedInitialValue = normalizeEditorValue(value);

  const [editorValue, setEditorValue] = useState(normalizedInitialValue);

  const editorValueRef = useRef(normalizedInitialValue);
  const lastFormikValueRef = useRef(normalizedInitialValue);

  useEffect(() => {
    const nextValue = normalizeEditorValue(value);

    if (nextValue === editorValueRef.current) {
      lastFormikValueRef.current = nextValue;
      return;
    }

    editorValueRef.current = nextValue;
    lastFormikValueRef.current = nextValue;
    setEditorValue(nextValue);
  }, [value]);

  const header = useMemo(
    () => (
      <span
        className="ql-formats"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <button type="button" className="ql-bold" aria-label="Bold"></button>
        <button type="button" className="ql-italic" aria-label="Italic"></button>
        <button
          type="button"
          className="ql-underline"
          aria-label="Underline"
        ></button>
        <button type="button" className="ql-strike" aria-label="Strike"></button>
        <button type="button" className="ql-link" aria-label="Link"></button>

        <div style={{ width: "16px" }}></div>

        <button
          type="button"
          className="ql-list"
          value="ordered"
          aria-label="Numbered List"
        ></button>

        <button
          type="button"
          className="ql-list"
          value="bullet"
          aria-label="Bullet List"
        ></button>

        <button
          type="button"
          className="ql-list"
          value="check"
          aria-label="Check List"
        ></button>
      </span>
    ),
    []
  );

  const commitValueToFormik = (nextValue: string) => {
    const normalizedNextValue = normalizeEditorValue(nextValue);

    if (!onChange || normalizedNextValue === lastFormikValueRef.current) {
      return;
    }

    lastFormikValueRef.current = normalizedNextValue;

    onChange({
      target: {
        name,
        value: normalizedNextValue,
      },
    });
  };

  const handleTextChange = (e: {
    htmlValue: string;
    textValue: string;
    source?: string;
  }) => {
    const nextValue = normalizeEditorValue(e.htmlValue);

    if (nextValue === editorValueRef.current) {
      return;
    }

    editorValueRef.current = nextValue;
    setEditorValue(nextValue);

    if (e.source === "user") {
      commitValueToFormik(nextValue);
    }
  };

  return (
    <div
      className="editor-wrapper"
      onBlurCapture={() => {
        commitValueToFormik(editorValueRef.current);
      }}
    >
      {label && (
        <label htmlFor={name} className="editor-label">
          {label}
        </label>
      )}

      <div className="editor-inner-wrapper">
        <Editor
          id={name}
          name={name}
          value={editorValue}
          onTextChange={handleTextChange}
          headerTemplate={header}
          className="editor"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdvancedEditor;