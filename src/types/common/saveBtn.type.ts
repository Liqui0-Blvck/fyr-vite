export type TSaveBtnStatusValue = 'Registrar' | 'Guardar' | 'Guardando' | 'Guardado';
export type TSaveBtnStatus = {
	[key in 'REGISTRAR' | 'GUARDAR' | 'GUARDANDO' | 'GUARDADO']: TSaveBtnStatusValue;
};
