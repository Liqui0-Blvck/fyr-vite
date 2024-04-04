import React, { useState } from 'react'
import FormularioUsuario from './FormularioUsuario'
import FormularioPerfil from './FormularioPerfil'


const FormularioRegistroPerfil = () => {
  const [step, setStep] = useState<number>(1)


  const handleChangeStep = () => {
    setStep(prev => prev + 1)
  }

  return (
    <div className='h-full relative'>
      <div className={`px-5 w-full absolute ${step !== 1 ? '-translate-x-full ease-out duration-100': 'translate-x-0 duration-100'}`}>
        <FormularioUsuario  setStep={setStep}/>
      </div>
      <div className={`px-5 w-full absolute ${step === 1 ? '-translate-x-full ease-out duration-100': 'translate-x-0 duration-100'}`}>
        <FormularioPerfil />
      </div>
    </div>
  )
}

export default FormularioRegistroPerfil
