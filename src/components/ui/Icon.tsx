import React from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number | string;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = "",
  filled = false,
  size,
  title,
}) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        fontSize: typeof size === "number" ? `${size}px` : size,
      }}
      title={title}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};
