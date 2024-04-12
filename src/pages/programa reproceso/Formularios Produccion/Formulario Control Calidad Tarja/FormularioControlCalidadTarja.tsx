import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useLocation } from "react-router-dom"
import { urlNumeros } from "../../../../services/url_number"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TRendimientoMuestra } from "../../../../types/registros types/registros.types"
import { useFormik } from "formik"
import { calibracionSchema } from "../../../../utils/Validator"
import toast from "react-hot-toast"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import SelectReact from "../../../../components/form/SelectReact"
import { optionsVariedad, optionsCalibres, optionsCantidadMuestra } from "../../../../utils/generalUtils"


interface IFormCC {
  id_lote?: number
  refresh: Dispatch<SetStateAction<boolean>>
  isOpen: Dispatch<SetStateAction<boolean>>
  // CCLote?: TPepaMuestra | null
  id_muestra?: number
}

const FormularioControlCalidadTarja : FC<IFormCC> = ({ id_lote, refresh, isOpen, id_muestra }) => {
  const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode ();
  const {pathname} = useLocation()
  const id = urlNumeros(pathname)

  console.log(id_lote)

  const actualizarEstadoTarja = async (id_lote: number) => {
    const res = await fetch(`${base_url}/api/reproceso/${id}/tarjas_resultantes/${id_lote}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        cc_tarja: true,
        produccion: id[0]
      })
    })
  }


  const formik = useFormik({
    initialValues: {
      variedad: "",
      calibre: "",
      cantidad_muestra: 0,
      trozo: 0,
      picada: 0,
      hongo: 0,
      daño_insecto: 0,
      dobles: 0,
      goma: 0,
      basura: 0,
      mezcla_variedad: 0,
      pepa_sana: 0,
      fuera_color: 0,
      punto_goma: 0,
      vana_deshidratada: 0

    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/reproceso/cdc-tarjaresultante/${id_lote}/`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
            estado_cc: '3'
          })
        })
        if (res.ok) {
          const data = await res.json()
          toast.success("El control de calidad de la tarja fue registrado exitosamente!!")
          refresh(true)
          isOpen(false)
          actualizarEstadoTarja(id_lote!)

        } else {
          toast.error("No se pudo registrar el control de calidad de la tarja, volver a intentar")
           
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
        className={`w-full md:w-full lg:w-full flex-col md:grid lg:grid lg:grid-cols-12 gap-x-3
        gap-y-5 ${ isDarkTheme ? 'bg-zinc-950' : 'bg-white'} p-2 
        rounded-md`}
      >
        <div className='md:col-span-4 md:flex-col w-full items-centerp-5 rounded-md mb-10'>
          <Label className='dark:text-white text-zinc-900' htmlFor='variedad'>Variedad: </Label>
          <Validation

            isValid={formik.isValid}
            isTouched={formik.touched.variedad ? true : undefined}
            invalidFeedback={formik.errors.variedad ? String(formik.errors.variedad) : undefined}
            validFeedback='Bien'
            >
            <FieldWrap>
              <SelectReact
                options={optionsVariedad}
                id='variedad'
                name='variedad'
                placeholder='Selecciona una variedad'
                className='h-14'
                onChange={(value: any) => {
                  formik.setFieldValue('variedad', value.value)
                }}
              />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:col-start-5 md:col-span-4 rounded-md w-full'>
          <Label className='dark:text-white text-zinc-900'  htmlFor='calibre'>Calibre: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calibre ? true : undefined}
            invalidFeedback={formik.errors.calibre ? String(formik.errors.calibre) : undefined}>
            <FieldWrap>
              <SelectReact
                  options={optionsCalibres}
                  id='calibre'
                  name='calibre'
                  placeholder='Selecciona una calibre'
                  className='h-14'
                  onChange={(value: any) => {
                    formik.setFieldValue('calibre', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:col-start-9 md:col-span-4 rounded-md w-full'>
          <Label className='dark:text-white text-zinc-900'  htmlFor='cantidad_muestra'>Cantidad Muestra: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.cantidad_muestra ? true : undefined}
            invalidFeedback={formik.errors.cantidad_muestra ? String(formik.errors.cantidad_muestra) : undefined}>
            <FieldWrap>
              <SelectReact
                  options={optionsCantidadMuestra}
                  id='cantidad_muestra'
                  name='cantidad_muestra'
                  placeholder='Selecciona una cantidad muestra'
                  className='h-14'
                  onChange={(value: any) => {
                    formik.setFieldValue('cantidad_muestra', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:row-start-2  md:col-span-4'>
          <Label htmlFor='trozo'>Trozo: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.trozo ? true : undefined}
            invalidFeedback={formik.errors.trozo ? String(formik.errors.trozo) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='trozo'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.trozo}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-5 md:col-span-4'>
          <Label htmlFor='picada'>Picada: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.picada ? true : undefined}
            invalidFeedback={formik.errors.picada ? String(formik.errors.picada) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='picada'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.picada}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-9 md:col-span-4'>
          <Label htmlFor='hongo'>Hongo: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.hongo ? true : undefined}
            invalidFeedback={formik.errors.hongo ? String(formik.errors.hongo) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='hongo'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.hongo}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-4'>
          <Label htmlFor='daño_insecto'>Daño por Insecto: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.daño_insecto ? true : undefined}
            invalidFeedback={formik.errors.daño_insecto ? String(formik.errors.daño_insecto) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='daño_insecto'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.daño_insecto}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-5 md:col-span-4'>
          <Label htmlFor='dobles'>Dobles: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.dobles ? true : undefined}
            invalidFeedback={formik.errors.dobles ? String(formik.errors.dobles) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='dobles'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.dobles}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-9 md:col-span-4'>
          <Label htmlFor='goma'>Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.goma ? true : undefined}
            invalidFeedback={formik.errors.goma ? String(formik.errors.goma) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='goma'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.goma}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-span-4'>
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
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.basura}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-start-5 md:col-span-4'>
          <Label htmlFor='mezcla_variedad'>Mezcla de Variedad: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.mezcla_variedad ? true : undefined}
            invalidFeedback={formik.errors.mezcla_variedad ? String(formik.errors.mezcla_variedad) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='mezcla_variedad'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.mezcla_variedad}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-start-9 md:col-span-4'>
          <Label htmlFor='pepa_sana'>Pepa Sana: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa_sana ? true : undefined}
            invalidFeedback={formik.errors.pepa_sana ? String(formik.errors.pepa_sana) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='pepa_sana'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.pepa_sana}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-5 md:col-span-4'>
          <Label htmlFor='fuera_color'>Fuera de Color: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.fuera_color ? true : undefined}
            invalidFeedback={formik.errors.fuera_color ? String(formik.errors.fuera_color) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='fuera_color'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.fuera_color}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-5 md:col-start-5 md:col-span-4'>
          <Label htmlFor='punto_goma'>Punto de Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.punto_goma ? true : undefined}
            invalidFeedback={formik.errors.punto_goma ? String(formik.errors.punto_goma) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='punto_goma'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.punto_goma}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-5 md:col-start-9 md:col-span-4'>
          <Label htmlFor='vana_deshidratada'>Vana Deshidratada: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.vana_deshidratada ? true : undefined}
            invalidFeedback={formik.errors.vana_deshidratada ? String(formik.errors.vana_deshidratada) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='vana_deshidratada'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.vana_deshidratada}
              />
            </FieldWrap>
          </Validation>
        </div>



        <div className='row-start-8 col-start-9 relative w-full h-20 col-span-4'>
         <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar
          </button>
        </div>
      </form>
      
  )
}

export default FormularioControlCalidadTarja





