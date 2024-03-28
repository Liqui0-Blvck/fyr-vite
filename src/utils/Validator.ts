import * as Yup from "yup";

function validarRut(rut: any) {
  // Formato válido: xx.xxx.xxx-x
  if (!/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/.test(rut)) {
    return false;
  }

  const digits = rut.split('.').join('').split('-')[0];
  let splitDigits = digits.split('');
  let factor = 2;
  let sum = 0;

  for (let i = splitDigits.length - 1; i >= 0; i--) {
    if (factor > 7) {
      factor = 2;
    }
    sum += parseInt(splitDigits[i]) * factor;
    factor++;
  }

  const verifierDigit = 11 - (sum % 11);
  const expectedVerifier = (verifierDigit === 11) ? '0' : (verifierDigit === 10) ? 'k' : verifierDigit.toString();

  return expectedVerifier === rut.slice(-1).toLowerCase();
}

function validarRutB(rut: string) {
  // Formato válido: xxxxxxxx-x
  if (!/^\d{7,8}-\d{1}$/.test(rut)) {
    return false;
  }
}



export const headerGuiaRegistroSchema = Yup.object().shape({
  estado_recepcion: Yup.string().nullable(),
  mezcla_variedades: Yup.boolean().required(),
  cierre_guia: Yup.boolean().required(),
  tara_camion_1: Yup.number().nullable(),
  tara_camion_2: Yup.number().nullable(),
  terminar_guia: Yup.boolean().required(),
  numero_guia_productor: Yup.string().required(),
  creado_por: Yup.string().nullable(),
  comercializador: Yup.string().nullable().required(),
  productor: Yup.string().nullable().required(),
  camionero: Yup.string().nullable().required(),
  camion: Yup.string().nullable().required(),
});


export const ProductorSchema = Yup.object().shape({
  rut_productor: Yup.string().required('El RUT del productor es requerido'),
  nombre: Yup.string().required('El nombre es requerido'),
  telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos'),
  region: Yup.string().nullable().required('La región es requerida'),
  provincia: Yup.string().nullable().required('La provincia es requerida'),
  comuna: Yup.string().nullable().required('La comuna es requerida'),
  direccion: Yup.string().required('La dirección es requerida'),
  movil: Yup.string().matches(/^\+569\s\d{8}$/, 'El móvil debe tener el formato "+569 12345678"'),
  pagina_web: Yup.string().url('Ingrese una URL válida'),
  email: Yup.string().email('Ingrese un correo electrónico válido'),
  numero_contrato: Yup.string().nullable()
})
