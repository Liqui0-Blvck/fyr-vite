import React from 'react'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { useFormik } from 'formik'
import { Years } from '../../../../utils/select.constanst'
import { optionYear } from '../../../../utils/generalUtils'
import { useAuth } from '../../../../context/authContext'
import { putPersonalizacionPerfil } from '../../../../api/personalizacion-perfil.api'
import Button from '../../../../components/ui/Button'
// import { Button } ''
const options: TSelectOptions = [
	{ value: '2024', label: '2024' },
	{ value: '2023', label: '2023'},
	{ value: '2022', label: '2022'},
	{ value: '2021', label: '2021'}
];

const SelectYear = () => {

  const {personalizacionData} = useAuth()

  const formik = useFormik({
    initialValues: {
      anio: personalizacionData?.anio
      // anio: ''
    },
    onSubmit: async () => {
      // const personalizacion = await putPersonalizacionPerfil()
    }
  })

  return (
    <div className='w-80 grid grid-cols-12'>
      <div className="col-span-8 pr-4">
        <SelectReact
          options={optionYear}
          id='anio'
          placeholder='Selecciona un año'
          name='año'
          onChange={(value: any) => {
            formik.setFieldValue('anio', value.value)
          }}
        />
      </div>
      <div className="col-span-4">
        { formik.dirty ? 
        <Button  variant='solid'>Guardar</Button>
        : null }
      </div>
    </div>
  )
}

export default SelectYear
