import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { TIPO_ACOPLADO } from '../../../utils/select.constanst'
import Textarea from '../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { optionsAcoplado } from '../../../constants/options.constants'
import { camionSchema } from '../../../utils/Validator'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'



interface IFormCamiones {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroCamiones: FC<IFormCamiones> = ({ refresh, setOpen }) => {
  const { authTokens } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode ();
  const formik = useFormik({
    initialValues: {
      patente: "",
      acoplado: false,
      observaciones: ""
    },
    validationSchema: camionSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/registros/camiones/`, {
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
          toast.success("El envase fue registrado exitosamente!!")
          refresh(true)
          setOpen(false)

        } else {
          toast.error("No se pudo registrar el envase, volver a intentar")
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
        gap-y-5 mt-10 ${ isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='patente'>Patente: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.patente ? true : undefined}
            invalidFeedback={formik.errors.patente ? String(formik.errors.patente) : undefined}
            validFeedback='Good'>
            <FieldWrap>
            <Input
              type='text'
              name='patente'
              onChange={formik.handleChange}
              className='py-3 text-black'
              value={formik.values.patente}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
          <Label htmlFor='acoplado'>Acoplado: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.acoplado ? true : undefined}
            invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <SelectReact
                options={optionsAcoplado}
                id='acoplado'
                placeholder='Selecciona un opción'
                name='acoplado'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('acoplado', value.value)
                }}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:row-start-2 md:col-span-4  md:flex-col items-center'>
          <Label htmlFor='observaciones'>Observaciones: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.observaciones ? true : undefined}
            invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
            validFeedback='Good'>
            <FieldWrap>
              <Textarea
                rows={5}
                cols={9}
                name='observaciones'
                onChange={formik.handleChange}
                value={formik.values.observaciones}
              />
            </FieldWrap>
          </Validation>
        </div>



        <div className='relative w-full h-20 col-span-4'>
         <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Camión
          </button>
        </div>
      </form>
      
  )
}

export default FormularioRegistroCamiones
