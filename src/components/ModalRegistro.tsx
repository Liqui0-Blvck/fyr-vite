import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './ui/Modal';
import Button from './ui/Button';
import { Tooltip } from 'antd';


interface IComponentProps {
  children: ReactNode
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  textButton?: string
  icon?: ReactNode
  size?: number,
  textTool?: string
}

const ModalRegistro: FC<IComponentProps> = ({ children, open, setOpen, title, textButton, size, icon, textTool}) => {
  return (
    <>
      <Tooltip title={textTool}>
        <button 
          type='button' 
          className='w-10 h-10 bg-blue-800 rounded-md flex items-center justify-center' 
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
