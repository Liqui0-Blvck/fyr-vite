import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { BaseText } from 'slate'

type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

type HeadingOneElement = {
  type: 'heading-one'
  children: CustomText[]
}

type HeadingTwoElement = {
  type: 'heading-two'
  children: CustomText[]
}

type BlockQuoteElement = {
  type: 'block-quote'
  children: CustomText[]
}

// Agrega todos los tipos de elemento que uses (numbered-list, bulleted-list, etc.)

type CustomElement = ParagraphElement | HeadingOneElement | HeadingTwoElement | BlockQuoteElement // ... y así con todos

type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
