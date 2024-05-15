// https://github.com/hampusborgos/country-flags/tree/main/svg
interface Props {
	country: 'jp' | 'tw';
}

const jp = <svg xmlns="http://www.w3.org/2000/svg" width={54} height={36} viewBox="0 0 900 600"><rect fill="#fff" height="600" width="900"/><circle fill="#bc002d" cx="450" cy="300" r="180"/></svg>
const tw = <svg xmlns="http://www.w3.org/2000/svg" width={54} height={36} viewBox="0 0 900 600"><g fillRule="evenodd"><path d="M0 0h900v600H0z" fill="#fe0000"/><path d="M0 0h450v300H0z" fill="#000095"/></g><path d="M225 37.5l-56.25 209.928L322.428 93.75 112.5 150l209.928 56.25L168.75 52.572 225 262.5l56.25-209.928L127.572 206.25 337.5 150 127.572 93.75 281.25 247.428 225 37.5" fill="#fff" paintOrder="markers fill stroke"/><circle cy="150" cx="225" r="60" fill="#fff" stroke="#000095" strokeWidth="7.5"/></svg>

const NationalFlag = ({country}: Props) => country === 'tw' ? tw : jp

export default NationalFlag;