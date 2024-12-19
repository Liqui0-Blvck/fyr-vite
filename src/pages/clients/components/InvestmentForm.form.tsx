import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useEffect, useId, useState } from 'react'
import Input from '../../../components/form/Input'
import Label from '../../../components/form/Label'
import Select from '../../../components/form/Select'
import Validation from '../../../components/form/Validation'
import { Investment } from '../../../types/app/Investment.type'
import { investmentStrategies } from '../../../mocks/Data'
import Textarea from '../../../components/form/Textarea'
import Button from '../../../components/ui/Button'
import { useSubmitButton } from '../../../hooks/useSubmitButton'
import priceFormat from '../../../utils/priceFormat.util'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { addNewInvestment, SET_INVESTMENT } from '../../../store/slices/clients/clientSlice'
import toast from 'react-hot-toast'
import { generateUID } from '../../../utils/generateUID'
import { RootState } from '../../../store/rootReducer'
import { useParams } from 'react-router-dom'

const investment_types = [
  { value: 'Stocks', label: 'Acciones' },
  { value: 'Bonds', label: 'Bonos' },
  { value: 'Real Estate', label: 'Bienes Raíces' },
  { value: 'Mutual Funds', label: 'Fondos Mutuos' },
  { value: 'Cryptocurrencies', label: 'Criptomonedas' },
  { value: 'Startups', label: 'Startups' },
  { value: 'Commodities', label: 'Comodities' },
]

const investment_states = [
  { value: 'Active', label: 'Activa' },
  { value: 'Closed', label: 'Vencida' },
  { value: 'In Progress', label: 'En Progreso' },
]


interface InvestmentFormProps {
  isClosed: Dispatch<SetStateAction<boolean>>
}



const InvestmentForm: FC<InvestmentFormProps> = ({ isClosed }) => {
  const investment_date_id = useId()
  const amount_id = useId()
  const type_investment_id = useId()
  const state_investment_id = useId()
  const mature_date_id = useId()
  const expected_return_id = useId()
  const comments_id = useId()
  const strategy_id = useId()

  const { isSubmitting , handleSubmit } = useSubmitButton()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth.user)
  const { id } = useParams<{ id: string }>()





  const formik = useFormik({
    initialValues: {
      investmentType: '',
      investedAmount: 0,
      investmentDate: '',
      maturityDate: '',
      expectedReturn: 0,
      comments: '',
      status: 'Active',
      contract: '',
      strategyID: '',
      notes: '',
    },
    onSubmit: (values) => {
      handleSubmit(async () => {
        dispatch(addNewInvestment({ 
          ...values,
          id: generateUID(),
          userID: user?.uid!,
          leadID: id!,
          investmentType: values.investmentType,
          investmentDate: new Date(values.investmentDate).toISOString(),
          maturityDate: new Date(values.maturityDate).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
  
        })).unwrap()
  
  
  
        toast.success('Inversión agregada correctamente')
        isClosed(false)
      })
    }
  })

  const [formattedAmount, setFormattedAmount] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    const formatted = priceFormat(Number(value), 'CLP');
    setFormattedAmount(formatted);
    formik.setFieldValue('investedAmount', Number(value)); // Mantener el valor sin formato
  };

  useEffect(() => {
    // Al cargar el formulario, formatear el valor de inversión
    setFormattedAmount(priceFormat(formik.values.investedAmount, 'CLP'));
  }, [formik.values.investedAmount]);

  useEffect(() => {
    const strategy_selected = investmentStrategies.find((strategy) => strategy.id === formik.values.strategyID)
    if (strategy_selected) {
      formik.setFieldValue('expectedReturn', strategy_selected.expectedReturn)
    }
  }, [formik.values.strategyID])

  

  return (
    <div className='w-full p-5 flex flex-col gap-6'>
      <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row gap-5 '>
         <div className='w-full'>
           <Label htmlFor='investmentDate'>Fecha de Inversión</Label>
           <Validation
            isTouched={formik.touched.investmentDate}
            isValid={formik.isValid}
            invalidFeedback='La fecha es requerida'
            >
            <Input 
              name='investmentDate'
              id={investment_date_id}
              type='datetime-local'
              value={formik.values.investmentDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Validation>
        </div>

        <div className='w-full'>
          <Label htmlFor='investedAmount'>Monto Invertido</Label>
          <Validation
            isTouched={formik.touched.investedAmount}
            isValid={formik.isValid}
            invalidFeedback='La cantidad invertida es requerida'
            >
              <Input 
                name='investedAmount'
                id={amount_id}
                type='text'
                value={formattedAmount}
                onChange={handleAmountChange}
                onBlur={formik.handleBlur}
              />
          </Validation>
        </div>
      </div>

      <div className='w-full '>
         <Label htmlFor='investmentType'>Tipo de inversión</Label>
         <Select
          name='investmentType'
          id={type_investment_id}
          value={formik.values.investmentType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          >
          <option value=''>Selecciona una opción</option>
          {investment_types.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>

      <div className='w-full'>
         <Label htmlFor='status'>Estado de Inversión</Label>
         <Select
          name='status'
          id={state_investment_id}
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          >
          <option value=''>Selecciona una opción</option>
          {investment_states.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>

      <div className='w-full'>
         <Label htmlFor='strategyID'>Estrategia</Label>
         <Select
          name='strategyID'
          id={strategy_id}
          value={formik.values.strategyID}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          >
          <option value=''>Selecciona una opción</option>
          {investmentStrategies.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </Select>
      </div>



      <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row gap-5 '>
        <div className='w-full'>
           <Label htmlFor='maturityDate'>Fecha de Vencimiento</Label>
           <Validation
            isTouched={formik.touched.maturityDate}
            isValid={formik.isValid}
            invalidFeedback='La fecha es requerida'
            >
            <Input 
              name='maturityDate'
              id={mature_date_id}
              type='date'
              value={formik.values.maturityDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Validation>
        </div>

        <div className='w-full'>
          <Label htmlFor='expectedReturn'>Monto Invertido</Label>
          <Validation
            isTouched={formik.touched.expectedReturn}
            isValid={formik.isValid}
            invalidFeedback='La cantidad invertida es requerida'
            >
              <Input 
                name='expectedReturn'
                id={expected_return_id}
                type='number'
                value={formik.values.expectedReturn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
          </Validation>
        </div>
      </div>

      <div className='w-full'>
        <Label htmlFor='comments'>Comentarios</Label>
        <Textarea 
          name='comments'
          id={comments_id}
          className='h-32'
          value={formik.values.comments}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='Comentarios'
        />
      </div>

      <div className='flex gap-5 mt-5 justify-end'>
        <Button
          variant='outline'
          onClick={() => isClosed(false)}
          >
            Cancelar
        </Button>

        <Button
          variant='solid'
          onClick={() => formik.handleSubmit()}
          isDisable={isSubmitting}
          >
            Agregar Inversión
        </Button>
      </div>
    </div>
  )
}

export default InvestmentForm
