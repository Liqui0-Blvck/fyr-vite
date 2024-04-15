import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';
import PERIOD, { TPeriod } from '../../../constants/periods.constant';
import { TTabs } from '../../../types/registros types/registros.types';

interface IPeriodButtonsPartialProps {
	activeTab: TTabs;
	setActiveTab: Dispatch<SetStateAction<TTabs>>;
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


	const OPTIONS: TTabs = {
		GENERAL: { text: 'General' },
		TARJA_RESULTANTE: { text: 'Tarja Resultante' },
		ENVASES: { text: 'Envases de Lotes Seleccionados' },
		// MASIVO: { text: 'Procesar Masivamente' },
		OPERARIOS: { text: 'Operarios en Programa' },
	};
	


	console.log(activeTab)

	return (
		<div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
			{Object.values(OPTIONS).map((i) => (
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
