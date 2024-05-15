import Button from '@/components/atoms/Button'
import Overlay from '@/components/atoms/Overlay'
import { Order } from '@/types'
import { FC } from 'react'
import styled from 'styled-components'

interface ShippedModalProps {
  open?: boolean;
  order: Order | null;
  onClose?: () => void;
}

const UL = styled.ul`
li:before {
  content: '■';
}
`

const ShippedModal: FC<ShippedModalProps> = ({ open, order, onClose }) => {
  return (
    <Overlay open={open} onBackdropClick={onClose}>
      <div className="bg-white flex flex-col justify-center py-8 px-14 border rounded-2xl gap-8" style={{ width: '445px', height: '364px' }}>
        <div className="text-left text-lg bg-stone-200 p-8">
          <UL>
            <li>製品名：{order?.lot.product.name}</li>
            <li>製品管理番号：{order?.lot.product.number}</li>
          </UL>
        </div>
        <p>出荷しました。</p>
        <div>
          <Button color="secondary" onClick={onClose}>閉じる</Button>
        </div>
      </div>
    </Overlay>
  )
}

export default ShippedModal