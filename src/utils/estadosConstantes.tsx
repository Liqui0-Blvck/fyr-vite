import { ESTADOS_MP } from "../constants/select.constanst";

export const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
  value: String(estado.value),
  label: estado.label
})) ?? []