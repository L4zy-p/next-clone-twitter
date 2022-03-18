import Head from 'next/head'
import { getProviders, getSession, useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'

import { Sidebar, Feed, Login, Modal } from '../components'
import { modalState } from '../atoms/modalAtom'

export default function Home({ tredingResults, followResults, providers }) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useRecoilState(modalState)

  if (!session) {
    return <Login providers={providers} />
  }

  return (
    <div>
      <Head>
        <title>Twitter</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar />
        <Feed />
        {
          isOpen && <Modal />
        }
      </main>
    </div>
  )
}


export async function getServerSideProps(context) {
  const tredingResults = await fetch('https://jsonkeeper.com/b/NKEV').then((res) => res.json())

  const followResults = await fetch('https://jsonkeeper.com/b/WWMJ').then((res) => res.json())

  // เป็น Provider ที่เราใช้ในการ authen
  const providers = await getProviders()

  // เหมือนมีปัญหาเวลา เช็ค session แล้วมีการ redirect ไปหน้า login 
  // ถ้ามี session อยู่แล้ว แต่ตอน get session ยังไม่มา จะมีการแสดง login ไปแวบนึง
  // ดังนั้น จึงต้องทำการ getSession ใน getServerSideProps ก่อนที่แสดงหน้า
  const session = await getSession(context)

  return {
    props: {
      tredingResults,
      followResults,
      providers,
      session
    }
  }
}