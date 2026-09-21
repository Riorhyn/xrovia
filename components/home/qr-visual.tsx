import type { ReactElement } from "react";

const N = 21;

function inFinderZone(x: number, y: number): boolean {
  return (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={7} height={7} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} />
    </>
  );
}

interface QrVisualProps {
  className?: string;
  id?: string;
  onClick?: () => void;
}

/**
 * Decorative QR-style pattern.
 * Supports passing `id` for canvas downloads and `onClick` for modal triggers.
 */
export function QrVisual({ className = "", id, onClick }: QrVisualProps) {
  const cells: ReactElement[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinderZone(x, y) && (x * 7 + y * 13 + x * y * 3) % 5 < 2) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
      }
    }
  }

  return (
    <svg
      id={id}
      onClick={onClick}
      aria-hidden
      viewBox="-1 -1 23 23"
      shapeRendering="crispEdges"
      className={`text-slate-900 ${className}`}
      fill="currentColor"
    >
      <rect x={-1} y={-1} width={23} height={23} fill="#fff" />
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
      {cells}
    </svg>
  );
}