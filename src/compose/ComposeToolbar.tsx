import { Button, Toolbar } from "../components";
import "./ComposeToolbar.css";
import {
  clearMessage,
  setMessage,
  useIsEmptyMessage,
  useMessageCharCount,
  useMessage,
  useIsPlayingMessage,
  pauseMessage,
  playMessage,
  rewindMessage,
} from "./state";

export const ComposerToolbar = () => {
  const isEmpty = useIsEmptyMessage();
  const isPlaying = useIsPlayingMessage();
  return (
    <Toolbar className="compose-toolbar">
      <MessageLengthMonitor />
      <MessageComposer />
      <Button
        disabled={isEmpty}
        primary
        onClick={() => (isPlaying ? pauseMessage() : playMessage())}
      >
        {isPlaying ? "stop" : "play"}
      </Button>
      <Button
        onClick={() => {
          pauseMessage();
          clearMessage();
        }}
        disabled={isEmpty}
      >
        clear
      </Button>
      <Button onClick={() => rewindMessage()} disabled={isEmpty}>
        rewind
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
