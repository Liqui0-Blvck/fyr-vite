import React from 'react'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { useFormik } from 'formik'
import { Years } from '../../../../constants/select.constanst'
import { optionYear } from '../../../../utils/generalUtils'

const SelectYear = () => {
  const formik = useFormik({
    initialValues: {
      year: ''
    },
    onSubmit: async () => {
      
    }
  })

  


  return (
    <div className='w-56'>
      <SelectReact
        options={optionYear}
        id='ubicacion'
        placeholder='Selecciona un año'
        name='año'
        className='w-40 h-12 px-3 py-2'
        onChange={(value: any) => {
          formik.setFieldValue('ubicacion', value.value)
        }}
      />
    </div>
  )
}

export default SelectYear
