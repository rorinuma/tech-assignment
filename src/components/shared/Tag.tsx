import "./Tag.css";

interface TagProps {
  name: string;
  className?: string;
  onClick?: () => void;
}

export default function Tag({ name, className, onClick }: TagProps) {
  return (
    <button className={`tag-button ${className}`} onClick={onClick}>
      {name}
    </button>
  );
}
