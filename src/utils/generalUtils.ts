import { TSelectOptions } from "../components/form/SelectReact";
import { UBICACION_PATIO_TECHADO_EXT, Years } from "../constants/select.constanst";

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


