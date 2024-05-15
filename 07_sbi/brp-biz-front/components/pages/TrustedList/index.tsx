import PageWithMenu from '@/components/templates/PageWithMenu'
import Button from '@/components/atoms/Button'
import TrustedItemView from '@/components/atoms/TrustedItem'
import { useState } from 'react'
import { format } from 'date-fns'
import { User, TrustedItem } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'

interface Props {
  user: User;
  trustedItems: TrustedItem[];
  onRefresh?: () => void;
  processing?: boolean;
}

const TrustedList = ({ user, trustedItems, onRefresh, processing }: Props) => {
  const [requested, setRequested] = useState<boolean>(false)
  const handleRefresh = () => {
    setRequested(true)
    onRefresh && onRefresh()
  }

  return (
    <PageWithMenu
      active="trustedlist"
      user={user}
    >
      <div className="flex flex-col mt-6" style={{ width: 765 }}>
        <div className="flex justify-end"><Button onClick={handleRefresh}>Trusted List 更新</Button></div>
        <div className="text-sm text-gray-600">Last Updated : {requested && format(new Date(), 'yyyy/MM/dd HH:mm:ss')}</div>
        <div className="bg-gray-800 text-white text-center p-1 mb-2 w-full">Trusted List</div>
        <div className="flex flex-wrap gap-8 justify-center">
          {trustedItems.map((trustedItem, index) => <TrustedItemView key={index} trustedItem={trustedItem} />)}
          {trustedItems.length == 1 && <TrustedItemView empty={true} />}
          <TrustedItemView empty={true} />
          <TrustedItemView empty={true} />
        </div>
      </div>
      <ProcessingModal open={processing} />
    </PageWithMenu>
  )
}

export default TrustedList