import React from 'react'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { useFormik } from 'formik'
import { Years } from '../../../../utils/select.constanst'
import { optionYear } from '../../../../utils/generalUtils'
import { useAuth } from '../../../../context/authContext'
import { putPersonalizacionPerfil } from '../../../../api/personalizacion-perfil.api'
import Button from '../../../../components/ui/Button'
import toast from 'react-hot-toast'

// import { Button } ''
const options: TSelectOptions = [
	{ value: '2024', label: '2024'},
	{ value: '2023', label: '2023'},
	{ value: '2022', label: '2022'},
	{ value: '2021', label: '2021'},
    { value: 'Todo', label: 'Todo'}
];

const SelectYear = () => {

    const {personalizacionData, authTokens, refreshToken} = useAuth()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            anio: personalizacionData?.anio ? personalizacionData.anio : ''
        },
        onSubmit: async (values) => {
            const personalizacion = await putPersonalizacionPerfil({estilo: personalizacionData.estilo, cabecera: personalizacionData.cabecera, anio: values.anio}, authTokens?.access, personalizacionData.user.id)
            let valido = false
            if (personalizacion == 401) {
                const access = await refreshToken()
                if (access) {
                    const personalizacion_v = await putPersonalizacionPerfil({estilo: personalizacionData.estilo, cabecera: personalizacionData.cabecera, anio: values.anio}, access, personalizacionData.user.id)
                    if (personalizacion_v) {
                        valido = true
                    }
                }
            } else if (personalizacion == true) {
                valido = true
            }
            if (valido) {
                toast.success('Cambiando año...')
                location.reload()
            } else {
                toast.error('Error inesperado al cambiar el año')
            }
        }
    })
    return (
        <div className='w-80 grid grid-cols-12'>
            <div className="col-span-8 pr-4">
                <SelectReact
                options={options} 
                id='anio'
                placeholder='Selecciona un año'
                name='año'
                value={{value: formik.values.anio, label: formik.values.anio}}
                onChange={(value: any) => {
                    formik.setFieldValue('anio', value.value)
                }}
                variant='solid'
                />
            </div>
            <div className="col-span-4">
                { formik.dirty ? 
                    <Button variant='solid' onClick={() => {formik.submitForm()}}>Guardar</Button>
                : null }
            </div>
        </div>
    )
}

export default SelectYear
