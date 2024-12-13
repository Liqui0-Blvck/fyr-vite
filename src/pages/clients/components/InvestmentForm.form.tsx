import { useFormik } from 'formik'
import React from 'react'

const InvestmentForm = () => {

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

    }

  })
  return (
    <div>
      
    </div>
  )
}

export default InvestmentForm
