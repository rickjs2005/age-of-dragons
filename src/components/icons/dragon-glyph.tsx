const GLYPH_PATHS = [
  // 0 · alado clássico (Smaug, Drogon...)
  "M6 46 Q18 18 38 24 Q48 8 64 14 L74 4 L71 16 Q88 18 94 34 Q80 30 74 35 Q62 28 54 33 Q42 28 36 37 Q22 40 6 46 Z",
  // 1 · veloz / fúria da noite (Toothless, Fatalis...)
  "M4 40 Q24 44 34 30 Q30 16 44 10 Q40 22 50 24 Q66 10 84 16 Q72 22 70 30 Q88 28 96 38 Q78 34 68 40 Q52 32 40 38 Q22 32 4 40 Z",
  // 2 · celestial / serpente (Shenron, Saphira...)
  "M6 30 Q18 10 34 18 Q30 28 40 30 Q46 14 60 20 Q54 30 64 32 Q72 18 88 22 Q78 30 84 40 Q66 36 58 44 Q46 34 36 42 Q22 36 6 30 Z",
  // 3 · devorador / chifrudo (Alduin, Tiamat...)
  "M8 44 L20 16 L26 26 L36 10 L40 24 L52 6 L54 22 L68 12 Q64 24 74 26 Q86 22 96 32 Q80 30 76 38 Q60 30 50 36 Q34 28 26 38 Q16 34 8 44 Z",
];

const GLYPH_EYE: Array<[number, number]> = [
  [72, 10],
  [82, 18],
  [85, 23],
  [66, 14],
];

export function DragonGlyph({ color, variant }: { color: string; variant: number }) {
  const i = variant % GLYPH_PATHS.length;
  const [ex, ey] = GLYPH_EYE[i];
  return (
    <svg
      viewBox="0 0 100 52"
      aria-hidden
      className="h-20 w-full"
      fill="none"
      style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
    >
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={GLYPH_PATHS[i]} />
        <circle cx={ex} cy={ey} r="1.7" fill={color} stroke="none" />
      </g>
    </svg>
  );
}
