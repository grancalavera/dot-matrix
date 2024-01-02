import { useRef } from "react";
import { Button, Toolbar } from "../components";
import "./ComposeToolbar.css";
import {
  clearMessage,
  pauseMessage,
  playMessage,
  rewindMessage,
  setMessage,
  useIsEmptyMessage,
  useIsPlayingMessage,
  useMessage,
  useMessageCharCount,
} from "./state";

export const ComposerToolbar = () => (
  <Toolbar className="compose-toolbar">
    <MessageLengthMonitor />
    <MessageInput />
    <MessageActions />
  </Toolbar>
);

const MessageLengthMonitor = () => <p>{useMessageCharCount()}</p>;

const MessageInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const message = useMessage();
  const isPlaying = useIsPlayingMessage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { selectionStart, selectionEnd } = e.target;
    setMessage(e.target.value);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = selectionStart;
        inputRef.current.selectionEnd = selectionEnd;
      }
    });
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={"..."}
      value={message}
      onChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (isPlaying) {
            pauseMessage();
          } else {
            playMessage();
          }
        }
      }}
    />
  );
};

const MessageActions = () => {
  const isEmpty = useIsEmptyMessage();
  const isPlaying = useIsPlayingMessage();

  return (
    <>
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
    </>
  );
};
