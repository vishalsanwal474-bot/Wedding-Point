import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = forwardRef(function Button(
  {
    children,
    to,
    href,
    type = 'button',
    variant = 'primary',
    className = '',
    onClick,
    disabled = false,
    ...rest
  },
  ref
) {
  const classes = `btn btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} ref={ref} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} ref={ref} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
