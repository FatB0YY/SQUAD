'use client'

import Image from 'next/image'
import { VscClose } from 'react-icons/vsc'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string
  endpoint: 'messageFile' | 'serverImage'
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={value}
          alt='Upload'
          className='rounded-full'
        />
        <button
          onClick={() => onChange('')}
          className='bg-rose-500 text-white rounded-full absolute top-0 right-0 shadow-md'
          type='button'
        >
          <VscClose className='h-4 w-4' />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.error('Error:', error)
      }}
    />
  )
}
