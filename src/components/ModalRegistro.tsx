import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './ui/Modal';
import Button from './ui/Button';
import { Tooltip } from 'antd';
import useDarkMode from '../hooks/useDarkMode';


interface IComponentProps {
  children: ReactNode
  open: boolean
  setOpen: (isOpen: Dispatch<SetStateAction<boolean | null>>) => void
  title: string | boolean
  textButton?: string | null
  icon?: ReactNode
  size?: number,
  textTool?: string
  width?: string
  height?: string 
}

const ModalRegistro: FC<IComponentProps> = ({ children, open, setOpen, title, textButton, size, icon, textTool, width, height }) => {
  const { isDarkTheme } = useDarkMode()
  return (
    <>
      <Tooltip title={textTool}>
        <button
          type='button'
          className={`${width} ${height} text-[14px] font-700 rounded-md flex items-center justify-center ${isDarkTheme ? 'text-white' : 'text-black' }`}
          onClick={() => setOpen(true)}>
          {textButton || icon}
        </button>
      </Tooltip>
      <Modal
        size={size}
        isOpen={open}
        setIsOpen={() => setOpen(false)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </Modal>
    </>
  )
}

export default ModalRegistro
