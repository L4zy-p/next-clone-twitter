import React from 'react'

const SidebarLink = ({text, Icon, active}) => {
  return (
    <div className={`text-[#d9d9d9] flex items-center justify-center 
    xl:justify-start text-xl space-x-3 hoverAnimation ${active && 'font-bold'}`}>
      <Icon className='h-7'/>
      {/* xl:inline จะแสดง text เมื่อหน้าจอ เป็น size xl เท่านั้น */}
      <span className='hidden xl:inline'>{text}</span>
    </div>
  )
}

// space-x-[...] ถ้ามีการใส่ตัวนี้คือ เป็น space ของ child ที่อยู่ใน div นี้
// hidden คือ ถ้าอยู่ใน mobile size จะทำการ hidden

export default SidebarLink