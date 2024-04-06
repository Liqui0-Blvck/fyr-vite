import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { TIPO_ACOPLADO } from '../../../utils/select.constanst'
import Textarea from '../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import Radio, { RadioGroup } from '../../../components/form/Radio'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TControlCalidad, TLoteGuia, TPepaMuestra, TRendimientoMuestra } from '../../../types/registros types/registros.types'
import { optionsRadio } from '../../../constants/options.constants'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { calibracionSchema } from '../../../utils/Validator'

interface IFormCC {
  id_lote?: number
  refresh?: Dispatch<SetStateAction<boolean>>
  isOpen?: Dispatch<SetStateAction<boolean>>
  CCLote?: TPepaMuestra | null
  id_muestra?: number
}

const FormularioCCPepaCalibre : FC<IFormCC> = ({ id_lote, refresh, isOpen, id_muestra, CCLote }) => {
  const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode ();
  const {pathname} = useLocation()
  const id = urlNumeros(pathname)
  const { data: ccPepa } = useAuthenticatedFetch<TRendimientoMuestra[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id[0]}/muestras/${id_muestra}/cdcpepa/`
  )

  console.log(id)
  console.log(id_muestra)

  console.log(CCLote)

  const pepaCCID = [...(ccPepa || [])].shift()?.id


  const formik = useFormik({
    initialValues: {
      peso_muestra_calibre: 0,
      gramos_x_asignar: 0,
      pre_calibre: 0,
      calibre_18_20: 0,
      calibre_20_22: 0,
      calibre_23_25: 0,
      calibre_25_27: 0,
      calibre_27_30: 0,
      calibre_30_32: 0,
      calibre_32_34: 0,
      calibre_34_36: 0,
      calibre_36_40: 0,
      calibre_40_mas: 0,

    },
    validationSchema: calibracionSchema,
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${id[0]}/muestras/${id_muestra}/cdcpepa/${pepaCCID }/`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            pre_calibre: values.pre_calibre,
            calibre_18_20: values.calibre_18_20,
            calibre_20_22: values.calibre_20_22,
            calibre_23_25: values.calibre_23_25,
            calibre_25_27: values.calibre_25_27,
            calibre_27_30: values.calibre_27_30,
            calibre_30_32: values.calibre_30_32,
            calibre_32_34: values.calibre_32_34,
            calibre_34_36: values.calibre_34_36,
            calibre_36_40: values.calibre_36_40,
            calibre_40_mas: values.calibre_40_mas,
            peso_muestra_calibre: values.peso_muestra_calibre,
            cc_rendimiento: id_muestra,
            cc_calibrespepaok: true
          })
        })
        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          refresh!(true)
          isOpen!(false)

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
          
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  console.log(formik.values)

  const calcularPepaSana = () => {
    const { pre_calibre,
           calibre_18_20,
           calibre_20_22,
           calibre_22_24,
           calibre_23_25,
           calibre_26_28,
           calibre_27_30,
           calibre_30_32,
           calibre_32_34,
           calibre_34_36,
           calibre_36_40,
           calibre_40_mas,
           peso_muestra_calibre,
           gramos_x_asignar } = formik.values;
    
    // Utiliza el operador de coalescencia nula para proporcionar un valor predeterminado de 0 si el valor es null o undefined
    const sumaOtrosCampos =
        parseFloat(pre_calibre ?? 0)
      + parseFloat(calibre_18_20 ?? 0)
      + parseFloat(calibre_20_22 ?? 0) 
      + parseFloat(calibre_22_24 ?? 0) 
      + parseFloat(calibre_23_25 ?? 0) 
      + parseFloat(calibre_26_28 ?? 0) 
      + parseFloat(calibre_27_30 ?? 0) 
      + parseFloat(calibre_30_32 ?? 0)
      + parseFloat(calibre_32_34 ?? 0)
      + parseFloat(calibre_34_36 ?? 0)
      + parseFloat(calibre_36_40 ?? 0)
      + parseFloat(calibre_40_mas ?? 0)

    
    
    const gramos_x_asignar_final = (peso_muestra_calibre ?? 0) - sumaOtrosCampos;
    
    return gramos_x_asignar_final >= 0 ? gramos_x_asignar_final : 0; // Asegúrate de que el valor no sea negativo
  };

  useEffect(() => {
    const updatedValues = { ...formik.values, gramos_x_asignar: calcularPepaSana() };
    formik.setValues(updatedValues);
  }, [
    formik.values.peso_muestra_calibre,
    formik.values.pre_calibre,
    formik.values.calibre_18_20,
    formik.values.calibre_20_22,
    formik.values.calibre_23_25,
    formik.values.calibre_26_28,
    formik.values.calibre_27_30,
    formik.values.calibre_30_32,
    formik.values.calibre_32_34,
    formik.values.calibre_34_36,
    formik.values.calibre_36_40,
    formik.values.calibre_40_mas
    ]);

    // const pepa_sana = 

  
  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`w-[300px] md:w-full lg:w-full flex-col md:grid lg:grid lg:grid-cols-8 gap-x-3
        gap-y-10  mt-10 ${ isDarkTheme ? 'bg-zinc-950' : 'bg-white'} p-2 
        rounded-md`}
      >
        <div className='md:col-start-2 md:col-span-3 md:flex-col w-full items-center bg-green-600 p-5 rounded-md mb-10 md:mb-0 lg:mb-0'>
          
          <Label className='text-white' htmlFor='peso_muestra_calibre'>Peso Promediado Pepa Sana: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso_muestra_calibre ? true : undefined}
            invalidFeedback={formik.errors.peso_muestra_calibre ? String(formik.errors.peso_muestra_calibre) : undefined}
            validFeedback='Bien'
            >
            <FieldWrap>
              <Input
              type='number'
              name='peso_muestra_calibre'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-100 focus:bg-zinc-200 '
              value={formik.values.peso_muestra_calibre}
            />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:col-start-5 md:col-span-3 bg-orange-500 p-5 rounded-md w-full'>
          <Label className='text-white'  htmlFor='gramos_x_asignar'>Pepa Sana Restante Calibración: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.gramos_x_asignar ? true : undefined}
            invalidFeedback={formik.errors.gramos_x_asignar ? String(formik.errors.gramos_x_asignar) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='gramos_x_asignar'
              onChange={formik.handleChange}
              className='py-2 w-[100%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.gramos_x_asignar}
            />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col flex-col lg:flex-row p-5 w-full'>
          <Label htmlFor='pre_calibre'>Pre Calibre: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pre_calibre ? true : undefined}
            invalidFeedback={formik.errors.pre_calibre ? String(formik.errors.pre_calibre) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='pre_calibre'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200 mb-10'
              value={formik.values.pre_calibre}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 p-5 md:flex-col flex-col lg:flex-row w-full '>
          <Label htmlFor='calibre_18_20'>Calibre  18/20: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_18_20 ? true : undefined}
            invalidFeedback={formik.errors.calibre_18_20 ? String(formik.errors.calibre_18_20) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_18_20'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_18_20}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_20_22'>Calibre 20/22: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_20_22 ? true : undefined}
            invalidFeedback={formik.errors.calibre_20_22 ? String(formik.errors.calibre_20_22) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_20_22'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_20_22}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-7 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_23_25'>Calibre 23/25: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_23_25 ? true : undefined}
            invalidFeedback={formik.errors.calibre_23_25 ? String(formik.errors.calibre_23_25) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_23_25'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_23_25}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_25_27'>Calibre 25/27: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_25_27 ? true : undefined}
            invalidFeedback={formik.errors.calibre_25_27 ? String(formik.errors.calibre_25_27) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_25_27'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_25_27}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-3 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_27_30'>Calibre 27/29: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_27_30 ? true : undefined}
            invalidFeedback={formik.errors.calibre_27_30 ? String(formik.errors.calibre_27_30) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_27_30'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_27_30}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-5 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_30_32'>Calibre 30/32: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_30_32 ? true : undefined}
            invalidFeedback={formik.errors.calibre_30_32 ? String(formik.errors.calibre_30_32) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_30_32'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_30_32}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-7 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_32_34'>Calibre 32/34: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_32_34 ? true : undefined}
            invalidFeedback={formik.errors.calibre_32_34 ? String(formik.errors.calibre_32_34) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_32_34'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_32_34}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_36_40'>Calibre 36/40: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_36_40 ? true : undefined}
            invalidFeedback={formik.errors.calibre_36_40 ? String(formik.errors.calibre_36_40) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_36_40'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_36_40}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-start-3 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='calibre_40_mas'>Calibre 40/mas: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre_40_mas ? true : undefined}
            invalidFeedback={formik.errors.calibre_40_mas ? String(formik.errors.calibre_40_mas) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='calibre_40_mas'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.calibre_40_mas}
            />
            </FieldWrap>
          </Validation>
        </div>



        <div className='row-start-5 col-start-7 relative w-full h-20 col-span-2 '>
         <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar CC Pepa Bruta
          </button>
        </div>
      </form>
      
  )
}

export default FormularioCCPepaCalibre





