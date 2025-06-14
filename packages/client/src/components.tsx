import clsx from "clsx";
import { PropsWithChildren } from "react";
import "./components.css";

export const Toolbar = (props: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx("toolbar", props.className)}>{props.children}</div>
);

type ButtonProps = {
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  divider?: boolean;
};

export const Button = ({
  primary,
  children,
  onClick,
  disabled,
  divider,
  className,
}: PropsWithChildren<ButtonProps>) => (
  <button
    onClick={() => {
      if (disabled) return;
      onClick?.();
    }}
    className={clsx(className, {
      primary,
      disabled,
      ["button-section"]: divider,
    })}
  >
    {children}
  </button>
);

export const FlexibleSpace = () => <div className="flexible-space" />;
