export function ChapterMark({ reveal = true }: { reveal?: boolean }) {
  return (
    <div className="chapter-mark" aria-hidden {...(reveal ? { "data-reveal": true } : {})}>
      <svg viewBox="0 0 64 20" className="h-4 w-20" fill="none">
        <path d="M1 10 Q16 1.5 28.5 9.5" stroke="#ff7a3d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M1 10 Q16 18.5 28.5 10.5" stroke="#ff7a3d" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M63 10 Q48 1.5 35.5 9.5" stroke="#ff7a3d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M63 10 Q48 18.5 35.5 10.5" stroke="#ff7a3d" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
        <rect
          className="chapter-mark-core"
          x="27.5"
          y="5.5"
          width="9"
          height="9"
          rx="1.4"
          transform="rotate(45 32 10)"
          fill="var(--color-gold-soft)"
        />
      </svg>
    </div>
  );
}
