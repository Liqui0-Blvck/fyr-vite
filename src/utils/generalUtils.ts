import { TSelectOptions } from "../components/form/SelectReact";
import { CALLE_BODEGA, TIPOS_BIN, TIPO_RESULTANTE, UBICACION_PATIO_TECHADO_EXT, Years } from "./select.constanst";

export const cargolabels = (perfilData: any) => {
  if (!perfilData) {
    return [];
  }

  const cargoLabels = perfilData.cargos.map((cargo: any) => cargo.cargo_label) || [];
  // Agrega más campos aquí según sea necesario

  return cargoLabels;
};

export const optionYear: TSelectOptions | [] = Years?.map((year) => ({
  value: String(year.value),
  label: year.label
})) ?? []

export const optionsUbicaciones: TSelectOptions | []  = UBICACION_PATIO_TECHADO_EXT?.map((ubicacion) => ({
  value: ubicacion.value,
  label: ubicacion.label
})) ?? []

export const optionTipoResultante: TSelectOptions | [] = TIPO_RESULTANTE?.map((tipo) => ({
  value: String(tipo.value),
  label: tipo.label
})) ?? []

export const optionCalleBodega: TSelectOptions | [] = CALLE_BODEGA?.map((calle) => ({
  value: String(calle.value),
  label: calle.label
})) ?? []

export const optionTipoPatineta: TSelectOptions | [] = TIPOS_BIN?.map((patineta) => ({
  value: String(patineta.value),
  label: patineta.label
})) ?? []





