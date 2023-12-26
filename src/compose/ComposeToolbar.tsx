import { Button, Toolbar } from "../components";
import "./ComposeToolbar.css";
import {
  clearMessage,
  setMessage,
  useIsEmptyMessage,
  useMessageCharCount,
  useMessge,
} from "./state";

export const ComposerToolbar = () => {
  const isEmpty = useIsEmptyMessage();
  return (
    <Toolbar className="compose-toolbar">
      <MessageLengthMonitor />
      <MessageComposer />
      <Button disabled={isEmpty}>play</Button>
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
    value={useMessge()}
    onChange={(e) => setMessage(e.target.value)}
  />
);
