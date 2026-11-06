import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "../../types";

export type ButtonKind =
  | "primary"
  | "secondary"
  | "peach"
  | "orange"
  | "ghost"
  | "danger"
  | "success";

interface ButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconName;
  iconRight?: IconName;
  kind?: ButtonKind;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

export function Button({
  children,
  onClick,
  icon,
  iconRight,
  kind = "primary",
  className = "",
  disabled = false,
  type = "button",
  size = "md",
  ariaLabel,
}: ButtonProps) {
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      type={type}
      className={`btn btn-${kind} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 22 : 18} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : size === "lg" ? 22 : 18} />}
    </button>
  );
}
