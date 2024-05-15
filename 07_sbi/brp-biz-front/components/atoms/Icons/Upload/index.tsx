interface Props {
  size?: number;
}

const Upload = ({ size = 96 }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M320,367.79h76c55,0,100-29.21,100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8-69,0-113.44,45.79-128,91.2-60,5.7-112,43.88-112,106.4s54,106.4,120,106.4h56" fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32px' /><polyline points="320 255.79 256 191.79 192 255.79" fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32px' /><line x1="256" y1="448.21" x2="256" y2="207.79" fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32px' />
  </svg>
)

export default Upload