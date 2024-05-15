'use client'
import Link from 'next/link'

const handle = async (e: any) => {
  e.preventDefault();

  const response = await fetch("/api/dashboards", {
    method: "GET"
  })
  const body = await new Response(response.body).text()
  alert(body)
}


const Page = () => <div><button onClick={handle}>PAGE</button><br/><Link href="/">戻る</Link></div>

export default Page
