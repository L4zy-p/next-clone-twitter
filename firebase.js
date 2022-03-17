
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// copy มาจากตอนที่เราไป create firestore database ใน firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC5FvLNGsBBEpzVEYff3CUFOk8qKNRITEg',
  authDomain: 'next-clone-twitter.firebaseapp.com',
  projectId: 'next-clone-twitter',
  storageBucket: 'next-clone-twitter.appspot.com',
  messagingSenderId: '545882860033',
  appId: '1:545882860033:web:d8f752f4079cc99b4e2e00'
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export default app
export { db, storage }