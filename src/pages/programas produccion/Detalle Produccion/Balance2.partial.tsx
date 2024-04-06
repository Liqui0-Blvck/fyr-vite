import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import { FC } from "react";
import { TEnvasesPrograma, TProduccion, TTarjaResultante } from "../../../types/registros types/registros.types";



interface ICardFrutaCalibradaProps {
	programa: TProduccion
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
}

const Balance2Partial: FC<ICardFrutaCalibradaProps>= ({ tarjas_resultantes }) => {
	const total_kilos_pepa = tarjas_resultantes?.reduce((acc, tarja) => tarja.peso + acc, 0)
	const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => tarja.peso + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => tarja.peso + acc, 0)
  const residuo_solido = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => tarja.peso + acc, 0)


	return (
		<Card className="h-full w-full">
			<CardBody className="w-full p-0">
				<div className='flex flex-col gap-2'>
					<div className='w-full h-12 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos totales resultante: {total_kilos_pepa} kgs</span>
					</div>
					<div className='w-full h-12 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilo Fruta Calibrada: {pepa_calibrada} kgs.</span>
					</div>
					<div className='w-full h-12 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos Fruta Borrel: {pepa_borrel} kgs</span>
					</div>
					<div className='w-full h-12 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Kilos Fruta Borrel: {residuo_solido} kgs</span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Balance2Partial;
