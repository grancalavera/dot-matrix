import { PropsWithChildren } from "react";
import "./components.css";
import clsx from "clsx";

export const Toolbar = (props: PropsWithChildren) => (
  <div className="toolbar">{props.children}</div>
);

type ButtonProps = {
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({
  primary,
  children,
  onClick,
  disabled,
}: PropsWithChildren<ButtonProps>) => (
  <button
    onClick={() => {
      if (disabled) return;
      onClick?.();
    }}
    className={clsx({ primary, disabled })}
  >
    {children}
  </button>
);
