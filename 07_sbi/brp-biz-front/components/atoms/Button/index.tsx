import { FC, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'danger'
}

const Button: FC<ButtonProps> = ({ children, color, ...props }) => {
  let style = 'bg-blue-600 hover:enabled:bg-blue-400'
  switch (color) {
    case 'primary':
      style = 'bg-blue-600 hover:enabled:bg-blue-400 disabled:hover:bg-blue-600'
      break;
    case 'secondary':
      style = 'bg-gray-600 hover:enabled:bg-gray-400'
      break;
    case 'danger':
      style = 'bg-red-600 hover:enabled:bg-red-400 '
      break;
    default:
      break;
  }
  return (
    <button
      className={`${style} text-white font-bold rounded-full px-8 py-2 disabled:opacity-50 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed`}
      {...props}
    >{children}</button>
  )
}

export default Button