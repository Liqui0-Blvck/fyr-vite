import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'

interface IFormCC {
  id_lote: number
  refresh: Dispatch<SetStateAction<boolean>>
  isOpen: Dispatch<SetStateAction<boolean>>
}

interface IInitialValues {
  pepa: number,
  peso_muestra: number,
  basura: number,
  pelon: number,
  cascara: number,
  ciega: number
  pepa_huerto: number
}

const FormularioCCRendimiento : FC<IFormCC> = ({ id_lote, refresh, isOpen }) => {
  const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode ();

  const formik = useFormik({
    initialValues: {
      pepa: 0,
      peso_muestra: 0,
      basura: 0,
      ciega: 0,
      pelon: 0,
      cascara: 0,
      pepa_huerto: 0
    },
    onSubmit: async (values: IInitialValues) => {
      try {
        const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${id_lote}/registra_muestra_lote/`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            peso_muestra: values.peso_muestra.toFixed(2),
            basura: values.basura.toFixed(2),
            ciega: values.ciega.toFixed(2),
            pelon: values.pelon.toFixed(2),
            cascara: values.cascara.toFixed(2),
            pepa_huerto: values.pepa_huerto.toFixed(2),
            pepa: values.pepa.toFixed(2),
            registrado_por: userID?.user_id
          
          })
        })
        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          refresh(true)
          isOpen(false)

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
          
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const calcularPepaBruta = () => {
    const { peso_muestra, basura, ciega, pelon, cascara, pepa_huerto } = formik.values;
    const sumaOtrosCampos = basura + ciega + pelon + cascara + pepa_huerto;
    const pepa = peso_muestra - sumaOtrosCampos;
    return pepa >= 0 ? pepa : 0; // Asegúrate de que el valor no sea negativo
  };
  
  useEffect(() => {
    const updatedValues = { ...formik.values, pepa: calcularPepaBruta() };
    formik.setValues(updatedValues);
  }, [formik.values.peso_muestra, formik.values.basura, formik.values.ciega, formik.values.pelon, formik.values.cascara, formik.values.pepa_huerto]);

  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
         mt-5 ${ isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center bg-green-700 p-5 rounded-md'>
          <Label htmlFor='peso_muestra'>Peso Muestra: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso_muestra ? true : undefined}
            invalidFeedback={formik.errors.peso_muestra ? String(formik.errors.peso_muestra) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='peso_muestra'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200 z-10'
              value={formik.values.peso_muestra}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2  md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='basura'>Basura: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.basura ? true : undefined}
            invalidFeedback={formik.errors.basura ? String(formik.errors.basura) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='basura'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.basura}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col p-5 flex-col lg:flex-row '>
          <Label htmlFor='pelon'>Pelón: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pelon ? true : undefined}
            invalidFeedback={formik.errors.pelon ? String(formik.errors.pelon) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='pelon'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.pelon}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2  md:col-start-5 p-5 md:flex-col flex-col lg:flex-row '>
          <Label htmlFor='ciega'>Ciega: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.ciega ? true : undefined}
            invalidFeedback={formik.errors.ciega ? String(formik.errors.ciega) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='ciega'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.ciega}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='cascara'>Cascara: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.cascara ? true : undefined}
            invalidFeedback={formik.errors.cascara ? String(formik.errors.cascara) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='cascara'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.cascara}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-5 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='pepa_huerto'>Pepa Huerto: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa_huerto ? true : undefined}
            invalidFeedback={formik.errors.pepa_huerto ? String(formik.errors.pepa_huerto) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='pepa_huerto'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200 focus:bg-zinc-50 '

              value={formik.values.pepa_huerto}
            />
            </FieldWrap>
          </Validation>
        </div>


        <div className='md:row-start-4 md:col-span-2 md:col-start-3 md:flex-col bg-green-700 flex-col lg:flex-row p-5 rounded-md'>
          <Label htmlFor='pepa'>Pepa Bruta: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa ? true : undefined}
            invalidFeedback={formik.errors.pepa ? String(formik.errors.pepa) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='pepa'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200 focus:bg-zinc-50 '
              value={formik.values.pepa}
              disabled
            />
            </FieldWrap>
          </Validation>
        </div>



        <div className='row-start-5 relative w-full h-20 col-span-2 col-start-5'>
         <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar rendimiento de Muestra
          </button>
        </div>
      </form>
      
  )
}

export default FormularioCCRendimiento





