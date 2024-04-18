import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import Label from '../../../../components/form/Label'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useFormik } from 'formik'
import { tipo_informe } from '../../../../utils/estadosConstantes'
import Input from '../../../../components/form/Input'
import Button from '../../../../components/ui/Button'
import { useAuth } from '../../../../context/authContext'
import DateRangePicker from '../../../../components/DateRange'
import dayjs from 'dayjs'
import { DateRange, Range } from 'react-date-range';
import colors from 'tailwindcss/colors';
import { useNavigate } from 'react-router-dom'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { TOperarioProduccion } from '../../../../types/registros types/registros.types'

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioKilosOperarios: FC<IInformeProduccion> = ({ setOpen }) => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().toDate(),
			endDate: undefined,
			key: 'selection',
		},
	]);

  const { data: operarios } = useAuthenticatedFetch<TOperarioProduccion[]>(
    authTokens,
    validate,
    `/api/registros/operarios`
  )

  console.log(operarios)

  const optionOperarios: TSelectOptions = operarios?.map((operario) => ({
    value: String(operario.id),
    label: `${operario.nombre} ${operario.apellido}`
  })) ?? []


  const formik = useFormik({
    initialValues: {
      operario: '',
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/produccion/pdf_operarios/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
            desde: state[0].startDate,
            hasta: state[0].endDate
          })
        })

        if (res.ok){
          const data = await res.json()
          navigate('/app/pdf-operario-x-kilo/', { state: { produccion: data }})
        }
      } catch (error) {
        console.log("Algo ocurrio")
      }
    }
  })

  console.log(formik.values)
  
  return (
    <div className='w-full h-full'>
      <form className='flex flex-col gap-y-5' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col md:flex-row lg:flex-row gap-10'>
          <div className='w-full'>
            <Label htmlFor='operarios'>Operarios: </Label>
                  
              <Validation
              isValid={formik.isValid}
              isTouched={formik.touched.tipo_informe ? true : undefined}
              invalidFeedback={formik.errors.tipo_informe ? String(formik.errors.tipo_informe) : undefined}
              >
              <FieldWrap>
                <SelectReact
                  options={optionOperarios}
                  id='operario'
                  placeholder='Selecciona un opción'
                  name='operario'
                  className='h-12'
                  onChange={(value: any) => {
                    formik.setFieldValue('operario', value.value)
                  }}
                />
              </FieldWrap>
              </Validation>
          </div>

          <div className='w-full h-full flex flex-col relative -top-1'>
            <span>Selecciona rango de fecha</span>
            <DateRangePicker setState={setState} state={state}/>
          </div> 
        </div>

        <div className='w-full  flex items-center justify-center gap-x-10'>
          <button 
            type='submit' 
            className='w-40 px-4 py-4 rounded-md bg-[#198754] hover:bg-[#1da566] hover:scale-105 font-semibold text-md'
            >
              Generar Informe
          </button>
          <button 
            type='button' 
            className='w-40 px-5 py-4 rounded-md bg-red-700 hover:bg-red-600 hover:scale-105 font-semibold text-md'
            onClick={() => setOpen(false)}
            >
              Volver
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioKilosOperarios
