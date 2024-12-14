import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';

type TButtonKey = 'INFORMACION_PERSONAL' | 'NOTAS' | 'INTERACCIONES' | 'ESTRATEGIAS' | 'INVERSIONES' 
type TButtonText = 'Información Personal' | 'Notas' | 'Interacciones' | 'Estrategias' | 'Inversiones' 

// El tipo TButtons debe ser una lista de botones con su texto
export type TButtons = {
  text: TButtonText;
};

// El tipo TPeriods es un mapa de las claves del botón a su texto
export type TButton = {
  [key in TButtonKey]: TButtons;
};

// Definición de botones
export const ButtonsProspect: TButton = {
  INFORMACION_PERSONAL: { text: 'Información Personal' },
  NOTAS: { text: 'Notas' },
	INTERACCIONES: { text: 'Interacciones' },
	ESTRATEGIAS: { text: 'Estrategias' },
	INVERSIONES: { text: 'Inversiones' },
};

interface IPeriodButtonsPartialProps {
	activeTab: TButtons;
	setActiveTab: Dispatch<SetStateAction<TButtons>>;
}
const PeriodButtonsPartial: FC<IPeriodButtonsPartialProps> = (props) => {
	const { activeTab, setActiveTab } = props;

	const defaultProps: IButtonProps = {
		size: 'sm',
		color: 'zinc',
		rounded: 'rounded-full',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
		variant: 'solid',
	};

	return (
		<div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
			{Object.values(ButtonsProspect).map((i) => (
				<Button
					key={i.text}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(activeTab.text === i.text ? { ...activeProps } : { ...defaultProps })}
					onClick={() => {
						setActiveTab(i);
					}}>
					{i.text}
				</Button>
			))}
		</div>
	);
};

export default PeriodButtonsPartial;
