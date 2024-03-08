import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import FormularioRegistroCamiones from '../Formularios Registro/FormularioRegistroCamiones';

const ModalRegistroCamion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <span onClick={showModal} className='font-semibold'>
        Agregar Camiones
      </span>
      <Modal
        title="Registro Camiones"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={700}
      >
        <FormularioRegistroCamiones modal={setIsModalOpen} />
      </Modal>
    </>
  );
};
export default ModalRegistroCamion;