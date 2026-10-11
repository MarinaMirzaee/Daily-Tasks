import type { ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost-destructive'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  'ghost-destructive': 'button-destructive',
}

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`button ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
