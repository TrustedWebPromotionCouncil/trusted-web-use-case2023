import Link from 'next/link';
import { FC } from 'react'

interface HeaderProps {
  color?: string;
  legalEntityName?: string
  businessUnitName?: string;
  userName?: string;
}

const Header: FC<HeaderProps> = ({ color = '#ff6347', legalEntityName = '事業者', userName = 'ユーザー', businessUnitName = '事業所' }) => {
  return (
    <header className="flex" style={{ backgroundColor: `${color}`}}>
      <div className="grow m-2 flex items-stretch">
        <p className="text-left text-lg mx-2 text-white self-center"><Link href="/">{legalEntityName}の{businessUnitName}</Link></p>
      </div>
      <div className="m-2 flex items-stretch">
        <p className="text-right mx-2 text-white self-center">{userName}</p>
      </div>
    </header>
  )
}

export default Header