import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useSubmitButton } from '../../hooks/useSubmitButton';
import { addProspectSchema } from '../../utils/validationSchemas.util';
import { useAppDispatch } from '../../store/hook';
import { addProspectsToFirestore } from '../../store/slices/prospect/prospectSlice';
import { useNavigate, useNavigation } from 'react-router-dom';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Validation from '../../components/form/Validation';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Button from '../../components/ui/Button';
import { generateUID } from '../../utils/generateUID';

interface ProspectFormProps {
  isOpen: Dispatch<SetStateAction<boolean>>;
}

const ProspectForm: FC<ProspectFormProps> = ({ isOpen }) => {
  const { isSubmitting, handleSubmit } = useSubmitButton()
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: addProspectSchema,
    onSubmit: (values) => {
      const { name, email, phoneNumber } = values;
      if (name && email && phoneNumber) {
        handleSubmit(async () => {
          try {
            await dispatch(addProspectsToFirestore([
              {
                id: generateUID(),
                name,
                email,
                phoneNumber,
                createdAt: new Date().toISOString(),
              },
            ])).unwrap();
            formik.resetForm();
            isOpen(false);
            toast.success('Prospecto agregado correctamente.');
          } catch (error) {
            toast.error(`${'Error: Hubo un error al agregar el lead. Por favor, intenta de nuevo.'}`);
          }
        });
      }
    },
  });


  return (
    <div className='flex flex-col gap-5'>
      <div className={classNames({ 'mb-2': !formik.isValid })}>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.name}
          invalidFeedback={formik.errors.name}
        >
          <FieldWrap firstSuffix={<Icon icon="HeroUser" className="mx-2" />}>
            <Input
              dimension="lg"
              id="name"
              autoComplete="name"
              name="name"
              placeholder="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FieldWrap>
        </Validation>
      </div>

      <div className={classNames({ 'mb-2': !formik.isValid })}>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.email}
          invalidFeedback={formik.errors.email}
        >
          <FieldWrap
            firstSuffix={<Icon icon="HeroEnvelope" className="mx-2" />}
          >
            <Input
              dimension="lg"
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FieldWrap>
        </Validation>
      </div>

      <div className={classNames({ 'mb-2': !formik.isValid })}>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.phoneNumber}
          invalidFeedback={formik.errors.phoneNumber}
        >
          <FieldWrap
            firstSuffix={<Icon icon="HeroPhone" className="mx-2" />}
          >
            <Input
              dimension="lg"
              autoComplete="phoneNumber"
              id="phoneNumber"
              type='tel'
              name="phoneNumber"
              placeholder="Número de teléfono"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FieldWrap>
        </Validation>
      </div>

      <div>
        <Button
          size="lg"
          isDisable={isSubmitting}
          variant="solid"
          className="w-full font-semibold"
          onClick={() => formik.handleSubmit()}
        >
          {isSubmitting ? 'Cargando...' : 'Guardar Prospecto'}
        </Button>
      </div>

    </div>
  )
}

export default ProspectForm
