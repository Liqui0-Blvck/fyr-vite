import { TSelectOptions } from "../components/form/SelectReact";
import { CALIBRES, CALLE_BODEGA, CANTIDAD_MUESTRA_PRODUCCION, TIPOS_BIN, TIPO_RESULTANTE, UBICACION_PATIO_TECHADO_EXT, VARIEDADES_MP, Years } from "./select.constanst";

type OptionType = {
  value: string;
  label: string;
};

export const cargolabels = (perfilData: any) => {
  if (!perfilData) {
    return [];
  }

  const cargoLabels = perfilData.cargos.map((cargo: any) => cargo.cargo_label) || [];

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

export const optionsVariedad: TSelectOptions | [] = VARIEDADES_MP?.map((variedad) => ({
  value: String(variedad.value),
  label: variedad.label
})) ?? []

export const optionsCantidadMuestra: TSelectOptions | [] = CANTIDAD_MUESTRA_PRODUCCION?.map((cantidad) => ({
  value: String(cantidad.value),
  label: cantidad.label
})) ?? []




export const optionsCalibres: OptionType[] = CALIBRES.reduce<OptionType[]>((acc, categoria) => {
  // Itera sobre las categorías y calibres para generar las opciones
  const opcionesCategoria = categoria.calibres.map((calibre) => ({
    value: calibre.id,
    label: calibre.name,
  }));
  // Concatena las opciones de esta categoría con las opciones acumuladas
  return [...acc, ...opcionesCategoria];
}, []);





