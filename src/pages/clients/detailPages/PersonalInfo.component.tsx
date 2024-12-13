import React, { useEffect, useState } from 'react'
import Button from '../../../components/ui/Button'
import Label from '../../../components/form/Label'
import Icon from '../../../components/icon/Icon'
import Input from '../../../components/form/Input'
import { useFormik } from 'formik'
import Select from '../../../components/form/Select'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { RootState } from '../../../store/rootReducer'
import { useParams } from 'react-router-dom'
import { format } from '@formkit/tempo'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import { useSubmitButton } from '../../../hooks/useSubmitButton'
import { getClient, updateClient } from '../../../store/slices/clients/clientSlice'

const PersonalInfo = () => {
  const { id } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const { client } = useAppSelector((state: RootState) => state.client)
  const dispatch = useAppDispatch()
  const { isSubmitting, handleSubmit } = useSubmitButton()

  useEffect(() => {
    dispatch(getClient(id!))
  }, [])



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: client?.name || '',
      phoneNumber: client?.phoneNumber || '',
      email: client?.email || '',
      status: client?.status || '',
      createdAt: client?.createdAt || '',
      updatedAt: client?.updatedAt || '',
      source: client?.source || '',
    },
    onSubmit: (values) => {
      try {
        handleSubmit(async () => {
          await dispatch(updateClient({
            clientID: id!,
            updatedData: values
          }))
        })
      } catch (error) {
        
      }
    }
  })
  console.log(formik.values.email)

  const handleSave = () => {
    console.log('Save')
  }

  return (
    <PageWrapper title='Información Personal' className='p-5'>
      <section className='flex justify-between mb-5'>
        <div className='flex flex-col'>
          <h2>Información Personal</h2>
          <span className='lg:text-lg md:text-md text-zinc-500'>Detalles del client</span>
        </div>

        {
          isEditing ? (
            <div className='flex'>
              <Button
                variant='outline' 
                onClick={() => setIsEditing(false)} 
                className='mr-2 h-10'>
                Cancelar
              </Button>
              <Button
                variant='solid' 
                onClick={handleSave}
                className='h-10'
                >
                Guardar Cambios
              </Button>
            </div>
          ) : (
            <Button
              variant='outline'
              className='h-10'
              onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )
        }
      </section>

      <section className='grid gap-4'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroUser' className='h-6 w-6 mr-2' />
              Nombre
            </Label>
            {isEditing ? (
              <Input id="name" name="name" value={formik.values.name} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.name}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroPhone' className='h-6 w-6 mr-2' />
              Número de Teléfono
            </Label>
            {isEditing ? (
              <Input id="phone" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.phoneNumber}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroEnvelope' className='h-6 w-6 mr-2' />
              Correo Electrónico
            </Label>
            {isEditing ? (
              <Input id="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.email}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroShieldCheck' className='h-6 w-6 mr-2' />
              Estado
            </Label>
            {isEditing ? (
              <Select
                id='status'
                name='status'
                value={formik.values.status}
                onChange={formik.handleChange}
                >
                <option value='Interesado'>Interesado</option>
                <option value='Desinteresado'>Desinteresado</option>
                <option value='Frío'>Frío</option>
                <option value='Caliente'>Caliente</option>
              </Select>
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.status}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="source" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroClipboardDocumentList' className='h-6 w-6 mr-2' />
              Fuente
            </Label>
            {isEditing ? (
              <Select
                id='source'
                name='source'
                value={formik.values.source}
                onChange={formik.handleChange}
                >
                <option value='Publicidad'>Publicidad</option>
                <option value='Referencia'>Referencia</option>
                <option value='Otro'>Otro</option>
              </Select>
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.source ? formik.values.source : 'Indefinido'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="createdAt" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroCalendar' className='h-6 w-6 mr-2' />
              Fecha de Creación
            </Label>
            <div className="lg:text-lg md:text-md font-medium">{format(formik.values.createdAt, { date: 'full' }, 'es' )}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="updatedAt" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroClock' className='h-6 w-6 mr-2' />
              Fecha de Última Interacción
            </Label>
            <div className="lg:text-lg md:text-md font-medium">{format(formik.values.updatedAt, { date: 'full' }, 'es' )}</div>
          </div>
        </div>
        {/* {isEditing && (
          <Button
            variant='solid' 
            onClick={handleSave} className="w-full">
            Guardar Cambios
          </Button>
        )} */}
      </section>
    </PageWrapper>
  )
}

export default PersonalInfo
