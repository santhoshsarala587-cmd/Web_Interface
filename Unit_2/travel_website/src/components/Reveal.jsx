import useInView from '../hooks/useInView';

// Wraps content in a gentle one-time reveal when it scrolls into view.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
