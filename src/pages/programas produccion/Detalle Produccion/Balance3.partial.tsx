import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import { TEnvasesPrograma, TProduccion, TTarjaResultante } from "../../../types/registros types/registros.types";
import { FC } from "react";
import { tipoFrutaFilter } from "../../../constants/options.constants";

interface ICardFrutaCalibradaProps {
	programa: TProduccion
	envases_programa?: TEnvasesPrograma[]
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
}

const Balance3Partial: FC<ICardFrutaCalibradaProps> = ({envases_programa, programa, tarjas_resultantes }) => {
	const now = new Date()

	const kilos_totales_procesados = envases_programa?.
		filter(envase => envase?.bin_procesado === true && envase.fecha_modificacion).
		filter(envase => {
			const diffTime = now.getTime() - new Date(envase.fecha_modificacion).getTime();
			const diffHours = diffTime / (1000 * 3600);
			return diffHours <= 1;
		}).
		reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1);


		const pepa_calibrada = tarjas_resultantes?.filter(tarja => {
				const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime();
				const diffHours = diffTime / (1000 * 3600);
				return diffHours <= 1;
		}).reduce((acc, tarja) => tarja.peso + acc, 0).toFixed(1)


	return (
		<Card className="dark:bg-zinc-800 h-full">
			<CardBody className="w-full">
			<div className='flex flex-col gap-2 '>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Fruta procesada en ultima hora: {kilos_totales_procesados} kgs</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Fruta calibrada en ultima hora: {pepa_calibrada} kgs.</span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Balance3Partial;
