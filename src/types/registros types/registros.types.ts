export type TGuia = {
  id: number;
  lotesrecepcionmp: [];
  camion: string;
  camionero: string;
  estado_recepcion: string;
  estado_recepcion_label: string;
  productor: string;
  comercializador: string;
  creado_por: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  mezcla_variedades: boolean;
  cierre_guia: boolean;
  tara_camion_1: number;
  tara_camion_2: number;
  terminar_guia: boolean;
  numero_guia_productor: number;
  nombre_camion: string;
  nombre_camionero: string;
  nombre_productor: string;
  nombre_comercializador: string;
};

export type TCamion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  patente: string;
  acoplado: boolean;
  observaciones: string;
};

export type TConductor = {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};

export type TComercializador = {
  id: number;
  nombre: string;
  razon_social: string;
  giro: string;
  direccion: string;
  zip_code: string;
  email_comercializador: string;
};

export type TEnvases = {
  id: number;
  nombre: string;
  peso: number;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};

export type TProductor = {
  id: number;
  rut_productor: string;
  nombre: string;
  telefono: string;
  region: number;
  provincia: number;
  comuna: number;
  region_nombre: string;
  provincia_nombre: string;
  comuna_nombre: string;
  direccion: string;
  movil: string;
  pagina_web: string;
  email: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  numero_contrato: number;
  usuarios: [];
};

export type TOperarios = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  nombre: string;
  apellido: string;
  rut: string;
  tipo_operario: string;
  activo: boolean;
  etiquetas: string;
  pago_x_kilo: number;
};

export type TUsuario = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
};

export type TEnvaseEnGuia = {
  id: number;
  variedad: string;
  tipo_producto: string;
  cantidad_envases: number;
  envase: number;
  recepcionmp: number;
};

export type TLoteGuia = {
  id: number;
  envases: TEnvaseEnGuia[];
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_brutos_1: number;
  kilos_brutos_2: number;
  kilos_tara_1: number;
  kilos_tara_2: number;
  estado_recepcion: string;
  numero_lote: number;
  guiarecepcion: number;
  creado_por: number;
};


export type TPatioExterior = {
  id: number,
  id_recepcion: number,
  ubicacion: string,
  fecha_creacion: string,
  fecha_modificacion: string,
  estado_lote: string,
  procesado: boolean,
  cc_guia: number,
  tipo_recepcion: number,
  registrado_por: number
}

export type TLoteRechazado = {
  id: number,
  resultado_rechazo: string
  fecha_rechazo: string
  fecha_modificacion: string
  recepcionmp: number,
  rechazado_por: boolean
  numero_lote: number
  resultado_rechazo_label: string
  numero_lote_rechazado: number
}

export type TCargo = {
  id: number;
  cargo_label: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  cargo: string;
  perfil: number;
}

export type TPerfil = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  cargos: TCargo[];
  fecha_creacion: string;
  fecha_modificacion: string;
  sexo: string;
  direccion: string;
  comuna: string;
  celular: string;
  fnacimiento: string;
  valoracion: number;
  fotoperfil: string;
}

export type TFotosCC = {
  id: number
  imagen: string,
  ccrecepcionmp: number
}


export type TControlCalidad = {
  id: number,
  estado_aprobacion_cc: number,
  estado_cc: string,
  estado_cc_label: string,
  presencia_insectos: boolean,
  presencia_insectos_selected: string,
  humedad: string,
  observaciones: string,
  fecha_modificacion: string,
  fecha_creacion: string,
  recepcionmp: number,
  cc_registrado_por: number
  numero_lote: number
  productor: number
  guia_recepcion: number
  estado_guia: string
  estado_aprobacion_cc_label  : string
}

export type TRendimientoMuestra = {
  id: number,
  cc_recepcionmp: number,
  peso_muestra:number,
  muestra_variedad: number
  basura: number,
  pelon:number,
  cascara: number,
  pepa_huerto: number,
  pepa: number,
  ciega: number,
  fecha_creacion: string
  fecha_modificacion: string
  aprobado_cc: boolean,
  es_contramuestra: boolean,
  esta_contramuestra: number,
  registrado_por: null
  cc_ok: boolean
  cc_calibrespepaok: boolean
  cc_rendimiento: TPepaMuestra
}


