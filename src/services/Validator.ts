import * as Yup from "yup";

export const productorSchema = Yup.object().shape({
  rut_productor: Yup.string().test(
    "rut-validation",
    "El RUT debe ser un número válido",
    (value) => {
      let rut = value.replace(/\D/g, "");
      if (!/^\d+$/.test(rut)) return false;
      if (rut.length < 8 || rut.length > 9) return false;
      return true;
    },
  ),
  nombre: Yup.string().required("El nombre es obligatorio"),
  telefono: Yup.string().required("El teléfono es obligatorio"),
  region: Yup.string().nullable(),
  provincia: Yup.string().nullable(),
  comuna: Yup.string().nullable(),
  direccion: Yup.string().required("La dirección es obligatoria"),
  movil: Yup.string().nullable(),
  pagina_web: Yup.string().url("Debe ser una URL válida").nullable(),
  email: Yup.string().email("Debe ser un correo electrónico válido").required(
    "El correo electrónico es obligatorio",
  ),
  numero_contrato: Yup.string().nullable(),
});

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
