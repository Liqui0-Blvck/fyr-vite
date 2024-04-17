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


export const camionSchema = Yup.object().shape({
  patente: Yup.string().required('La patente es requerida'),
  acoplado: Yup.boolean(),
  observaciones: Yup.string(),
});

export const conductorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  rut: Yup.string().required('El RUT es requerido'),
  telefono: Yup.string(),
});

export const comercializadorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  razon_social: Yup.string().required('La razón social es requerida'),
  giro: Yup.string().required('El giro es requerido'),
  direccion: Yup.string().required('La dirección es requerida'),
  zip_code: Yup.string(),
  email_comercializador: Yup.string().email('El correo electrónico debe tener un formato válido'),
});

export const operarioSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string(),
  rut: Yup.string().required('El RUT es requerido'),
  tipo_operario: Yup.string().required('El tipo de operario es requerido'),
  activo: Yup.boolean().required('El estado activo/inactivo es requerido'),
  etiquetas: Yup.string(),
  pago_x_kilo: Yup.number().nullable(),
});

export const envaseSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  peso: Yup.number().nullable().min(0, 'El peso debe ser mayor o igual a cero'),
  descripcion: Yup.string(),
});


export const calibracionSchema = Yup.object().shape({
  pre_calibre: Yup.number().required('El pre calibre es requerido'),
  calibre_18_20: Yup.number().required('El calibre 18-20 es requerido'),
  calibre_20_22: Yup.number().required('El calibre 20-22 es requerido'),
  calibre_23_25: Yup.number().required('El calibre 23-25 es requerido'),
  calibre_25_27: Yup.number().required('El calibre 25-27 es requerido'),
  calibre_27_30: Yup.number().required('El calibre 27-30 es requerido'),
  calibre_30_32: Yup.number().required('El calibre 30-32 es requerido'),
  calibre_32_34: Yup.number().required('El calibre 32-34 es requerido'),
  calibre_34_36: Yup.number().required('El calibre 34-36 es requerido'),
  calibre_36_40: Yup.number().required('El calibre 36-40 es requerido'),
  calibre_40_mas: Yup.number().required('El calibre 40+ es requerido'),
  peso_muestra_calibre: Yup.number().required('El peso de muestra de calibre es requerido')
});


export const OperarioProgramaSchema = Yup.object().shape({
  operario: Yup.number().required('El operario es requerido'),
  dia: Yup.string().required('El Día es requerido')
})