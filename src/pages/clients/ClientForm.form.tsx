import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useSubmitButton } from '../../hooks/useSubmitButton';
import { addProspectSchema } from '../../utils/validationSchemas.util';
import { useAppDispatch } from '../../store/hook';
import { addLeadsToFirestore } from '../../store/slices/prospect/prospectSlice';
import { useNavigate, useNavigation } from 'react-router-dom';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Validation from '../../components/form/Validation';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Button from '../../components/ui/Button';
import { generateUID } from '../../utils/generateUID';

interface ClientFormProps {
  isOpen: Dispatch<SetStateAction<boolean>>;
}

const ClientForm: FC<ClientFormProps> = ({ isOpen }) => {
  const { isSubmitting, handleSubmit } = useSubmitButton()
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      numeroTelefono: '',
    },
    validationSchema: addProspectSchema,
    onSubmit: (values) => {
      const { nombre, email, numeroTelefono } = values;
      if (nombre && email && numeroTelefono) {
        handleSubmit(async () => {
          try {
            await dispatch(addLeadsToFirestore([
              {
                id: generateUID(),
                nombre,
                email,
                numeroTelefono,
                fechaCreacion: new Date().toISOString(),
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
          isTouched={formik.touched.nombre}
          invalidFeedback={formik.errors.nombre}
        >
          <FieldWrap firstSuffix={<Icon icon="HeroUser" className="mx-2" />}>
            <Input
              dimension="lg"
              id="nombre"
              autoComplete="nombre"
              name="nombre"
              placeholder="Nombre"
              value={formik.values.nombre}
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
          isTouched={formik.touched.numeroTelefono}
          invalidFeedback={formik.errors.numeroTelefono}
        >
          <FieldWrap
            firstSuffix={<Icon icon="HeroPhone" className="mx-2" />}
          >
            <Input
              dimension="lg"
              autoComplete="numeroTelefono"
              id="numeroTelefono"
              type='tel'
              name="numeroTelefono"
              placeholder="Número de teléfono"
              value={formik.values.numeroTelefono}
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

export default ClientForm
