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
  width?: string
  height?: string 
}

const ModalRegistro: FC<IComponentProps> = ({ children, open, setOpen, title, textButton, size, icon, textTool, width, height }) => {
  return (
    <>
      <Tooltip title={textTool}>
        <button
          type='button'
          className={`${width} ${height} rounded-md flex items-center justify-center text-white'`}
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
