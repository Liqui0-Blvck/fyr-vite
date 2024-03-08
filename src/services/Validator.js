import * as Yup from 'yup'

export const CategoriaSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(5, 'Muy corto el texto!')
    .max(20, 'Muy largo el texto!')
    .required('Required'),
  descripcion: Yup.string()
    .max(60, 'Muy largo')
});


export const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(8, 'Muy corto el texto')
    .max(15, 'Muy largo el texto')
    .required('Required'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial')
})


export const ComponenteSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  descripcion: Yup.string()
    .min(8, 'Muy corta descripción!')
    .max(200, 'Descripción muy larga!'),
  categoria: Yup.string().required('La categoría es obligatoria'),
})


export const ContenedorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  color: Yup.string().required('El color es requerido'),
  dimensiones: Yup.string().required('las dimensiones son requeridas'),
  material: Yup.string().required('El tipo es requerido'),
  estado: Yup.string().required('El estado es requerido'),
  foto: Yup.mixed().nullable(),
  espacio: Yup.mixed().nullable()
});


export const Proveedorschema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  rut: Yup.string().required().matches(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/i, 'RUT inválido'), // Validación básica de RUT chileno
  correo: Yup.string().email().required('El correo es requerido'),
  contacto: Yup.string().required().matches(/^9\d{8}$/i, 'Número de contacto inválido'),
  direccion: Yup.string().required('La dirección es requerida'),
  comuna: Yup.number().required('La comuna es requerida'),
  region: Yup.number().required('La región es requerida'),
  provincia: Yup.number().required('La provincia es requerida'),
});