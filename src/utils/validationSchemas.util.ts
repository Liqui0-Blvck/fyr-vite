import * as Yup from 'yup';


export const validationEditProfileSchema =  Yup.object({
  first_name: Yup.string().required('El nombre es requerido'),
  second_name: Yup.string().optional(),
  last_name: Yup.string().required('El apellido paterno es requerido'),
  second_last_name: Yup.string().optional(),
  email: Yup.string()
    .email('Correo electrónico no válido')
    .required('El correo electrónico es requerido'),
  phone_number: Yup.string()
    .matches(/^\+569\d{8}$/, 'El número de teléfono debe ser chileno (+569 seguido de 8 dígitos)')
    .required('El número de teléfono es requerido'),
  birth: Yup.date().required('La fecha de nacimiento es requerida'),
  gender: Yup.string().oneOf(['Masculino', 'Femenino'], 'Género inválido').required('El género es requerido'),
  role: Yup.string().required('El rol es requerido'),
  photoURL: Yup.string().url('La URL de la foto no es válida').optional(), // Esto asume que si es proporcionada, debe ser una URL válida.
})


const passwordValidation = Yup.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.')
  .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula.')
  .matches(/[0-9]/, 'La contraseña debe contener al menos un número.')
  .matches(/[\W_]/, 'La contraseña debe contener al menos un carácter especial.')
  .required('La contraseña es requerida.');

export const passwordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .required('La contraseña antigua es requerida.')
    .min(8, 'La contraseña antigua debe tener al menos 8 caracteres.'),  // Opcional: Validar longitud mínima

  newPassword: passwordValidation,

  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Las contraseñas no coinciden.')
    .required('La confirmación de la nueva contraseña es requerida.')
});



export const addProspectSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  email: Yup.string().email('Correo inválido').required('El correo es requerido'),
  numeroTelefono: Yup.string()
  .matches(/^\+569\d{8}$/, 'El número de teléfono debe ser chileno (+569 seguido de 8 dígitos)')
  .required('El número de teléfono es requerido'),
});