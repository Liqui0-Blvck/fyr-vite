import { TSelectOptions } from "../components/form/SelectReact"
import { TCamion } from "../types/registros types/registros.types"
import { RESULTADO_RECHAZO, TIPO_ACOPLADO, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from "../utils/select.constanst"

const acoplados = TIPO_ACOPLADO?.map((acoplado) => ({
  value: acoplado.values,
  label: acoplado.label
})) ?? []


const resultadosRechazo = RESULTADO_RECHAZO?.map((resultado) => ({
  value: String(resultado.value),
  label: resultado.label
  })) ?? []


export const variedadFilter = VARIEDADES_MP?.map((producto) => ({
  value: String(producto.value),
  label: producto.label
})) ?? []

export const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
  value: String(producto.value),
  label: producto.label
})) ?? []


export const optionsRadio = [
  { id: 1, value: true, label: 'Si'},
  { id: 2, value: false, label: 'No'}
];



export const optionsAcoplado: TSelectOptions | [] = acoplados
export const optionResultados: TSelectOptions | [] = resultadosRechazo

























