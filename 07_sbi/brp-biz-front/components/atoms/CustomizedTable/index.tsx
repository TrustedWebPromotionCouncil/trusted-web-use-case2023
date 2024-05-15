import React from "react";

interface TableItemProps {
  items?: string[]
}

interface CustomizedTableProps {
  name?: string,
  columns: string[]
  rows: TableItemProps[]
  hasDetails?: boolean
  detailBackgroundColor?: string
  actionButton?: React.ReactNode
}

const CustomizedTable: React.FC<CustomizedTableProps> = ({ name, columns, rows, hasDetails, detailBackgroundColor, actionButton }) => {
  return (
    <div className="table w-[80vw] flex grow justify-center items-end ml-8">
      {name && <div className="table-name flex grow w-full">{name}</div>}
      <table cellSpacing={2} cellPadding={3} className="w-full">
        <thead className="w-full justify-center items-end">
          <tr className="w-full h-12">
            {columns.map((column, accessor) => (
              <th key={accessor} className="bg-slate-700 text-white text-center">{column}</th>
            ))}
            {hasDetails ? <th className={`${detailBackgroundColor} text-center mx-auto h-12`}>詳細</th> : ""}
          </tr>
        </thead>
        <tbody className="py-2 w-full">
          {rows.map((row, rIndex) =>
            <tr key={rIndex} className="w-full px-auto">
              {row.items?.map((item, iIndex) => (
                <td key={iIndex} className="text-center">{`${item}`}</td>))}
              {hasDetails ? <td className="flex justify-center items-center mx-auto h-12">
                {actionButton ? actionButton : "-"}
              </td> : ""}
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default CustomizedTable