export type TPepaMuestra = {
  pepa_muestra?: number,
  pepa_sana?: number,
  fecha_creacion?: string,
  fecha_modificacion?: string,
  muestra_variedad?: number,
  daño_insecto?: number,
  hongo?: number,
  doble?: number,
  fuera_color?: number,
  vana_deshidratada?: number,
  punto_goma?: number,
  goma?: number,
  cc_pepaok?: boolean,
  cc_calibrespepaok?: boolean,
  pre_calibre?: number,
  calibre_18_20?: number,
  calibre_20_22?: number,
  calibre_23_25?: number,
  calibre_25_27?: number,
  calibre_27_30?: number,
  calibre_30_32?: number,
  calibre_32_34?: number,
  calibre_34_36?: number,
  calibre_36_40?: number,
  calibre_40_mas?: number,
  observaciones?: null,
  cc_rendimiento?: number
  peso_muestra_calibre: number
}


export type TControlCalidadB = {
  id: number,
  estado_aprobacion_cc: number,
  estado_cc: string,
  estado_cc_label: string,
  presencia_insectos: boolean,
  presencia_insectos_selected: string,
  humedad: string,
  observaciones: string,
  fecha_modificacion: string,
  fecha_creacion: string,
  recepcionmp: number,
  cc_registrado_por: number
  numero_lote: number
  productor: number
  guia_recepcion: number
  estado_guia: string
  estado_aprobacion_cc_label  : string
  control_rendimiento: TRendimientoMuestra[]
}









export type TMuestraSerializer = {
  cc_lote: number;
  basura: number;
  pelon: number;
  ciega: number;
  cascara: number;
  pepa_huerto: number;
  pepa_bruta: number;
};

export type TCCPepaSerializer = {
  cc_lote: number;
  mezcla: number;
  insecto: number;
  hongo: number;
  dobles: number;
  color: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TCalibresSerializer = {
  cc_lote: number;
  precalibre: number;
  calibre_18_20: number;
  calibre_20_22: number;
  calibre_23_25: number;
  calibre_25_27: number;
  calibre_27_30: number;
  calibre_30_32: number;
  calibre_32_34: number;
  calibre_34_36: number;
  calibre_36_40: number;
  calibre_40_mas: number;
};

export type TDescuentosSerializer = {
  cc_lote: number;
  pepa_exp: number;
  cat2: number;
  desechos: number;
  mezcla: number;
  color: number;
  dobles: number;
  insecto: number;
  hongo: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TAportePexSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TPorcentajeLiquidarSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TKilosMermaSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TMermaPorcentajeSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TCalculoFinalSerializer = {
  kilos_netos: number;
  kilos_brutos: number;
  por_brutos: number;
  merma_exp: number;
  final_exp: number;
  merma_cat2: number;
  final_cat2: number;
  merma_des: number;
  final_des: number;
};


export type TRendimiento = {
  cc_muestra: TMuestraSerializer[];
  cc_pepa: TCCPepaSerializer[];
  cc_pepa_calibre: TCalibresSerializer[];
  cc_descuentos: TDescuentosSerializer[];
  cc_aportes_pex: TAportePexSerializer[];
  cc_porcentaje_liquidar: TPorcentajeLiquidarSerializer[];
  cc_kilos_des_merma: TKilosMermaSerializer[];
  cc_merma_porc: TMermaPorcentajeSerializer[];
  cc_calculo_final: TCalculoFinalSerializer;
};


export interface TEnvasePatio {
  id: number;
  kilos_fruta: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  variedad: string;
  estado_envase: string;
  numero_bin: number;
  guia_patio: number;
}


export interface TPatioTechadoEx {
  id: number;
  envases: TEnvasePatio[];
  fecha_creacion: string;
  fecha_modificacion: string;
  id_recepcion: number;
  ubicacion: string;
  estado_lote: string;
  procesado: boolean;
  cc_guia: number;
  tipo_recepcion: number;
  registrado_por: number;
}