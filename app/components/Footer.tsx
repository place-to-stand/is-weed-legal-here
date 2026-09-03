'use client'

import { useState } from 'react'

import Modal, { ModalType } from './Modal'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  const [modalType, setModalType] = useState<ModalType | null>(null)

  return (
    <footer className='mx-auto flex w-full max-w-[1120px] flex-col items-center text-balance text-center'>
      <div className='text-xs'>
        The information provided on this website does not, and is not intended
        to, constitute legal or medical advice; instead, all information,
        content, and materials available on this site are for general
        informational purposes only.{' '}
        <button
          className='underline underline-offset-2 hover:no-underline'
          onClick={() => setModalType(ModalType.DISCLAIMER)}
        >
          See full disclaimer
        </button>
      </div>
      <div className='mt-6 flex flex-col gap-2 text-[14px] md:flex-row'>
        <div className='flex justify-center gap-2'>
          <span> &copy; {new Date().getFullYear()}</span>
          <a
            href='https://www.thegoodfornothings.club/'
            target='_blank'
            className='underline-offset-2 hover:underline'
            rel={pathname !== '/' ? 'nofollow' : undefined}
          >
            The Good for Nothings Club
          </a>
        </div>
        <div className='flex justify-center gap-2'>
          <span className='hidden md:block'>·</span>
          <a
            href='https://github.com/thegfnc/is-weed-legal-here'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href='https://github.com/thegfnc/is-weed-legal-here/issues/new'
            target='_blank'
            className='underline-offset-2 hover:underline'
          >
            Report an error
          </a>
        </div>
      </div>

      <Modal type={modalType} onClose={() => setModalType(null)} />
    </footer>
  )
}

export default Footer
