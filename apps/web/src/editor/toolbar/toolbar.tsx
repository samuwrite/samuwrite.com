import { IDisposable } from "monaco-editor";
import { useEffect, useState } from "react";
import { AppLayoutState } from "~src/app/layout";
import { DocState } from "~src/doc/type";
import { Editor } from "~src/editor/type";
import { getHost } from "~src/host/get";
import { SettingsState } from "~src/settings/type";
import { EditorHelp } from "./help";
import { EditorOpen } from "./open";
import { EditorPreview } from "./preview";
import { EditorSave } from "./save";
import { EditorSettings } from "./settings";
import * as s from "./toolbar.module.css";

interface Props extends SettingsState, AppLayoutState, DocState {
  editor: Editor;
}

const getTitle = (props: Props): string => {
  const { editor, doc } = props;
  // change in editor.getValue does not trigger re-render
  // const suffix = editor.getValue() === doc.content ? "*" : "";
  const title = [doc.name].join(" ");
  return title;
};

export const EditorToolbar = (props: Props): JSX.Element => {
  const { editor, doc, setDoc } = props;
  const { layout, setLayout, settings, setSettings } = props;

  const [show, setShow] = useState(true);

  useEffect(() => {
    const disposables: IDisposable[] = [];
    disposables.push(editor.onDidChangeModelContent(() => setShow(false)));
    disposables.push(editor.onDidFocusEditorText(() => setShow(false)));
    return () => {
      disposables.forEach((disposable) => disposable.dispose());
    };
  }, [editor]);

  return (
    <div
      className={[s.container, show ? s.show : s.hide].join(" ")}
      onMouseEnter={() => setShow(true)}
    >
      <div className={s.left}>
        {getHost() === "mac" ? <div className={s.macPad} /> : null}
        <EditorOpen {...{ editor, doc, setDoc }} />
        <EditorSave {...{ editor, doc, setDoc }} />
      </div>
      <h1 className={s.title}>{getTitle(props)}</h1>
      <div className={s.right}>
        <EditorPreview {...{ settings, layout, setLayout }} />
        <EditorSettings {...{ settings, setSettings }} />
        <EditorHelp />
      </div>
    </div>
  );
};
