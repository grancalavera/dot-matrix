import { Button, Toolbar } from "../components";
import "./ComposeToolbar.css";
import {
  clearMessage,
  setMessage,
  useIsEmptyMessage,
  useMessageCharCount,
  useMessage,
} from "./state";

export const ComposerToolbar = () => {
  const isEmpty = useIsEmptyMessage();
  return (
    <Toolbar className="compose-toolbar">
      <MessageLengthMonitor />
      <MessageComposer />
      <Button disabled={isEmpty} primary>
        play
      </Button>
      <Button onClick={() => clearMessage()} disabled={isEmpty}>
        clear
      </Button>
    </Toolbar>
  );
};

const MessageLengthMonitor = () => <p>{useMessageCharCount()}</p>;

const MessageComposer = () => (
  <input
    type="text"
    placeholder={"..."}
    value={useMessage()}
    onChange={(e) => setMessage(e.target.value)}
  />
);
