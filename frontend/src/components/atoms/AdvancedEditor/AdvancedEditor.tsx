// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC } from "react";
import { Editor } from "primereact/editor";
import "./AdvancedEditor.scss";
import { AdvancedEditorProps } from "../../../common/types";

const AdvancedEditor: FC<AdvancedEditorProps> = ({
  label = "",
  error,
  name,
  onChange,
  value = "",
}) => {
  const renderHeader = () => (
    <span
      className="ql-formats"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <div style={{ width: "16px" }}></div>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Numbered List"
      ></button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Bullet List"
      ></button>
      <button
        className="ql-list"
        value="check"
        aria-label="Check List"
      ></button>
    </span>
  );

  const header = renderHeader();

  const handleTextChange = (e: { htmlValue: string; textValue: string }) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: e.htmlValue || "",
        },
      });
    }
  };

  return (
    <div className="editor-wrapper">
      {label && (
        <label htmlFor={name} className="editor-label">
          {label}
        </label>
      )}
      <div className="editor-inner-wrapper">
        <Editor
          id={name}
          name={name}
          value={value}
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
