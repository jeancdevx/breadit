'use client'

import dynamic from 'next/dynamic'
import { type FC } from 'react'
import CustomCodeRenderer from '../renderers/CustomCodeRenderer'
import CustomImageRenderer from '../renderers/CustomImageRenderer'

interface EditorOutputProps {
  content: any
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  }
}

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className='text-sm'
      renderers={renderers}
      data={content}
    />
  )
}

export default EditorOutput
