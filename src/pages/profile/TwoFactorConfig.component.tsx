import { FormikProps } from 'formik'
import React, { FC } from 'react'
import Button from '../../components/ui/Button'
import { useAppSelector } from '../../store/hook'


const TwoFactorConfig = () => {
  const { user } = useAppSelector((state) => state.auth.user)
  return (
  <>
    <div className='text-4xl font-semibold'>2FA</div>
    <div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div className='w-full text-xl font-semibold'>
            Authenticator App
          </div>
        </div>
        <div className='flex-shrink-0'>
          <Button
            variant='outline'
            isDisable={true}>
            Set up
          </Button>
        </div>
      </div>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div className='w-full text-xl font-semibold'>
            Security Keys
          </div>
        </div>
        <div className='flex-shrink-0'>
          <Button
            color='red'
            className='!px-0'
            isDisable={true}>
            Deactivate
          </Button>
        </div>
      </div>
      <div className='flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div className='w-full text-xl font-semibold'>
            Telephone Number
          </div>
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <span className='text-zinc-500'>
            {user?.phoneNumber}
          </span>
          <Button
            variant='outline'
            color='zinc'
            isDisable={true}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  </>
  )
}

export default TwoFactorConfig
