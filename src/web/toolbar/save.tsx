import { DownloadIcon } from "@primer/octicons-react";
import { useEffect } from "react";
import tinykeys from "tinykeys";
import { DocState } from "../doc/type";
import { Editor } from "../editor/type";
import { getErrorMessage } from "../error/message";
import { saveDoc } from "../host/save";
import { saveDocAs } from "../host/save-as";
import { Tooltip } from "../tooltip/tooltip";
import { ToolbarButton } from "./button/button";

interface Props extends DocState {
  editor: Editor;
}

const save = async (props: Props): Promise<void> => {
  const { doc, editor, setDoc } = props;

  const content = editor.getValue();

  try {
    if (doc.handle === null) {
      // New file, never save -> Save as
      const newDoc = await saveDocAs(content);
      if (newDoc === null) return;
      setDoc(newDoc);
    } else {
      // Opened file -> Save
      await saveDoc(doc.handle, content);
      setDoc({ ...doc, content });
    }
  } catch (error: unknown) {
    window.alert(`Cannot save: ${getErrorMessage(error)}`);
    return;
  }
};

export const ToolbarSave = (props: Props): JSX.Element => {
  const { doc, editor, setDoc } = props;

  useEffect(() => {
    const unsub = tinykeys(window, {
      "$mod+s": (event) => {
        event.preventDefault();
        save({ doc, editor, setDoc });
      },
    });
    return () => unsub();
  }, [doc, editor, setDoc]);

  return (
    <Tooltip content="Save" shortcut="⌘ S">
      <ToolbarButton
        Icon={DownloadIcon}
        label="Save"
        onClick={() => save(props)}
      />
    </Tooltip>
  );
};
