import { Icon } from "./Icon";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button className="brand" onClick={onClick} type="button">
      <span className="brand-mark">
        <Icon name="home" size={20} />
      </span>
      <span className="brand-text">
        HomeCare <b>360</b>
      </span>
    </button>
  );
}
