type TTabsText = 'General' | 'Tarja Resultante' | 'Envases de Lotes Seleccionados' | 'Procesar Masivamente' | 'Operarios en Programa';

export type TTabs = {
	text: TTabsText;
};

type TTabsKey = 'GN' | 'TR' | 'ELS' | 'PM' | 'OP';

export type TTabsK = {
	[key in TTabsKey]: TTabs;
};

export const OPTIONS: TTabsK = {
  GN: { text: 'General'},
  TR: { text: 'Tarja Resultante' },
  ELS: { text: 'Envases de Lotes Seleccionados' },
  PM: { text: 'Procesar Masivamente' },
  OP: { text: 'Operarios en Programa' },
};
