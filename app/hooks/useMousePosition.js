import React from "react";

export default function useMousePosition() {
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0
  });
  React.useLayoutEffect(() => {
    function updatePosition(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    document.addEventListener("mousemove", updatePosition);
    return () => document.removeEventListener("mousemove", updatePosition);
  }, []);

  return position;
}
