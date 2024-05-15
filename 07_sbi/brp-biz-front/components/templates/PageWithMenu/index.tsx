import { FC, ReactNode } from 'react'
import Header from '@/components/atoms/Header'
import Footer from '@/components/atoms/Footer'
import SideBar from '@/components/molecules/SideBar'
import { User } from '@/types';

interface Props {
  user?: User;
  active?: string;
  children?: ReactNode;
}

const Menu: FC<Props> = ({ user, active, children, }) => (
  <div className="w-full flex flex-col h-screen">
    <Header
      legalEntityName={user?.businessUnit.legalEntity.name}
      businessUnitName={user?.businessUnit.name}
      userName={user?.name}
      color={user?.businessUnit.legalEntity.color}
    />
    <div className="flex-grow flex">
      <SideBar active={active} />
      <main className="py-4 mx-auto">{children}</main>
    </div>
    <Footer
      color={user?.businessUnit.legalEntity.color}
    />
  </div>
)

export default Menu