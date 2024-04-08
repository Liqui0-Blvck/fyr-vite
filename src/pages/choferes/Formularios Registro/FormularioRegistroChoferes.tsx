import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAuth } from '../../../context/authContext'
import { conductorSchema } from '../../../utils/Validator'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'

interface IFormChoferes {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroChoferes: FC<IFormChoferes> = ({ setOpen, refresh }) => {
  const { authTokens } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      rut: "",
      telefono: ""
    },
    validationSchema: conductorSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/registros/choferes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`

          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El conductor fue registrado exitosamente!!")
          setOpen(false)
          refresh(true)
          navigate('/app/conductores')

        } else {
          toast.error("No se pudo registrar el conductor volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`
          flex flex-col 
          md:grid md:grid-cols-4 gap-x-4 gap-y-8 mt-10 
          relative p-4 ${isDarkTheme ? oneDark : oneLight} rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <Label htmlFor='nombre'>Nombre: </Label>

        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.nombre ? true : undefined}
          invalidFeedback={formik.errors.nombre ? String(formik.errors.nombre) : undefined}
          validFeedback='Good'>
          <FieldWrap>
          <Input
            type='text'
            name='nombre'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.nombre}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='apellido'>Apellido: </Label>

        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.apellido ? true : undefined}
          invalidFeedback={formik.errors.apellido ? String(formik.errors.apellido) : undefined}
          validFeedback='Good'>
          <FieldWrap>
          <Input
            type='text'
            name='apellido'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.apellido}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='rut'>Rut: </Label>

        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.rut ? true : undefined}
          invalidFeedback={formik.errors.rut ? String(formik.errors.rut) : undefined}
          validFeedback='Good'>
          <FieldWrap>
          <Input
            type='text'
            name='rut'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.rut}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='telefono'>Contacto: </Label>

        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.telefono ? true : undefined}
          invalidFeedback={formik.errors.telefono ? String(formik.errors.telefono) : undefined}
          validFeedback='Good'>
          <FieldWrap>
          <Input
            type='text'
            name='telefono'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.telefono}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:row-start-3 md:col-span-2 md:col-start-3 h-14 w-full   '>
        <button className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>Registrar Conductor</button>
      </div>
    </form>
  )
}

export default FormularioRegistroChoferes
