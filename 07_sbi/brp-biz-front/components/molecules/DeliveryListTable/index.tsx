import React, { useState } from "react";
import { useTable } from "react-table";
import { columns, data } from "./deliveries"
import Button from "@/components/atoms/Button";
import Delivery from "@/components/atoms/Icons/Delivery";
import { VcForBusinessUnit } from "@prisma/client";
import VerifiableCredential from "@/components/molecules/VerifiableCredential";
import Overlay from "@/components/atoms/Overlay";

interface DeliveryListProps {
  credential: VcForBusinessUnit
}

const DeliveryListTable: React.FC<DeliveryListProps> = ({ credential }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  const [isToDeliver, setToDeliver] = useState(false)
  const [isReadyForDelivery, setReadyForDelivery] = useState(false)
  const [isDelivered, setDelivered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)


  const openDetails = () => {
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
  }

  return (
    <div>
      <table className="table w-[80vw] flex grow justify-center items-end right-0" {...getTableProps()}>
        <thead className="justify-center items-end">
          {headerGroups.map((headerGroup) => (
            <tr className="w-full h-12" key={""} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className="bg-slate-700 text-white " key={""} {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>
              ))}
              <th className="bg-amber-400">証明書</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr className="w-full items-center h-12" key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td className="text-center" key={index} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  )
                })}
                {isReadyForDelivery && <td><div className="flex justify-center items-center hover:cursor-pointer" onClick={openDetails}><Delivery size={20} /></div></td>}
                {isToDeliver && <div className="flex space-x-2 mx-3"><Button>出荷準備</Button><button className="bg-slate-300 text-white rounded-full px-8" disabled>出荷実施</button></div>}
                {isDelivered && <div className="flex space-x-2 mx-3"><button className="bg-slate-300 text-white rounded-full px-8" disabled>出荷準備</button><button className="bg-slate-300 text-white rounded-full px-8" disabled>出荷実施</button></div>}
              </tr>
            )
          })}
        </tbody>
      </table>
      {showDetails && <Overlay open>
        <div className='bg-white my-4 rounded-lg'>
          <div className="flex grow justify-end mt-12 mr-8"><Button color="secondary" onClick={closeDetails}>閉じる</Button></div>
          <VerifiableCredential vcForBusinessUnit={credential}></VerifiableCredential>
        </div>
      </Overlay>}
    </div>
  )
}

export default DeliveryListTable