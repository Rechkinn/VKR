import "./button.css";

export default function Button({
  styleType = "black",
  isButtonWithIcon = false,
  children,
  ...props
}) {
  return (
    <button
      className={isButtonWithIcon ? `${styleType} withIcon` : `${styleType}`}
      {...props}
    >
      {children}
    </button>
  );
}
