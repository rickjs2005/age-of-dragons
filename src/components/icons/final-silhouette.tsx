export function FinalSilhouette() {
  return (
    <svg viewBox="0 0 400 240" aria-hidden className="mx-auto w-full max-w-5xl text-[#211d1a]">
      <g fill="currentColor">
        <path
          className="wing-l"
          d="M200,170 Q110,80 12,48 Q60,60 58,95 Q100,105 100,145 Q160,165 200,170 Z"
        />
        <path
          className="wing-r"
          d="M200,170 Q290,80 388,48 Q340,60 342,95 Q300,105 300,145 Q240,165 200,170 Z"
        />
        <path
          d="M185,178 C178,150 182,120 172,95 C165,78 168,60 158,48 L130,42 L145,55 L165,50
             C172,66 180,70 190,66 L200,40 L195,20 L225,8 L205,35 L222,42 L210,50
             C215,70 210,90 218,110 C224,130 218,155 212,178 Z"
        />
        <path d="M205,178 Q230,200 220,225 Q235,235 250,225 Q232,238 215,232 Q222,218 210,205 Q200,195 205,178 Z" />
      </g>
    </svg>
  );
}
