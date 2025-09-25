import { useEffect } from "react";

export default function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  callback: () => void,
  disabled = false,
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (disabled) return;
      const isInside = refs.some((ref) =>
        ref.current?.contains(e.target as Node),
      );

      if (!isInside) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [refs, callback, disabled]);
}
