export const columns = [
	{ Header: "製品名", accessor: "productName" },
	{ Header: "製造管理番号", accessor: "productManageSeries" },
	{ Header: "ロット名", accessor: "lotName" },
	{ Header: "ロット数", accessor: "lotNumber" },
	{ Header: "事業者名", accessor: "businessUnitName" },
	{ Header: "出荷場所", accessor: "deliverer" },
	{ Header: "信頼性グレード", accessor: "trustLevel" },
];

export const data =
	[
		{
			productName: "電源ケーブル",
			productManageSeries: "Y-7-00001",
			lotName: "ロットY",
			lotNumber: "1",
			businessUnitName: "部品メーカーB",
			deliverer: "工場Ｙ",
			trustLevel: ""
		},
		{
			productName: "電源ケーブル",
			productManageSeries: "Y-7-00001",
			lotName: "ロットX",
			lotNumber: "1",
			businessUnitName: "部品メーカーB",
			deliverer: "倉庫X",
			trustLevel: "B"
		}
	]