import { PropsWithChildren } from "react";
import "./components.css";
import clsx from "clsx";

export const Toolbar = (props: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx("toolbar", props.className)}>{props.children}</div>
);

type ButtonProps = {
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  primary,
  children,
  onClick,
  disabled,
  className,
}: PropsWithChildren<ButtonProps>) => (
  <button
    onClick={() => {
      if (disabled) return;
      onClick?.();
    }}
    className={clsx(className, { primary, disabled })}
  >
    {children}
  </button>
);
