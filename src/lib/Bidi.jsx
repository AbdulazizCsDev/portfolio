// §8 — Latin terms and figures inside an Arabic sentence keep their own order
// only if they are isolated. <bdi> does exactly that and picks its direction
// from the content, so the same wrapper is correct in both languages.
//
// Splitting on a capturing group makes every odd index a matched run, so the
// text is rebuilt in order with the runs isolated and the Arabic untouched.
const RUN = /([A-Za-z][A-Za-z0-9.+#/&'’·-]*|\d[\d.,:/–—-]*\d|\d)/g;

export default function Bidi({ children }) {
  if (typeof children !== 'string') return children;
  return children
    .split(RUN)
    .map((part, i) => (i % 2 ? <bdi key={i}>{part}</bdi> : part));
}
