import { TCargo } from "../types/registros types/registros.types";

export const ESTADOS = [
  "Muy mal estado",
  "Mal estado",
  "Regular",
  "Buen estado",
  "Muy buen estado",
  "Nuevo",
];

export const ESTADO_OC = [
  { value: 1, label: "Creada" },
  { value: 2, label: "Aprobada" },
  { value: 3, label: "Rechazada" },
  { value: 4, label: "Pendiente" },
  { value: 5, label: "Procesada" },
];

export const TIPO_PROCESADOR = [
  "Intel i3",
  "Intel i5",
  "Intel i7",
  "Intel i9",
  "Ryzen 3",
  "Ryzen 5",
  "Ryzen 7",
  "Ryzen 9",
];

export const CANTIDAD_RAM = [
  "2 GB",
  "4 GB",
  "6 GB",
  "8 GB",
  "10 GB",
  "12 GB",
  "14 GB",
  "16 GB",
];

export const TIPO_LICENCIA = [
  "Windows 10",
  "Windows 10 Pro",
  "Windows 11",
  "Windows 11 Pro",
];

export const DEPARTAMENTO = [
  "Departamento de Abogacía",
  "Departamento de Comunicaciones",
  "Departamento de Desarrollo de Programas",
  "Departamento de Finanzas y Control",
  "Departamento de Padrinazgo",
  "Departamento de Recaudación de Fondos",
  "Departamento de Recursos Humanos & DO",
  "Departamento de TIC",
  "Dirección Nacional",
  "Interárea",
];

export const TIPO_DISCO = [
  "Sin especificar",
  "Disco Duro",
  "SSD",
];

export const CAPACIDAD_DISCO = [
  "Sin especificar",
  "250 GB",
  "500 GB",
  "1 TB",
  "2 TB",
];

export const TIPO_CLIENTE = [
  { value: 1, label: "Empresa" },
  { value: 2, label: "Fundacion" },
];

export const ESTADO_CLIENTE = [
  { value: 1, label: "Activo" },
  { value: 2, label: "Inactivo" },
];

export const TIPOS_OPERARIO = [
  { values: "seleccion", label: "Operario de Selección" },
  { values: "colosos", label: "Operario Colosos" },
  { values: "gruero", label: "Operario Gruero" },
  { values: "embalaje", label: "Operario Embalaje" },
];

export const TIPO_ACOPLADO = [
  { values: "true", label: "Con Acoplado" },
  { values: "false", label: "Sin Acoplado" },
];

export const ACTIVO = [
  { id: 1, values: "true", label: "Si" },
  { id: 2, values: "false", label: "No" },
];

export const VARIEDADES_MP = [
  { value: "SL", label: "Solano" },
  { value: "MO", label: "Mono" },
  { value: "CM", label: "Carm el" },
  { value: "RB", label: "Ruby" },
  { value: "PR", label: "Price" },
  { value: "WC", label: "Wood Colony" },
  { value: "TK", label: "Tokio" },
  { value: "MD", label: "Merced" },
  { value: "TC", label: "Tuca" },
  { value: "NP", label: "Nonpareil" },
  { value: "RV", label: "Revueltas" },
  { value: "PD", label: "Padre" },
  { value: "TX", label: "Texas" },
  { value: "MC", label: "Marcona" },
  { value: "GU", label: "Guara" },
  { value: "DS", label: "Desmayo" },
  { value: "IX", label: "Ixl" },
  { value: "TH", label: "Thompson" },
  { value: "DK", label: "Drake" },
  { value: "VS", label: "Vesta" },
  { value: "NL", label: "Neplus" },
  { value: "FR", label: "Fritz" },
  { value: "BU", label: "Butte" },
  { value: "MI", label: "Mission" },
  { value: "NE", label: "Neplus" },
  { value: "CA", label: "Tipo California" },
  { value: "MZ", label: "Mezcla" },
  { value: "ID", label: "Independence" },
  { value: "AV", label: "Avijar" },
  { value: "IS", label: "Isabelona" },
  { value: "ST", label: "Soleta" },
  { value: "VI", label: "Vialfas" },
];

