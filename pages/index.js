import Head from 'next/head'

import { Sidebar, Feed } from '../components'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar />
        <Feed />
      </main>
    </div>
  )
}
