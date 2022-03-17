import { SessionProvider } from "next-auth/react"

import '../styles/globals.css'
import 'emoji-mart/css/emoji-mart.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // SessionProvider จะทำให้เราใช้ session context ได้
  return <SessionProvider session={session}>
  <Component {...pageProps} />
</SessionProvider>
}

export default MyApp
