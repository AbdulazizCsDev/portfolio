import { navigate } from './router';

// A real <a href> so middle-click, cmd-click and "copy link" behave, with the
// plain left-click intercepted to route in place instead of reloading.
export default function Link({ to, children, ...rest }) {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
