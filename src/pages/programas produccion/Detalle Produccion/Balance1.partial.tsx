
import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TEnvasesPrograma, TProduccion } from "../../../types/registros types/registros.types";
import { FC } from "react";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";


interface ICardFrutaCalibradaProps {
	programa: TProduccion
	envases_programa?: TEnvasesPrograma[]
	activeTab: TTabs
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ activeTab, envases_programa, programa }) => {

	const kilos_totales = envases_programa?.reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1)
  const kilos_totales_procesados = envases_programa?.
    filter(envase => envase?.bin_procesado === true).
    reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1)

	console.log(envases_programa)

	return (
		<Card className="h-full w-full ">
			<CardBody className="w-full h-40">
				<div className='flex flex-col gap-2 '>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos totales en producción: {kilos_totales} kgs</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilo Fruta Procesados: {kilos_totales_procesados} kgs.</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
	
						<span>Total de envases a procesar: {programa?.lotes.length} </span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaCalibrada;
