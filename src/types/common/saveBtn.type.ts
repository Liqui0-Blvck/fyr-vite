export type TSaveBtnStatusValue = 'Publish' | 'Guardar' | 'Guardando' | 'Guardado';
export type TSaveBtnStatus = {
	[key in 'PUBLISH' | 'SAVE' | 'SAVING' | 'SAVED']: TSaveBtnStatusValue;
};
