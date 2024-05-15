import React from "react";
import { columns, data } from "./inventories"
import CustomizedTable from "@/components/atoms/CustomizedTable";
import Delivery from "@/components/atoms/Icons/Delivery"

interface Props {
  openModal?: () => void
}

const InventoryListTable: React.FC<Props> = ({ ...props }) => {
  const inventoriesHeader = columns
  return (
    <div>
      <CustomizedTable
        columns={inventoriesHeader}
        rows={data}
        hasDetails
        detailBackgroundColor="bg-red-400"
        actionButton={
          <div onClick={props.openModal}><Delivery size={20} /></div>
        }></CustomizedTable>
    </div>
  )
}

export default InventoryListTable