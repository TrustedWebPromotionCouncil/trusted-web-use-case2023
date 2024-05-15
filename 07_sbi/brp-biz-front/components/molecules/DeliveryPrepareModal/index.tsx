import Button from '@/components/atoms/Button'
import MiniCertificate from '@/components/atoms/MiniCertificate'
import Overlay from '@/components/atoms/Overlay'
import { VcForBusinessUnit, VcForProduct } from '@/types'
import { FC, ChangeEvent } from 'react'
import { useState } from 'react'

interface DeliveryPrepareModalProps {
  open?: boolean;
  vcForBusinessUnit?: VcForBusinessUnit;
  vcForProduct?: VcForProduct[];
  // eslint-disable-next-line no-unused-vars
  onVpGenerate?: (values: number[]) => void;
  onClose?: () => void;
  onReady?: () => void;
  onReadyWithOutVp?: () => void;
}

const DeliveryPrepareModal: FC<DeliveryPrepareModalProps> = ({ open, vcForBusinessUnit, vcForProduct, onVpGenerate, onClose, onReady, onReadyWithOutVp }) => {
  const [generated, setGenerated] = useState(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (checkedValues.includes(Number(e.target.value))) {
      setCheckedValues(checkedValues.filter(checkedValue => checkedValue !== Number(e.target.value)))
    } else {
      setCheckedValues([...checkedValues, Number(e.target.value)])
    }
  }

  const handleGenerate = () => {
    if (onVpGenerate != undefined) {
      onVpGenerate(checkedValues)
    } else {
      setGenerated(true)
    }
    setGenerated(true)
  }

  const handleClose = () => {
    onClose && onClose()
  }

  return (
    <Overlay open={open} onBackdropClick={handleClose}>
      <div className="bg-white flex flex-col py-8 px-14 border rounded-2xl" style={{ width: '580px', height: '520px' }}>
        <div className="text-left text-2xl">VPに含める証明書を選択</div>
        <div className="flex justify-end py-8"><Button onClick={handleGenerate}>VP生成</Button></div>
        <div className="flex flex-col items-center py-2 gap-6 overflow-auto border" style={{ height: '287px' }}>
          {vcForBusinessUnit && <label className="flex gap-2 items-center">
            <MiniCertificate size={320} {...vcForBusinessUnit} type="事業所VC" />
            <input
              type="checkbox"
              value={vcForBusinessUnit?.id}
              checked={checkedValues.includes(vcForBusinessUnit?.id)}
              onChange={handleChange}
              className="w-4 h-4 ml-4"
            />
          </label>}
          {vcForProduct?.length !== 0 && vcForProduct?.map(vcForProduct =>
            <div key={vcForProduct?.id}>
              <label className="flex gap-2 items-center">
                <MiniCertificate size={320} {...vcForProduct} type="製品VC" />
                <input
                  type="checkbox"
                  value={vcForProduct?.id}
                  checked={checkedValues.includes(vcForProduct?.id)}
                  onChange={handleChange}
                  className="w-4 h-4 ml-4"
                />
              </label>
            </div>
          )}
        </div>
        <div className="flex justify-between pt-8">
          <Button color="secondary" onClick={handleClose}>閉じる</Button>
          {generated &&
            <Button color={!generated ? 'danger' : 'primary'} onClick={onReady}>{!generated && 'VP生成なしに'}出荷準備完了</Button>}
          {!generated &&
            <Button color={!generated ? 'danger' : 'primary'} onClick={onReadyWithOutVp}>{!generated && 'VP生成なしに'}出荷準備完了</Button>
          }
        </div>
      </div>
    </Overlay>
  )
}

export default DeliveryPrepareModal