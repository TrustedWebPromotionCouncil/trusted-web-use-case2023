interface Props {
  color?: string;
  size?: number;
}

const TaskList = ({ color = '#4b4b4b', size = 14 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.7188 12.5C11.7188 12.7652 11.6134 13.0196 11.4259 13.2071C11.2383 13.3946 10.984 13.5 10.7188 13.5H1.71875C1.45353 13.5 1.19918 13.3946 1.01164 13.2071C0.824107 13.0196 0.71875 12.7652 0.71875 12.5V1.5C0.71875 1.23478 0.824107 0.98043 1.01164 0.792893C1.19918 0.605357 1.45353 0.5 1.71875 0.5H7.30454C7.56975 0.5 7.82411 0.605357 8.01164 0.792893L11.4259 4.20711C11.6134 4.39464 11.7188 4.649 11.7188 4.91421V12.5Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.77734 6.375H9.27734" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.77734 9.84375H9.27734" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.91016 9.78711L3.74805 10.625L5.14453 8.66992" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.91016 6.25586L3.74805 7.09375L5.14453 5.13867" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default TaskList;