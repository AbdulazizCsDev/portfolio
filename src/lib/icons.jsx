// Inline stroke icons. No icon package (the brief forbids adding one) and no
// emoji — every glyph here is drawn, inherits `currentColor`, and scales with
// the text it sits next to.
//
// House style: 24×24 viewBox, no fill, 1.6 stroke, round caps. Anything added
// later matches that or it will not sit right beside the existing ones.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

export function SunIcon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56" />
    </svg>
  );
}

export function MoonIcon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M20 13.4A8.2 8.2 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4z" />
    </svg>
  );
}

// Points along the reading direction: the parent flips it in RTL via CSS.
export function ArrowIcon({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size} className="icon-directional">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

// Box with an arrow leaving it — the standard "opens elsewhere" mark.
export function ExternalIcon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18.5 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5h4.5" />
    </svg>
  );
}

export function GithubIcon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M9 19.2c-4.3 1.3-4.3-2.2-6-2.6m12 5.4v-3.6a3 3 0 0 0-.9-2.4c2.9-.3 5.9-1.4 5.9-6.4a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C5.6 2.3 4.5 2.6 4.5 2.6a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3 9.6c0 5 3 6.1 5.9 6.4a3 3 0 0 0-.9 2.4V22" />
    </svg>
  );
}
