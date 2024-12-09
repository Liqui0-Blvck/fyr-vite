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
import { getLead } from '../../../store/slices/prospect/prospectSlice'
import { format } from '@formkit/tempo'

const PersonalInfo = () => {
  const { id } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const { lead: prospecto } = useAppSelector((state: RootState) => state.prospect)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getLead(id!))
  }, [])



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: prospecto?.nombre || '',
      numeroTelefono: prospecto?.numeroTelefono || '',
      email: prospecto?.email || '',
      estado: prospecto?.estado || '',
      fechaCreacion: prospecto?.fechaCreacion || '',
      fechaUltimaInteraccion: prospecto?.fechaUltimaInteraccion || '',
      fuente: prospecto?.fuente || '',
    },
    onSubmit: () => {

    }
  })

  console.log(formik.values.email)

  const handleSave = () => {
    console.log('Save')
  }

  return (
    <div className='p-5'>
      <section className='flex justify-between mb-5'>
        <div className='flex flex-col'>
          <h2>Información Personal</h2>
          <span className='lg:text-lg md:text-md text-zinc-500'>Detalles del prospecto</span>
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
              <Input id="name" name="name" value={formik.values.nombre} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.nombre}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroPhone' className='h-6 w-6 mr-2' />
              Número de Teléfono
            </Label>
            {isEditing ? (
              <Input id="phone" name="phone" value={formik.values.numeroTelefono} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.numeroTelefono}</div>
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
                value={formik.values.estado}
                onChange={formik.handleChange}
                >
                <option value='Interesado'>Interesado</option>
                <option value='Desinteresado'>Desinteresado</option>
                <option value='Frío'>Frío</option>
                <option value='Caliente'>Caliente</option>
              </Select>
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.estado}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="source" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroClipboardDocumentList' className='h-6 w-6 mr-2' />
              Fuente
            </Label>
            {isEditing ? (
              <Select
                id='status'
                name='status'
                value={formik.values.fuente}
                onChange={formik.handleChange}
                >
                <option value='Publicidad'>Publicidad</option>
                <option value='Referencia'>Referencia</option>
                <option value='Otro'>Otro</option>
              </Select>
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{formik.values.fuente ? formik.values.fuente : 'Indefinido'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="creationDate" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroCalendar' className='h-6 w-6 mr-2' />
              Fecha de Creación
            </Label>
            {isEditing ? (
              <Input id="creationDate" name="creationDate" type="date" value={formik.values.fechaCreacion} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{format(formik.values.fechaCreacion, { date: 'full' }, 'es' )}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastInteractionDate" className="flex items-center dark:text-zinc-400 text-zinc-500 lg:text-lg md:text-md font-medium text-muted-foreground">
              <Icon icon='HeroClock' className='h-6 w-6 mr-2' />
              Fecha de Última Interacción
            </Label>
            {isEditing ? (
              <Input id="lastInteractionDate" name="lastInteractionDate" type="date" value={formik.values.fechaUltimaInteraccion} onChange={formik.handleChange} />
            ) : (
              <div className="lg:text-lg md:text-md font-medium">{format(formik.values.fechaUltimaInteraccion, { date: 'full' }, 'es' )}</div>
            )}
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
    </div>
  )
}

export default PersonalInfo
