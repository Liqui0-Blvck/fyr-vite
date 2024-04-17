import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { TEnvasesPrograma, TProduccion, TTarjaResultante } from "../../../types/registros types/registros.types";
import Chart, { IChartProps } from "../../../components/Chart";



interface ICardFrutaCalibradaProps {
	programa: TProduccion
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
	refresh: Dispatch<SetStateAction<boolean>>
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps>= ({ tarjas_resultantes, refresh  }) => {
	const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const residuo_solido = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)

	const chartProps: IChartProps = {
		series: [{
			name: 'Kilos',
			data: [Number(pepa_calibrada), Number(pepa_borrel), Number(residuo_solido)],
		}],
		options: {
			chart: {
				type: 'bar',
				height: 250,
			},
			plotOptions: {
				bar: {
					horizontal: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				categories: ['Kilos Fruta Calibrada', 'Kilos Totales Borrel',  'Kilos Totales Residuos Solidos'],
			},
			yaxis: {
				title: {
					text: 'Kilogramos (kgs)',
				},
			},
			title: {
				text: 'Información de Producción',
				align: 'center',
			},
		},
		type: 'bar',
		width: '100%',
		height: '200px',
	};


	useEffect(() => {
		let isMounted = true
		if (isMounted){
			refresh(true)
		}

		return () => {
			isMounted = false 
		}
	}, [refresh])

	return (
		<Card className="h-full w-full">
			<CardBody className="w-full h-full flex flex-col md:flex-col lg:flex-row-reverse gap-y-5 lg:gap-2">
				<div className='w-full md:w-full lg:w-96 flex flex-col justify-between gap-y-2 md:gap-2 lg:gap-2 '>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilo Fruta Calibrada: {pepa_calibrada} kgs.</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos Fruta Borrel: {pepa_borrel} kgs</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos Residuos Solidos: {residuo_solido} kgs</span>
					</div>
				</div>

				<div className="w-full md:7/12 lg:w-9/12 h-full">
					<Chart {...chartProps} />
				</div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaCalibrada;