export const TIPO_PRODUCTOS_RECEPCIONMP = [
  { value: "1", label: "Almendra con Pelon" },
  { value: "2", label: "Pepa Calibrada" },
  { value: "3", label: "Canuto" },
];

export const ESTADOS_LOTE_COLOSOS = [
  { value: "1", label: "Lote Colosos Creado" },
  { value: "2", label: "Lote En Inspecion Visual Por CC" },
  { value: "3", label: "Lote Interno Aprobado" },
  { value: "4", label: "Lote Interno Rechazado" },
  { value: "5", label: "MP Almacenada" },
];

export const ESTADOS_MP = [
  { value: "1", label: "MP Recepcionada" },
  { value: "2", label: "MP En Inspecion Visual Por CC" },
  { value: "3", label: "MP Aprobada, Esperando Ubicacion Descarga" },
  { value: "4", label: "MP Rechazada" },
  { value: "5", label: "MP Almacenada" },
  { value: "6", label: "MP Recepcion Completada" },
  { value: "7", label: "Lote Procesado" },
];

export const ESTADOSGUIARECEPCION_MP = [
  { value: "1", label: "Guia Creada" },
  { value: "2", label: "Guia En Proceso" },
  { value: "3", label: "Guia Completada, esperando Tara" },
  { value: "4", label: "Guia Cerrada" },
];

export const ESTADOS_GUIA_MP = [
  { value: "1", label: "Iniciar Inspección" },
  { value: "2", label: "Registrar Control Calidad" },
];

export const ESTADO_CONTROL = [
  { value: "1", label: "Lote Aprobado x CC" },
  { value: "0", label: "Lote Rechazado x CC" },
  { value: "2", label: "Pendiente CC" },
];

export const UBICACION_PATIO_TECHADO_EXT = [
  { value: "0", label: "Pendiente Ubicacion" },
  { value: "1", label: "Sector 1" },
  { value: "2", label: "Sector 2" },
  { value: "3", label: "Sector 3" },
];

export const perfilesPermitidos = ["Recepcion", "Control Calidad", "Bodega"];
export const usuarioRole = {
  name: "Nicolas",
  area: "Recepcion",
};


export const RESULTADO_RECHAZO = [
  { value: '0', label: 'Rechazo Registrado'},
  { value: '1', label: 'Devuelto a Productor'},
  { value: '2', label: 'Derivado a Campo Secado'},
]


export const CARGOS_PERFILES = [
  'RecepcionMP',
  'CDC Jefatura',
  'CDC Operario MP',
  'Bodega Patio Exterior',
  'Produccion',
  'Produccion Admin',
  'Seleccion',
  'Seleccion Admin',
  'Administrador'
]


export function checkCargoPerfil(cargos: TCargo[]): boolean {
  // Extrae los cargo_label de la lista de cargos
  const cargoLabels: string[] = cargos.map(cargo => cargo.cargo_label);

  // Comprueba si alguno de los cargo_label está en CARGOS_PERFILES
  for (const cargoLabel of cargoLabels) {
    if (CARGOS_PERFILES.includes(cargoLabel)) {
      console.log(cargoLabel)
      return true;
    }
  }

  // Si ninguno de los cargo_label está en CARGOS_PERFILES, devuelve false
  return false;
}



export const TIPO_INFORME = [
  {value: 1, label: 'Pre Limpia'},
  {value: 2, label: 'Descascarado/ Despelonado'}
]


export const Years = [
  {value: 1, label: '2024'},
  {value: 2, label: '2023'},
  {value: 3, label: '2022'},
  {value: 4, label: '2021'},
  {value: 5, label: '2020'},
]