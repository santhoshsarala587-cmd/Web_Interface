import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './Button.css';

// Renders a router Link (to), a plain anchor (href) or a button (onClick).
export default function Button({ to, href, onClick, variant = 'primary', icon = false, children, ...rest }) {
  const className = `btn btn--${variant}`;
  const content = (
    <>
      {children}
      {icon && <ArrowUpRight size={18} aria-hidden="true" />}
    </>
  );
  if (to) return <Link className={className} to={to} {...rest}>{content}</Link>;
  if (href) return <a className={className} href={href} {...rest}>{content}</a>;
  return <button type="button" className={className} onClick={onClick} {...rest}>{content}</button>;
}
