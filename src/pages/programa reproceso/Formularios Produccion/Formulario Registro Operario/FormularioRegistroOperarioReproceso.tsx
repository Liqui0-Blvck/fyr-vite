import { Dispatch, FC, SetStateAction } from "react"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import SelectReact, { TSelectOptions } from "../../../../components/form/SelectReact"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TOperarioProduccion, TOperarios } from "../../../../types/registros types/registros.types"
import { useLocation } from "react-router-dom"
import { urlNumeros } from "../../../../services/url_number"
import Input from "../../../../components/form/Input"
import { OperarioProgramaSchema } from "../../../../utils/Validator"


interface IFormCamiones {
  operarios: TOperarioProduccion[]
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroOperarioProgramaReproceso: FC<IFormCamiones> = ({ refresh, setOpen, operarios: operario }) => {
  const { authTokens, validate } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const base_url = process.env.VITE_BASE_URL_DEV

  const { data: operarios } = useAuthenticatedFetch<TOperarios[]>(
    authTokens,
    validate,
    `/api/registros/operarios`
  )

  const optionOperario: TSelectOptions | [] = operarios?.map((operario: TOperarios) => ({
    value: String(operario.id),
    label: `${operario.nombre}  ${operario.apellido}`
  })) ?? []

  console.log(operario)


  const formik = useFormik({
    initialValues: {
      operario: "",
      dia: ''
    },
    validationSchema: OperarioProgramaSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/reproceso/${id}/operarios/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
            reproceso: id[0]
          })
        })
        if (res.ok) {
          toast.success("El Operario fue registrado exitosamente en producción !!")
          refresh(true)
          setOpen(false)

        } else {
          toast.error("No se pudo registrar el operario en producción, volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  console.log(formik.values)

  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 dark:bg-zinc-900 bg-zinc-100 relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='operario'>Operario: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.operario ? true : undefined}
            invalidFeedback={formik.errors.operario ? String(formik.errors.operario) : undefined}
            validFeedback='Good'>
            <FieldWrap>
            <SelectReact
                options={optionOperario}
                id='operario'
                placeholder='Selecciona un opción'
                name='operario'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('operario', value.value)
                }}
              />
            
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
          <Label htmlFor='dia'>Día de registro: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.dia ? true : undefined}
            invalidFeedback={formik.errors.dia ? String(formik.errors.dia) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <Input
                type='date'
                name='dia'
                onChange={formik.handleChange}
                className='py-3 mt-1 text-black'
                value={formik.values.dia}
              />
              
            </FieldWrap>
          </Validation>

        </div>

        <div className='relative w-full h-20 col-span-4'>
         <button
            type="submit" 
            className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3 font-semibold'>
            Registrar Operario en Programa reproceso
          </button>
        </div>
      </form>
      
  )
}

export default FormularioRegistroOperarioProgramaReproceso
