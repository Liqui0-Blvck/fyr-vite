import { FormikProps, useFormik } from 'formik'
import React, { FC } from 'react'
import Checkbox from '../../components/form/Checkbox'
import Label from '../../components/form/Label'


const NewlettersComponent = () => {
  const formik = useFormik({
    initialValues: {
      weeklyNewsletter: true,
      lifecycleEmails: true,
      promotionalEmails: true,
      productUpdates: true
    },
    onSubmit: (_values) => {

    }
  })
  return (
  <>
    <div className='text-4xl font-semibold'>Newsletter</div>
    <div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <Label
            htmlFor='weeklyNewsletter'
            className='!mb-0'>
            <div className='text-xl font-semibold'>
              Weekly newsletter
            </div>
            <div className='text-zinc-500'>
              Get notified about articles, discounts
              and new products.
            </div>
          </Label>
        </div>
        <div className='flex flex-shrink-0 items-center'>
          <Checkbox
            variant='switch'
            id='weeklyNewsletter'
            name='weeklyNewsletter'
            onChange={formik.handleChange}
            checked={true}
          />
        </div>
      </div>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <Label
            htmlFor='lifecycleEmails'
            className='!mb-0'>
            <div className='text-xl font-semibold'>
              Lifecycle emails
            </div>
            <div className='text-zinc-500'>
              Get personalized offers and emails based
              on your activity.
            </div>
          </Label>
        </div>
        <div className='flex flex-shrink-0 items-center'>
          <Checkbox
            variant='switch'
            id='lifecycleEmails'
            name='lifecycleEmails'
            onChange={formik.handleChange}
            checked={true}
          />
        </div>
      </div>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <Label
            htmlFor='promotionalEmails'
            className='!mb-0'>
            <div className='text-xl font-semibold'>
              Promotional emails
            </div>
            <div className='text-zinc-500'>
              Get personalized offers and emails based
              on your orders & preferences.
            </div>
          </Label>
        </div>
        <div className='flex flex-shrink-0 items-center'>
          <Checkbox
            variant='switch'
            id='promotionalEmails'
            name='promotionalEmails'
            onChange={formik.handleChange}
            checked={true}
          />
        </div>
      </div>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <Label
            htmlFor='productUpdates'
            className='!mb-0'>
            <div className='text-xl font-semibold'>
              Product updates
            </div>
            <div className='text-zinc-500'>
              Checking this will allow us to notify
              you when we make updates to products you
              have downloaded/purchased.
            </div>
          </Label>
        </div>
        <div className='flex flex-shrink-0 items-center'>
          <Checkbox
            variant='switch'
            id='productUpdates'
            name='productUpdates'
            onChange={formik.handleChange}
            checked={true}
          />
        </div>
      </div>
    </div>
  </>
  )
}

export default NewlettersComponent
