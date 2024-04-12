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
  id: number
  id_recepcion: number
  ubicacion: string
  fecha_creacion: string
  fecha_modificacion: string
  estado_lote: string
  procesado: boolean
  cc_guia: number
  tipo_recepcion: number
  registrado_por: number
  estado_lote_label: number
}

export type TLoteRechazado = {
  id: number
  resultado_rechazo: string
  fecha_rechazo: string
  fecha_modificacion: string
  recepcionmp: number
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
  sexo: 'F' | 'M' | 'O';
  direccion: string;
  comuna: string;
  celular: string;
  fnacimiento: string;
  valoracion: number;
  fotoperfil: string;
}

export type TFotosCC = {
  id: number
  imagen: string
  ccrecepcionmp: number
}


export type TControlCalidad = {
  id: number
  estado_aprobacion_cc: number
  estado_cc: string
  estado_cc_label: string
  presencia_insectos: boolean
  presencia_insectos_selected: string
  humedad: string
  observaciones: string
  fecha_modificacion: string
  fecha_creacion: string
  recepcionmp: number
  cc_registrado_por: number
  numero_lote: number
  productor: number
  guia_recepcion: number
  estado_guia: string
  estado_aprobacion_cc_label  : string
}

export type TControlCalidadB = {
  id: number
  estado_aprobacion_cc: number
  estado_cc: string
  estado_cc_label: string
  presencia_insectos: boolean
  presencia_insectos_selected: string
  humedad: string
  observaciones: string
  fecha_modificacion: string
  fecha_creacion: string
  recepcionmp: number
  cc_registrado_por: number
  numero_lote: number
  productor: number
  guia_recepcion: number
  estado_guia: string
  estado_aprobacion_cc_label  : string
  control_rendimiento: TRendimientoMuestra[]
  esta_contramuestra: string
  kilos_totales_recepcion: number
  variedad: number
}


export type TRendimientoMuestra = { 
  id: number
  cc_recepcionmp: number
  peso_muestra:number
  muestra_variedad: number
  basura: number
  pelon:number
  cascara: number
  pepa_huerto: number
  pepa: number
  ciega: number
  fecha_creacion: string
  fecha_modificacion: string
  aprobado_cc: boolean
  es_contramuestra: boolean
  esta_contramuestra: number
  registrado_por: null
  cc_ok: boolean
  cc_calibrespepaok: boolean
  cc_rendimiento: TPepaMuestra
}


export type TPepaMuestra = {
  pepa_muestra?: number
  cc_recepcionmp: number
  cc_ok: boolean
  pepa_sana?: number
  fecha_creacion?: string
  fecha_modificacion?: string
  muestra_variedad?: number
  daño_insecto?: number
  hongo?: number
  doble?: number
  fuera_color?: number
  vana_deshidratada?: number
  punto_goma?: number
  goma?: number
  cc_pepaok?: boolean
  cc_calibrespepaok?: boolean
  pre_calibre?: number
  calibre_18_20?: number
  calibre_20_22?: number
  calibre_23_25?: number
  calibre_25_27?: number
  calibre_27_30?: number
  calibre_30_32?: number
  calibre_32_34?: number
  calibre_34_36?: number
  calibre_36_40?: number
  calibre_40_mas?: number
  observaciones?: null
  cc_rendimiento?: number
  peso_muestra_calibre: number
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

export type TCCPromedioPorcentajeMuestras = {
  basura: number;
  pelon: number;
  ciega: number;
  cascara: number;
  pepa_huerto: number;
  pepa_bruta: number;
};

export type TPorcentajeCCPepaSerializer = {
  mezcla: number;
  insecto: number;
  hongo: number;
  dobles: number;
  color: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TPorcentajeCalibresSerializer = {
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

  cc_promedio_porcentaje_muestras: TCCPromedioPorcentajeMuestras
  cc_promedio_porcentaje_cc_pepa: TPorcentajeCCPepaSerializer
  cc_promedio_porcentaje_cc_pepa_calibradas: TPorcentajeCalibresSerializer
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
  estado_envase_label: string
}


export interface TPatioTechadoEx {
  id: number;
  envases: TEnvasePatio[];
  fecha_creacion: string;
  fecha_modificacion: string;
  variedad: string
  id_recepcion: number;
  ubicacion: string;
  estado_lote: string;
  procesado: boolean;
  cc_guia: number;
  tipo_recepcion: number;
  registrado_por: number;
  // control_calidad: TControlCalidad
  estado_lote_label: string
  ubicacion_label: string
}



export type TLoteProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  bin_ingresado: boolean;
  bin_procesado: boolean;
  fecha_procesado: string;
  produccion: number;
  bodega_techado_ext: number;
  procesado_por: string;
  envases?: TEnvasesPrograma[]
}

export type TOperarioProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos: number;
  dia: string;
  produccion: number;
  operario: number;
}

export type TTarjaResultante = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tipo_resultante: string;
  peso: number;
  tipo_patineta: number;
  cc_tarja: boolean;
  fecha_cc_tarja: string;
  ubicacion: string;
  codigo_tarja: string;
  calle_bodega: string;
  produccion: number;
  registrado_por: string;
}

export type TProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: string;
  estado_label: string,
  fecha_inicio_reproceso: string | null;
  fecha_termino_reproceso: string | null;
  fecha_cierre_proceso: string | null;  
  fecha_termino_proceso: string | null;
  fecha_pausa_proceso: string | null;
  fecha_finpausa_proceso: string | null;
  registrado_por: number;
  lotes: TLoteProduccion[]
  operarios: TOperarioProduccion[]
  tarjas_resultantes: TTarjaResultante[]
}

export type TEnvasesPrograma = {
  id: number;
  numero_lote: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  bin_ingresado: boolean;
  bin_procesado: boolean;
  fecha_procesado: string;
  produccion: number;
  bodega_techado_ext: number;
  procesado_por: number;
  guia_patio: number
  numero_bin: number
  kilos_fruta: number
  variedad: string
  guia_recepcion: number
  control_calidad: number
}

export type TControlCalidadTarja = {
  id: number;
  estado_cc: string;
  variedad: string;
  calibre: string;
  cantidad_muestra: number | null;
  trozo: number;
  picada: number;
  hongo: number;
  daño_insecto: number;
  dobles: number;
  goma: number;
  basura: number;
  mezcla_variedad: number;
  pepa_sana: number;
  fuera_color: number;
  punto_goma: number;
  vana_deshidratada: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tarja: number;
  cc_registrado_por: string | null;
  estado_cc_label: string
  codigo_tarja: string
}

export type TCalibreTarja = {
  sincalibre: number
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



export type TRendimientoActual = {
  cc_pepa_calibre: TCalibreTarja;
}



