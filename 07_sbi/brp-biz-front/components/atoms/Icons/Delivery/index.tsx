interface Props {
	size?: number;
}

const Delivery = ({ size = 96 }: Props) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6 15.8L7.143 17L10 14M6 8.8L7.143 10L10 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M13 9H18M13 16H18M22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C21.509 4.438 21.835 5.807 21.945 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
)

export default Delivery