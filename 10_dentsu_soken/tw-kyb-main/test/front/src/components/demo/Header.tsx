import Logout from './Icon/Logout';
import Person from './Icon/Person';
import Group from './Icon/Group';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAccount } from '@/hooks/useAccount';
import { useRouter } from 'next/router';

export type HeaderParams = {
  name: string;
  id: string;
  isGroup: boolean;
};

export default function Header({ name, id, isGroup }: HeaderParams) {
  const { logout } = useFirebaseAuth();
  const { currentAccount } = useAccount();
  const router = useRouter()

  const onLogout = () => {
    logout();
    router.push('/demo/wallet/00_login')
  }
  return (
    <header className="fixed top-0 z-50 w-screen h-[52px] pl-[21px] pr-[15px] flex items-center justify-between bg-demo-header">
      <button onClick={onLogout}>
        <Logout size={18} className="fill-black"/>
      </button>
      <div className="flex gap-1 items-center">
        <span className="text-sm text-demo-gray">{currentAccount?.name}</span>
        {!!currentAccount && currentAccount.isGroup ? (
          <Group size={45} />
        ) : (
          currentAccount && (
            <Person
              name={currentAccount.name}
              id={currentAccount.id}
              size={45}
            />
          )
        )}
      </div>
    </header>
  );
}
