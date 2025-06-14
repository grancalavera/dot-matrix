import { useEffect, useRef } from "react";
import { Button } from "../components";
import { disableDebug, enableDebug, useIsDebugEnabled } from "./state";

export const DebugButton = () => {
  const body = useRef(document.body);
  const debug = useIsDebugEnabled();

  useEffect(() => {
    if (debug) {
      body.current?.classList.add("debug");
    } else {
      body.current?.classList.remove("debug");
    }
  }, [debug]);

  return (
    <Button
      onClick={() => (debug ? disableDebug() : enableDebug())}
      primary={debug}
    >
      🐞
    </Button>
  );
};
