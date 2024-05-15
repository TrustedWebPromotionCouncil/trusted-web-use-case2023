import PageWithMenu from '@/components/templates/PageWithMenu'
import Button from '@/components/atoms/Button'
import DeliveryPrepareModal from '@/components/molecules/DeliveryPrepareModal'
import ShippedModal from '@/components/molecules/ShippedModal'
import TaskList from '@/components/atoms/Icons/TaskList'
import { useState } from 'react'
import { Order, User, VcForBusinessUnit, VcForProduct } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'

interface Props {
  user: User;
  orders: Order[];
  vcForBusinessUnit?: VcForBusinessUnit;
  vcForProduct?: VcForProduct[];
  // eslint-disable-next-line no-unused-vars
  onReady?: (orderId: number) => void;
  // eslint-disable-next-line no-unused-vars
  onReadyWithoutVp?: (orderId: number) => void
  // eslint-disable-next-line no-unused-vars
  onShip?: (orderId: number) => void;
  processing?: boolean;
}

const Page = ({ user, orders, vcForBusinessUnit, vcForProduct, onReady, onShip, onReadyWithoutVp, processing }: Props) => {
  const [showDeliveryPrepareModal, setShowDeliveryPrepareModal] = useState(false)
  const [showShippedModal, setShowShippedModal] = useState(false)
  const [orderId, setOrderId] = useState<number>()
  const [showCredential, setShowCredential] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)



  const handleShowDeliveryPrepareModal = (orderId: number) => {
    setOrderId(orderId)
    setShowDeliveryPrepareModal(true)
  }

  const handleReady = () => {
    onReady && onReady(orderId!)
    setShowCredential(true)
  }

  const handleReadyWithOutVp = () => {
    onReadyWithoutVp && onReadyWithoutVp(orderId!)
    setShowCredential(false)
  }

  const handleShip = (id: number) => {
    onShip && onShip(id!)
  }


  const handleShowShippedModal = (order: Order) => {
    setOrder(order)
    setShowShippedModal(true)
  }

  const createDate = (date: string) => {
    const result = new Date(date)
    return result.toLocaleString('sv-SE')

  }

  return (
    <PageWithMenu
      user={user}
      active="deliveries">
      <div className="pt-10 pl-6 flex overflow-x-auto">
        <table className="table-auto flex-none mb-12">
          <thead>
            <tr>
              <th className="h-12 bg-slate-700 text-white px-2">製品名</th>
              <th className="h-12 bg-slate-700 text-white px-2">製造管理番号</th>
              <th className="h-12 bg-slate-700 text-white px-2">ロット名</th>
              <th className="h-12 bg-slate-700 text-white px-2">ロット数</th>
              <th className="h-12 bg-slate-700 text-white px-2">出荷場所</th>
              <th className="h-12 bg-slate-700 text-white px-2">ステータス</th>
              <th className="h-12 bg-slate-700 text-white px-2">取引先</th>
              <th className="h-12 bg-slate-700 text-white px-2">納品先</th>
              <th className="h-12 bg-slate-700 text-white px-2">出荷日付</th>
              <th className="h-12 bg-amber-400 px-2">証明書</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order =>
              <tr key={order.id} className="h-12 text-center">
                <td className="px-2">{order.lot.product.name}</td>
                <td className="px-2">{order.lot.product.number}</td>
                <td className="px-2">{order.lot.name}</td>
                <td className="px-2">{order.lot.number}</td>
                <td className="px-2">{order.lot.product.businessUnit.name}</td>
                <td className="px-2">{order.status == 'Shipped' ? '出荷済み' : '在庫'}</td>
                <td className="px-2">{order.shippingFor.legalEntity.name}</td>
                <td className="px-2">{order.shippingFor.name}</td>
                <td className="px-2">{order.status == 'Shipped' ? createDate(order.shippingDate!) : ''}</td>
                <td className="px-2">{order.status == 'Shipped' && showCredential && <button><TaskList size={24} /></button>}</td>
                <td className="px-2">{order.status == 'Before' ? <Button color='primary' onClick={() => handleShowDeliveryPrepareModal(order.id)}>出荷準備</Button> : <button className='px-8 py-2 bg-slate-300 rounded-full' disabled>出荷準備</button>}</td>
                <td className="px-2">{order.status == 'Prepare' ? <Button color='primary' onClick={() => handleShowShippedModal(order)}>出荷実施</Button> : <button className='px-8 py-2 bg-slate-300 rounded-full' disabled>出荷実施</button>}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DeliveryPrepareModal
        open={showDeliveryPrepareModal}
        vcForBusinessUnit={vcForBusinessUnit}
        vcForProduct={vcForProduct}
        onClose={() => setShowDeliveryPrepareModal(false)}
        onReady={() => {
          handleReady()
          setShowDeliveryPrepareModal(false)
        }}
        onReadyWithOutVp={() => {
          handleReadyWithOutVp()
          setShowDeliveryPrepareModal(false)
        }}
      />
      <ShippedModal
        open={showShippedModal}
        order={order}
        onClose={() => {
          handleShip(order!.id)
          setShowShippedModal(false)
        }}
      />
      <ProcessingModal open={processing} />
    </PageWithMenu>
  )
}
export default Page