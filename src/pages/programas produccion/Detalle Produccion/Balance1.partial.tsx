
import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TEnvasesPrograma, TProduccion } from "../../../types/registros types/registros.types";
import { FC } from "react";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import Chart, { IChartProps } from "../../../components/Chart";


interface ICardFrutaCalibradaProps {
	programa: TProduccion
	envases_programa: TEnvasesPrograma[]
	activeTab: TTabs
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ envases_programa, programa }) => {
	const totalEnvases = programa?.lotes.length || 1; 

	const kilosTotales = envases_programa?.length ?
		((envases_programa.reduce((acc, envase) => (envase?.kilos_fruta || 0) + acc, 0) / totalEnvases) * 100).toFixed(1)
		: 0;

	const kilosTotalesProcesados = envases_programa?.filter(envase => envase?.bin_procesado === true).length ?
		((envases_programa.filter(envase => envase?.bin_procesado === true)
			.reduce((acc, envase) => (envase?.kilos_fruta || 0) + acc, 0) / totalEnvases) * 100).toFixed(1)
		: 0;


	const seriesData = [Number(kilosTotales), Number(kilosTotalesProcesados)]; 
  const optionsData = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    xaxis: {
      categories: ['Kilos Totales en Producción', 'Kilos de Fruta Procesados'],
    },
    colors: ['#008FFB'],
    yaxis: {
      title: {
        text: 'Kilogramos (kgs)',
      },
    },
    title: {
      text: 'Información de Producción',
      align: 'center',
    },
  };

  // Combina los datos de las series y las opciones en un objeto props
  const chartProps: IChartProps = {
    series: [{
      name: 'Kilos',
      data: seriesData,
    }],
    options: optionsData as any,
    type: 'bar',
    width: '100%', // Puedes ajustar el ancho y alto según tus necesidades
    height: '230px',
  };




	return (
		<Card className="h-full w-full">
			<CardBody className="w-full h-full flex flex-col md:flex-col lg:flex-row gap-y-5 lg:gap-2">
				<div className='w-full md:w-full lg:w-96 flex flex-col justify-between gap-y-2 md:gap-2 lg:gap-2 '>
					<div className='w-full h-20 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos totales en producción: {0} kgs</span>
					</div>
					<div className='w-full h-20 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilo Fruta Procesados: {1} kgs.</span>
					</div>
					<div className='w-full h-20 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
	
						<span>Total de envases a procesar: {programa?.lotes.length} </span>
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
