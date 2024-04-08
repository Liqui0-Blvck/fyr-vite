import { TCargo } from "../types/registros types/registros.types";

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


export const TIPO_RESULTANTE = [
  { value: '1', label: 'Borrel'},
  { value: '2', label: 'Residuo Solido'},
  { value: '3', label: 'Pepa Calibrada'},   
]

export const CALLE_BODEGA = [
  { value: '-', label: 'Seleccione Calle'},
  { value: 'F', label: 'Calle de Fumigado'},
  { value: '1', label: 'Calle 1'},
  { value: '2', label: 'Calle 2'},
  { value: '3', label: 'Calle 3'},
  { value: '4', label: 'Calle 4'},
  { value: '5', label: 'Calle 5'},
  { value: '6', label: 'Calle 6'},
  { value: '7', label: 'Calle 7'},
  { value: '8', label: 'Calle 8'},
  { value: '9', label: 'Calle 9'},
  { value: '10',label:  'Calle 10'},
  { value: '11',label:  'Calle 11'},
  { value: '12',label:  'Calle 12'},
]


export const TIPOS_BIN = [
    { value: 40,  label: 'Patineta Negra'},
    { value: 43.5, label: 'Patineta Blanca'},
    { value: 44.6, label: 'UPC'}
]




export const CALIBRES = [
  {
    name: 'Categoria 1',
    calibres: [
      { id: '0', name: 'Sin Calibre' },
      { id: '1', name: 'PreCalibre' },
      { id: '2', name: '18/20' },
      { id: '3', name: '20/22' },
      { id: '4', name: '23/25' },
      { id: '5', name: '25/27' },
      { id: '6', name: '27/30' },
      { id: '7', name: '30/32' },
      { id: '8', name: '32/34' },
      { id: '9', name: '34/36' },
      { id: '10', name: '36/40' },
      { id: '11', name: '40+' },
    ],
  },
  {
    name: 'Elaborados',
    calibres: [
      { id: '12', name: '3x5mm' },
      { id: '13', name: '2x4mm' },
      { id: '14', name: '4x6mm' },
      { id: '15', name: '3x5mm' },
      { id: '16', name: '2x4mm' },
      { id: '17', name: '4x6mm' },
      { id: '18', name: '+2mm' },
      { id: '19', name: '-2mm' },
      { id: '20', name: '+2mm' },
      { id: '21', name: '-2mm' },
    ],
  },
];

export const CANTIDAD_MUESTRA_PRODUCCION = [
  { value: 250, label: '250 Gramos' },
  { value: 500, label: '500 Gramos' },
]