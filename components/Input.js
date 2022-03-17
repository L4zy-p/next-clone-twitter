import React, { useState, useRef, useEffect } from 'react'
import { Picker } from 'emoji-mart'
import {
  XIcon,
  PhotographIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  CalendarIcon
} from '@heroicons/react/outline'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc
} from '@firebase/firestore'

import { getDownloadURL, ref, uploadString } from '@firebase/storage'

import { db, storage } from '../firebase'

const Input = () => {
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [loading, setLoading] = useState(false)
  const filePickerRef = useRef()

  const addEmoji = (e) => {
    // e เป็น object ที่มาจาก emoji picker และในนี้จะมี unified ที่แสดง code อยู่
    let sym = e?.unified?.split('_')

    let codeArray = []
    // ทำการวนค่า เพื่อใส่ 0x ใน code เพื่อที่จะเอามาแปลงเป็นตัวเลข
    sym.forEach((el) => codeArray.push('0x' + el))

    // นำตัวเลขมาหา emoji
    let emoji = String.fromCodePoint(...codeArray)
    setInput(input + emoji)
  }

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e?.target?.files[0]) {
      reader.readAsDataURL(e?.target?.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent?.target?.result)
    }
  }

  const sendPost = async () => {
    if (loading) {
      return
    }
    setLoading(true)

    // addDoc น่าจะเหมือน Insert อ้างอิง colecction หรือ table จาก db และชื่อ colection
    const docRef = await addDoc(collection(db, 'posts'), {
      // id: session.user.uid,
      // username: session.user.name,
      // userImg: session.user.image,
      // tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp()
    })

    // อ้างอิงไปยังที่เก็บรูปภาพ จาก id ที่เราสร้าง post ไป
    const imageRef = ref(storage, `posts/${docRef.id}/image`)

    if (selectedFile) {
      // ทำการอัพโหลดรูปเมื่อมี file
      await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
        // get url ที่เก็บรูปเพื่อนำมาอัพเดตเก็บลิงค์ที่อยู่รูปภาพ มาใน Post ที่เรา post ไป
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL
        })
      })
    }

    setLoading(false)
    setInput('')
    setSelectedFile(null)
    setShowEmojis(false)
  }

  const handleDocumentClick = event => {
    let isEmojiClassFound = false

    event &&
      event.path &&
      event.path.forEach(elem => {
        if (elem && elem.classList) {
          const data = elem.classList.value
          if (data.includes('emoji')) {
            isEmojiClassFound = true
          }
        }
      }) // end
    if (isEmojiClassFound === false && event.target.id !== 'emojis-btn')
      setShowEmojis(false)
  }

  useEffect(() => {
    // document.addEventListener('click', handleDocumentClick, false)
  })

  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-3
    overflow-y-scroll ${loading && 'opacity-60'}`}>
      <img
        src='https://lh3.googleusercontent.com/ogw/ADea4I6m4ISPB41dErVc4QxcFpHclSNH3mtu4UC-2Qxc=s32-c-mo'
        alt='user'
        className='h-11 w-11 rounded-full cursor-pointer' />

      {/* divide-y คือ การแบ่งระหว่าง แกน y ภายในลูก div ด้วย 1px นี้ 
        ถ้า ตามด้วย divide-gray-700 จะเป็นการแบ่งลูกทุกตัวด้วย เส้นแบ่งสีเทา
        */}
      <div className='w-full divide-y divide-gray-700'>
        <div className={`${selectedFile && 'pb-7'} ${input && 'space-y-2.5'}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e?.target?.value)}
            rows='2'
            placeholder={`What's happening?`}
            className='bg-transparent outline-none text-[#d9d9d9]
          text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]' />

          {selectedFile &&
            <div className='relative'>
              <div
                className='absolute w-8 h-8 bg-[#15161c] 
          hover:bg-[#272c26] bg-opacity-75 rounded-full 
          flex items-center justify-center top-1 left-1 
          cursor-pointer'
                onClick={() => setSelectedFile(null)}>
                <XIcon className='text-white h-5' />
              </div>
              <img src={selectedFile} alt='' className='rounded-2xl max-h-80 object-contain' />
            </div>
          }
        </div>

        {!loading &&
          <div className='flex items-center justify-between pt-2.5'>
            <div className='flex items-center'>

              <div className='icon' onClick={() => filePickerRef?.current?.click()}>
                <PhotographIcon className='h-[22px] text-[#1d9bf0]' />
                <input
                  type='file'
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef} />
              </div>

              <div className='icon rotate-90'>
                <ChartBarIcon className='text-[#1d9bf0] h-[22px]' />
              </div>

              <div className='icon' onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className='text-[#1d9bf0] h-[22px]' />
              </div>

              <div className='icon'>
                <CalendarIcon className='text-[#1d9bf0] h-[22px]' />
              </div>

              {showEmojis &&
                <Picker
                  // id='emojis-btn'
                  onClick={addEmoji}
                  style={{
                    position: 'absolute',
                    marginTop: '450px',
                    marginLeft: -40,
                    maxWidth: '320px',
                    borderRadius: '20px'
                  }}
                  theme='dark'
                />
              }
            </div>
            <button className='bg-[#1d9bf0] text-white rounded-full 
        px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] 
        disabled:hover:bg-[#1d9bf0] disabled:opacity-50 
        disabled:cursor-default'
              disabled={!input?.trim() && !selectedFile}
              onClick={sendPost}>Tweet</button>
          </div>
        }
      </div>
    </div>
  )
}

// tracking-wide คือ letter-spacing

export default Input