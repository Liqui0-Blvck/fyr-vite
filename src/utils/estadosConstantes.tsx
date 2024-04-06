import { ESTADOS_MP, TIPO_INFORME } from "./select.constanst";

export const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
  value: String(estado.value),
  label: estado.label
})) ?? []

export const tipo_informe = TIPO_INFORME.map((informe) => ({
  value: String(informe.value),
  label: informe.label
})) ?? []