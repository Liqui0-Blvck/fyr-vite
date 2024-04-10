import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TControlCalidadB, TEnvasesPrograma, TProduccion, TRendimiento } from "../../../types/registros types/registros.types";
import { FC } from "react";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import Chart, { IChartProps } from "../../../components/Chart";
import { TTabsPro } from "../../../types/registros types/TabsDetalleProyeccion.types";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import TablaInformativa from "./Tabla Informativa/TablaInformativa.tabla";


interface ICardTablaInformativaProps {
  control_calidad: TControlCalidadB[]
	activeTab: TTabsPro
}

const CardTablaInformativa: FC<ICardTablaInformativaProps> = ({ control_calidad }) => {

	return (
		<Card className="w-full h-full">
			<CardBody className="w-full h-full">
        <TablaInformativa data={control_calidad || []}/>
			</CardBody>
		</Card>
	);
};

export default CardTablaInformativa;
