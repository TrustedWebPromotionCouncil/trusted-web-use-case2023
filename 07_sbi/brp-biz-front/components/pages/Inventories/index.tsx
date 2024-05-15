import PageWithMenu from '@/components/templates/PageWithMenu'
import PresentationModal from '@/components/molecules/PresentationModal'
import { useState, useEffect } from 'react'
import { Order, User } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'
import TaskList from '@/components/atoms/Icons/TaskList'
import { VerificationResult } from '@/types/VerificationResult'
import { VcForBusinessUnit } from '@/types/VcForBusinessUnit'
import Enter from '@/components/atoms/Icons/Enter'


interface Props {
  user: User;
  orders: Order[];
  // eslint-disable-next-line no-unused-vars
  onValidate?: (orderId: number) => void;
  processing?: boolean;
}


const Inventories = ({ user, orders: initialOrders, onValidate, processing }: Props) => {
  const [showPresentationModal, setShowPresentationModal] = useState(false)
  const [showUpperPresentationModal, setShowUpperPresentationModal] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [inquiredIndex, setInquiredIndex] = useState<number | null>(null)
  const [businessUnitQVc, setBusinessUnitQVc] = useState<VcForBusinessUnit | null>(null)
  const [vc, setVc] = useState<VcForBusinessUnit | null>(null)
  // eslint-disable-next-line no-unused-vars
  const [isValid, setValidity] = useState(Boolean)
  const [showURIs, setShowURIs] = useState(false)
  const [uRIs, setURIs] = useState<Array<string>>([])
  // TODO: ordersは、現在、初期取得が実装で、以後MoqになるためuseStateを設置
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);


  const createMockVc = async () => {
    const response = await fetch('/api/vcs_for_business_unit?businessUnitId=8', {
      method: 'GET'
    })

    const vc = await response.json()
    if (!vc) return []

    const businessUnitQVc: VcForBusinessUnit = {
      id: 1,
      authenticationLevel: 1,
      issuerName: '',
      uuid: vc[0].uuid,
      validFrom: vc[0].validFrom,
      validUntil: vc[0].validUntil,
      original: {
        vc: {
          credentialSubject: {
            authenticatorInfo: {
              digitalCertificateOrganizationName: 'JP Digital Certificate Organization 1',
              digitalCertificateOrganizationCredentialIssuer: 'JP Accreditation Organization',
            },
            didDocument: {
              id: vc[0].original.vc.credentialSubject.didDocument.id
            },
            businessUnitInfo: {
              country: '日本',
              address: '静岡県静岡市葵区黒金町',
              businessUnitName: '事業所Q',
              contactInfo: {
                name: '',
                department: '',
                jobTitle: '',
                contactNumber: '',
              },
            },
            legalEntityInfo: {
              legalEntityIdentifier: '9010401045208',
              legalEntityName: '事業者Q',
              location: '東京',
            },
          },
          issuer: {
            id: 'did:detc:JPDigitalCertificateOrganization1:T1U9',
          }
        },

      },
      businessUnitId: 1,
      businessUnit: {},
      isPrivateVc: false,
    }

    setBusinessUnitQVc(businessUnitQVc)

  }

  const moqValidate = () => {
    const moqOrders = [{
      id: 1,
      status: 'Shipped',
      quality: 'S',
      lot: {
        name: 'ロットQ',
        number: 1,
        product: {
          name: '半導体',
          number: 'Q-5-00002',
          businessUnit: {
            name: '事業所Q',
            legalEntity: {
              name: '事業者Q'
            }
          }
        }
      },
      vp: {
        verificationResult: {
          id: 1,
          date: new Date,
          hasValidBusinessUnitSignature: true,
          hasValidVcForBusinessUnit: true,
          hasValidIssuerSignature: true,
          hasValidIssuerVc: true,
          hasValidBusinessUnitCredentialStatus: true,
          hasValidIssuerCredentialStatus: true,
          vpId: 1,
        },
      },
    }]
    setOrders(moqOrders)
    setVerificationResult({
      id: 1,
      date: new Date,
      hasValidBusinessUnitSignature: true,
      hasValidVcForBusinessUnit: true,
      hasValidIssuerSignature: true,
      hasValidIssuerVc: true,
      hasValidBusinessUnitCredentialStatus: true,
      hasValidIssuerCredentialStatus: true,
      vpId: 1,
    })
  }



  const createMoqURIs = async (): Promise<Array<string>> => {
    const response = await fetch('/api/vcs_for_business_unit?businessUnitId=8', {
      method: 'GET'
    })
    const vc = await response.json()
    if (!vc) return []
    const moqVc: VcForBusinessUnit = {
      id: 1,
      authenticationLevel: 1,
      issuerName: '',
      uuid: vc[0].uuid,
      validFrom: vc[0].validFrom,
      validUntil: vc[0].validUntil,
      original: {
        vc: {
          credentialSubject: {
            authenticatorInfo: {
              digitalCertificateOrganizationName: 'JP Digital Certificate Organization 1',
              digitalCertificateOrganizationCredentialIssuer: 'JP Accreditation Organization',
            },
            didDocument: {
              id: '',
            },
            businessUnitInfo: {
              country: '日本',
              address: '',
              contactInfo: {
                name: '',
                department: '',
                jobTitle: '',
                contactNumber: '',
              },
            },
            legalEntityInfo: {
              legalEntityIdentifier: '',
              legalEntityName: '',
              location: '',
            },
          },
          issuer: {
            id: 'did:detc:JPDigitalCertificateOrganization1:T1U9',
          }
        },

      },
      businessUnitId: 1,
      businessUnit: {},
      isPrivateVc: false,
    }

    setVc(moqVc)
    return [
      `https://192.168.0.1/pubtrust/${vc[0].uuid}`,
      //事業所QのID↓
      `https://192.168.0.1/pubtrust/fcd50e24-4515-4b98-a040-e032e9503a63`,
      // `https://192.168.0.2/pubtrust/${vc[0].original.vc.credentialSubject.linkedVP.verifiableCredential[0].credentialSubject.uuid}`
    ]
  }



  const handleValidate = async (orderId: number) => {
    // TODO: ID=9のユーザーはモックを表示する
    if (user.id === 9) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return [
        createMockVc(),
        moqValidate()
      ]
    }
    onValidate && onValidate(orderId)
  }

  const handleURIs = async (orderId: number) => {
    const order = orders.find(order => order.id === orderId)
    // TODO: order.vpからURLを抽出してurlsを代入するようなロジック
    // const urls : Array<string> = []
    const urls = await createMoqURIs()
    setURIs(urls)
    setShowURIs(true)
  }

  const handleInquire = async (index: number) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    setInquiredIndex(index)
    // TODO: URIに問い合わせてpublicなVCを取得するロジック
    // setVc()
    // setVerificationResult()
    setVerificationResult({
      id: 1,
      date: new Date,
      hasValidBusinessUnitSignature: true,
      hasValidVcForBusinessUnit: true,
      hasValidIssuerSignature: true,
      hasValidIssuerVc: true,
      hasValidBusinessUnitCredentialStatus: true,
      hasValidIssuerCredentialStatus: true,
      vpId: 1,
    })
  }

  const handleShowPresentation = (e: any) => {
    e.preventDefault()
    setShowPresentationModal(true)
  }

  const handleShowResult = (item: VerificationResult) => {
    setShowUpperPresentationModal(true)

    const validCondition = [
      item.hasValidBusinessUnitCredentialStatus,
      item.hasValidBusinessUnitSignature,
      item.hasValidIssuerCredentialStatus,
      item.hasValidIssuerSignature,
      item.hasValidIssuerVc,
      item.hasValidVcForBusinessUnit,
    ]

    if (validCondition.every((i) => i === true)) {
      setValidity(true)
    } else setValidity(false)
  }

  const closeURIs = () => {
    setInquiredIndex(-1)
    setShowURIs(false)
  }

  return (
    <PageWithMenu
      user={user}
      active="inventories">
      <div className="pt-10 pl-6 flex overflow-x-auto">
        <table className="table-auto flex-none mb-12">
          <thead>
            <tr>
              <th className="h-12 bg-slate-700 text-white px-2">製品名</th>
              <th className="h-12 bg-slate-700 text-white px-2">製造管理番号</th>
              <th className="h-12 bg-slate-700 text-white px-2">ロット名</th>
              <th className="h-12 bg-slate-700 text-white px-2">ロット数</th>
              <th className="h-12 bg-slate-700 text-white px-2">事業者名</th>
              <th className="h-12 bg-slate-700 text-white px-2">出荷場所</th>
              <th className="h-12 bg-slate-700 text-white px-2">信頼性グレード</th>
              <th className="h-12 bg-red-400 px-2">詳細</th>
              <th className='h-12 bg-red-400 px-2'>製造場所確認</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter((order) => order.status === "Shipped").map(order =>
              <tr key={order.id} className="h-12 text-center">
                <td>{order.lot.product.name}</td>
                <td>{order.lot.product.number}</td>
                <td>{order.lot.name}</td>
                <td>{order.lot.number}</td>
                <td>{order.lot.product.businessUnit.legalEntity.name}</td>
                <td>{order.lot.product.businessUnit.name}</td>
                <td>{order.quality}</td>
                <td width={120}>
                  {!order.quality ?
                    <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleValidate(order.id)}>検証実施</a> :
                    order.quality == 'S' ? <a href='#' className='flex justify-center items-center' onClick={() => handleShowResult(order!.vp!.verificationResult!)}><TaskList size={23} /></a> : '-'
                  }
                </td>
                <td>
                  {order.quality && !showURIs && <a href="#" className='text-blue-600 dark:text-blue-500 hover:underline' onClick={() => handleURIs(order.id)}>URIs</a>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showURIs &&
        <div className="pt-10 pl-6 flex overflow-x-auto">
          <table className="table-auto flex-none mb-12">
            <thead>
              <tr>
                <th className="h-12 bg-slate-700 text-white px-2">No.</th>
                <th className="h-12 bg-slate-700 text-white px-2 min-w-[400px]">製造場所の問い合わせURIs</th>
                <th className="h-12 bg-red-400 px-2 w-32">詳細</th>
              </tr>
            </thead>
            <tbody>
              {uRIs.map((uri, index) => (
                <tr key={index} className="h-12 text-center">
                  <td>{index + 1}</td>
                  <td>{uri}</td>
                  <td>
                    {index === inquiredIndex ? (
                      <a href='#' className='flex justify-center items-center' onClick={(e) => handleShowPresentation(e)}><TaskList size={23} /></a>
                    ) : (
                      <a href="#" className='text-blue-600 dark:text-blue-500 hover:underline' onClick={() => handleInquire(index)}>問い合わせ</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 ml-10">
            <div className="mb-2 font-bold">
              <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline" onClick={() => closeURIs()}>
                入荷管理画面に戻る
              </a>
            </div>
            <a href="#" className="flex items-center justify-center my-4 text-blue-600 dark:text-blue-500 hover:underline font-bold ">
              <Enter size={36}></Enter>
            </a>
          </div>
        </div>
      }
      {verificationResult && businessUnitQVc && showUpperPresentationModal && <PresentationModal user={user} open={showUpperPresentationModal} vcForBusinessUnit={businessUnitQVc} verificationResult={verificationResult} onClose={() => setShowUpperPresentationModal(false)}></PresentationModal>}
      {verificationResult && vc && <PresentationModal open={showPresentationModal} verificationResult={verificationResult} vcForBusinessUnit={vc} onClose={() => setShowPresentationModal(false)} />}
      <ProcessingModal open={processing} />
    </PageWithMenu>
  )
}

export default Inventories
