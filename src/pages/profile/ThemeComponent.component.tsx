import { FormikFormProps, FormikState, useFormik } from 'formik'
import React, { FC, useEffect } from 'react'
import Label from '../../components/form/Label'
import Radio, { RadioGroup } from '../../components/form/Radio'
import { TDarkMode } from '../../types/darkMode.type'
import useDarkMode from '../../hooks/useDarkMode'


const ThemeComponent = () => {
	const { setDarkModeStatus } = useDarkMode();

  const formik = useFormik({
    initialValues:{
      theme: 'dark'
    },
    onSubmit: (values) => {
      console.log(values)
    }
  })

  useEffect(() => {
  setDarkModeStatus(formik.values.theme as TDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.theme]);


  return (
  <>
    <div className='text-4xl font-semibold'>Temas</div>
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12'>
        <Label htmlFor='theme'>Theme</Label>
        <RadioGroup isInline>
          <Radio
            name='theme'
            value='dark'
            selectedValue={formik.values.theme}
            onChange={formik.handleChange}>
            <div className='relative'>
              <div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
                <div className='h-1 w-1 rounded-full bg-red-500' />
                <div className='h-1 w-1 rounded-full bg-amber-500' />
                <div className='h-1 w-1 rounded-full bg-emerald-500' />
              </div>
              <div className='flex aspect-video w-56 bg-zinc-950'>
                <div className='h-full w-1/4 border-e border-zinc-800/50 bg-zinc-900/75' />
                <div className='h-full w-3/4'>
                  <div className='h-4 w-full border-b border-zinc-800/50 bg-zinc-900/75' />
                  <div />
                </div>
              </div>
            </div>
          </Radio>
          <Radio
            name='theme'
            value='light'
            selectedValue={formik.values.theme}
            onChange={formik.handleChange}>
            <div className='relative'>
              <div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
                <div className='h-1 w-1 rounded-full bg-red-500' />
                <div className='h-1 w-1 rounded-full bg-amber-500' />
                <div className='h-1 w-1 rounded-full bg-emerald-500' />
              </div>
              <div className='flex aspect-video w-56 bg-zinc-100'>
                <div className='h-full w-1/4 border-e border-zinc-300/25 bg-white' />
                <div className='h-full w-3/4'>
                  <div className='h-4 w-full border-b border-zinc-300/25 bg-white' />
                  <div />
                </div>
              </div>
            </div>
          </Radio>
        </RadioGroup>
      </div>
    </div>
  </>
  )
}

export default ThemeComponent
