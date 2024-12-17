import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import Input from '../../../components/form/Input'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import { useSubmitButton } from '../../../hooks/useSubmitButton'
import Textarea from '../../../components/form/Textarea'
import Select from '../../../components/form/Select'
import Button from '../../../components/ui/Button'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { addNewStrategies } from '../../../store/slices/clients/clientSlice'
import toast from 'react-hot-toast'
import { generateUID } from '../../../utils/generateUID'
import { RootState } from '../../../store/rootReducer'

const strategiesTypes = [
  { value: 'Conservador', label: 'Conservador' },
  { value: 'Moderado', label: 'Moderado' },
  { value: 'Agresivo', label: 'Agresivo' },
]

const riskTypes = [
  { value: 'Bajo', label: 'Bajo' },
  { value: 'Medio', label: 'Medio' },
  { value: 'Alto', label: 'Alto' },
]

const statusTypes = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Pausado', label: 'Pausado' },
  { value: 'Inactivo', label: 'Inactivo' },
]

interface StrategiesFormProps {
  isClosed: Dispatch<SetStateAction<boolean>>
}


const StrategiesForm: FC<StrategiesFormProps> = ({ isClosed }) => {
  const { isSubmitting, handleSubmit } = useSubmitButton()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth.user)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: 'Conservador',
      expectedReturn: 0,
      risk: 'Bajo',
      status: 'Inactivo',
    },
    onSubmit: (values) => {
      handleSubmit(async () => {
        await dispatch(addNewStrategies({
          id: generateUID(),
          userID: user?.uid!,
          name: values.name,
          description: values.description,
          type: values.type,
          expectedReturn: values.expectedReturn,
          risk: values.risk,
          status: values.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
         })).unwrap()
        toast.success('Estrategia creada con éxito')
        isClosed(false)
      })
    }
  })

  console.log(formik.values)

  return (
    <div className='w-full p-5 flex flex-col gap-6'>
      <div>
        <Label htmlFor='name'>Nombre</Label>
        <Validation
          isTouched={formik.touched.name}
          isValid={formik.isValid}
          invalidFeedback='El nombre es requerido'
          >
          <Input
            name='name'
            id='name'
            placeholder='Nombre de la estrategia'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Validation>
      </div>

      <div>
        <Label htmlFor='description'>Descripción</Label>
        <Textarea
          name='description'
          id='description'
          placeholder='Descripción de la estrategia'
          className='h-20'
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <div>
        <Label htmlFor='type'>Tipo</Label>
        <Select
          name='type'
          id='type'
          value={formik.values.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {strategiesTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor='expectedReturn'>Rendimiento Esperado</Label>
        <Validation
          isTouched={formik.touched.expectedReturn}
          isValid={formik.isValid}
          invalidFeedback='El rendimiento esperado es requerido'
          >
          <Input
            name='expectedReturn'
            id='expectedReturn'
            value={formik.values.expectedReturn}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Validation>
      </div>

      <div>
        <Label htmlFor='risk'>Riesgo</Label>
        <Select
          name='risk'
          id='risk'
          value={formik.values.risk}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {riskTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor='status'>Estado</Label>
        <Select
          name='status'
          id='status'
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {statusTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>

      <div className='mt-10 flex gap-5 justify-end'>
        <Button
          variant='outline'
          onClick={() => isClosed(false)}
        >
          Cancelar
        </Button>

        <Button
          variant='solid'
          isDisable={isSubmitting}
          onClick={() => formik.handleSubmit()}
          >
            Crear Estrategia
        </Button>
      </div>
    </div>
  )
}

export default StrategiesForm
