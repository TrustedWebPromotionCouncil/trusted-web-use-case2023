import Button from '@/components/atoms/Button'
import Overlay from '@/components/atoms/Overlay'
import { Contract, User } from '@/types';
import { FC, useState } from 'react'
import styled from 'styled-components'

interface ChallengeVcRequestModalProps {
  open?: boolean;
  contract: Contract;
  user: User;
  onClose?: () => void;
  onSend?: () => void;
}

const UL = styled.ul`
li:before {
  content: '';
}
`

const ChallengeVcRequestModal: FC<ChallengeVcRequestModalProps> = ({ open, contract, user, onClose, onSend }) => {
  const [isRequestSent, setRequestSent] = useState(false)

  const handleSendRequest = async () => {
    const body = {
      contractId: contract.id,
      businessUnitId: user.businessUnit.id,
    }
    await fetch('/api/challenge', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    setRequestSent(true)
    onSend && onSend()
  }

  return (
    <Overlay open={open} onBackdropClick={onClose}>
      <div className="bg-white flex flex-col justify-center py-8 px-14 border rounded-2xl gap-8" style={{ width: '518px', height: '464px' }}>
        <div className="text-left px-28 text-lg bg-stone-200 p-8 rounded-xl">
          <UL>
            <li>・事業者名：{contract?.partyB.legalEntity.name}</li>
            <li>・事業所名：{contract?.partyB.name}</li>
            <br /><br />
            <li>・依頼するVPの構成</li>
            <li className='pl-4'>- Challenge VC</li>
            <li className='pl-4'>- 事業所VC</li>
          </UL>
        </div>
        {!isRequestSent ? <p>検証可能な証明書の提示を依頼する</p> : <p>検証可能な証明書の提示を依頼完了</p>}
        {!isRequestSent ?
          <div className='flex justify-between items-center'>
            <Button color="secondary" onClick={onClose}>戻る</Button>
            <Button color="primary" onClick={handleSendRequest}>実行</Button>
          </div> : <div className='flex justify-center items-center'><Button color='secondary' onClick={onClose}>閉じる</Button></div>}
      </div>
    </Overlay>
  )
}

export default ChallengeVcRequestModal