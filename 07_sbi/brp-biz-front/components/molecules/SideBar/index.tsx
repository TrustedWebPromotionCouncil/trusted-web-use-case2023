import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { FC } from 'react'

interface SideBarProps {
  active?: string
}

const SideBar: FC<SideBarProps> = ({ ...props }) => {
  const MenuLink = ({ route, title }: { route: string, title: string }) => <Link href={`/${route}`} className={`${props.active === route ? "text-amber-200 bg-slate-500" : "text-white"} font-semibold py-3 px-4 hover:text-slate-100 hover:bg-slate-500`}>{title}</Link>
  return (
    <section className="flex" style={{ backgroundColor: '#33363F' }}>
      <section className="flex flex-col min-w-56 max-w-90 mt-12 justify-between">
        <div className='flex flex-col'>
          <MenuLink route="deliveries" title="出荷管理" />
          <MenuLink route="inventories" title="入荷管理" />
          <MenuLink route="credentials" title="証明書(VC)管理" />
          <MenuLink route="trustedlist" title="Trusted List" />
          <MenuLink route="partners" title="取引先管理" />
          <MenuLink route="settings" title="設定" />
        </div>
        <p className="text-white text-center font-semibold hover:text-slate-100 hover:bg-slate-500 w-full p-2"><button className="mx-2 my-4" onClick={() => signOut({ callbackUrl: '/' })}>サインアウト</button></p>
      </section>
    </section>
  )
}

export default SideBar