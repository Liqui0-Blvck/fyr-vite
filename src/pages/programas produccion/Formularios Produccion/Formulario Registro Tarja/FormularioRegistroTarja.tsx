import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import Textarea from '../../../../components/form/Textarea'
import FieldWrap from '../../../../components/form/FieldWrap'
import Validation from '../../../../components/form/Validation'
import Label from '../../../../components/form/Label'
import Input from '../../../../components/form/Input'
import SelectReact from '../../../../components/form/SelectReact'
import { optionCalleBodega, optionTipoPatineta, optionTipoResultante } from '../../../../utils/generalUtils'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../../services/url_number'
import { useAuth } from '../../../../context/authContext'
import toast from 'react-hot-toast'
import { OPTIONS, TTabs } from '../../../../types/registros types/TabsDashboardPrograma.types'

interface IFormularioRegistroTarjaProps {
  tab: Dispatch<SetStateAction<TTabs>>
  setOpen: Dispatch<SetStateAction<boolean>>
  refresh: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroTarja: FC<IFormularioRegistroTarjaProps> = ({ tab, setOpen, refresh }) => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const formik = useFormik({
    initialValues: {
      tipo_resultante: '',
      peso: 0,
      tipo_patineta: '',
      calle_bodega: ''
    },
    onSubmit: async (values: any) => {
      const res = await fetch(`${base_url}/api/produccion/${id}/tarjas_resultantes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        },
        body: JSON.stringify({
          ...values,
          produccion: id[0]
        })
      })

      if (res.ok){
        toast.success("Tarja registrada exitosamente")
        setOpen(false)
        refresh(true)
        tab(OPTIONS.GN)
        console.log("bien hecho")
      } else {
        console.log("mal hecho")
      }
    }
  })

  console.log(formik.values)

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 dark:bg-inherit relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='tipo_resultante'>Tipo Resultante: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.tipo_resultante ? true : undefined}
            invalidFeedback={formik.errors.tipo_resultante ? String(formik.errors.tipo_resultante) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <SelectReact
                options={optionTipoResultante}
                id='tipo_resultante'
                placeholder='Selecciona un opción'
                name='tipo_resultante'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('tipo_resultante', value.value)
                }}
              />
            
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
          <Label htmlFor='peso'>Peso: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso ? true : undefined}
            invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <Input
                type='number'
                name='peso'
                onChange={formik.handleChange}
                className='py-3 text-black'
                value={formik.values.peso}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:row-start-2 md:col-span-2  md:flex-col items-center'>
          <Label htmlFor='tipo_patineta'>Tipo Patineta: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.tipo_patineta ? true : undefined}
            invalidFeedback={formik.errors.tipo_patineta ? String(formik.errors.tipo_patineta) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <SelectReact
                  options={optionTipoPatineta}
                  id='tipo_patineta'
                  placeholder='Selecciona un opción'
                  name='tipo_patineta'
                  className='h-14 py-2'
                  onChange={(value: any) => {
                    formik.setFieldValue('tipo_patineta', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-3 md:col-span-2  md:flex-col items-center'>
          <Label htmlFor='calle_bodega'>Calle Bodega: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calle_bodega ? true : undefined}
            invalidFeedback={formik.errors.calle_bodega ? String(formik.errors.calle_bodega) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <SelectReact
                  options={optionCalleBodega}
                  id='calle_bodega'
                  placeholder='Selecciona un opción'
                  name='calle_bodega'
                  className='h-14 py-2'
                  onChange={(value: any) => {
                    formik.setFieldValue('calle_bodega', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
        </div>



        <div className='relative w-full h-20 col-span-4'>
         <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Tarja
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroTarja
