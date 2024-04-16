
import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TEnvasesPrograma, TProduccion, TTarjaResultante } from "../../../types/registros types/registros.types";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import Chart, { IChartProps } from "../../../components/Chart";


interface ICardFrutaCalibradaProps {
	programa: TProduccion
	envases_programa: TEnvasesPrograma[]
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
  refresh: Dispatch<SetStateAction<boolean>>
}

const CardFrutaIngresada: FC<ICardFrutaCalibradaProps> = ({ envases_programa, programa, refresh, tarjas_resultantes }) => {

	const totalEnvases = programa?.lotes.length || 1; 

	const kilosTotales = envases_programa?.length ?
		((envases_programa.reduce((acc, envase) => (envase?.kilos_fruta || 0) + acc, 0) / totalEnvases) * 100).toFixed(1)
		: 0;

	const kilosTotalesProcesados = envases_programa?.filter(envase => envase?.bin_procesado === true).length ?
		((envases_programa.filter(envase => envase?.bin_procesado === true)
			.reduce((acc, envase) => (envase?.kilos_fruta || 0) + acc, 0) / totalEnvases) * 100).toFixed(1)
		: 0;

  useEffect(() => {
    let isMounted = true
    if (isMounted){
      refresh(true)
    }

    return () => {
      isMounted = false
    }
  }, [refresh])

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
    height: '180px',
  };


  const now = new Date()

	const kilos_totales_procesados = envases_programa?.
		filter(envase => envase?.bin_procesado === true && envase.fecha_modificacion).
		filter(envase => {  
			const diffTime = now.getTime() - new Date(envase.fecha_modificacion).getTime();
			const diffHours = diffTime / (1000 * 3600);
			return diffHours <= 1;
		}).
		reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1);


  const pepa_calibrada = (tarjas_resultantes?.filter(tarja => {
    const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime();
    const diffHours = diffTime / (1000 * 3600);
    return diffHours <= 1;
  }).reduce((acc, tarja) => tarja.peso + acc, 0)!);
  
  const totalKilosFrutaPrograma = envases_programa?.reduce((acc, lote) => lote.kilos_fruta + acc, 0);
  
  const pepaCalibradaPercentage = ((pepa_calibrada / (totalKilosFrutaPrograma || 1)) * 100).toFixed(2) || 0

	console.log("soy una pepa calibrada", tarjas_resultantes)

	const chartProps2: IChartProps = {
		series: [Number(kilos_totales_procesados), Number(pepa_calibrada)],
		options: {
			chart: {
				type: 'donut',
			},
			labels: ['Fruta calibrada', 'Fruta procesada'],
			responsive: [{
				options: {
					legend: {
						position: 'bottom'
					}
				}
			}],
		},
		type: 'donut',
		width: '90%',
		height: '200px',
	};




	return (
		<div className="flex flex-col md:flex-col lg:flex-row gap-2">
      <Card className="w-full h-[90%]">
        <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2">
          <div className='w-full flex justify-between gap-y-2 md:gap-2 lg:gap-2 '>
            <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
              <span className="text-center w-11/12 mx-auto">Kilos totales en producción: {0} kgs</span>
            </div>
            <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
              <span className="text-center w-8/12 mx-auto">Kilo Fruta Procesados: {1} kgs.</span>
            </div>
            <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
              <span className="text-center w-8/12 mx-auto">Total de envases a procesar: {programa?.lotes.length} </span>
            </div>
          </div>
          <div className="w-full h-full">
            <Chart {...chartProps} />

          </div>
        </CardBody>
      </Card>

      <Card className="w-full h-[90%]">
        <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2 ">

          <div className='w-full flex gap-y-2 md:gap-2 lg:gap-2 '>
            <div className='w-full h-ful dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
              <span>Fruta procesada en ultima hora: {kilos_totales_procesados} kgs</span>
            </div>
            <div className='w-full h-ful dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
              <span>Fruta calibrada en ultima hora: {pepa_calibrada} kgs.</span>
            </div>
          </div>

          <div className="w-full h-full">

            <Chart {...chartProps2} />
          </div>
        </CardBody>
      </Card>
    </div>
	);
};

export default CardFrutaIngresada;
