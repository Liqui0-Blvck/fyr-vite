import { TPeriod } from "../../../constants/periods.constant";
import Card, { CardBody } from "../../../components/ui/Card";
import Icon from "../../../components/icon/Icon";
import Balance from "../../../components/Balance";
import { TEnvasesPrograma, TProduccion, TRendimiento } from "../../../types/registros types/registros.types";
import { FC } from "react";
import { TTabs } from "../../../types/registros types/TabsDashboardPrograma.types";
import Chart, { IChartProps } from "../../../components/Chart";
import { TTabsPro } from "../../../types/registros types/TabsDetalleProyeccion.types";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";


interface ICardFrutaCalibradaProps {
  rendimiento: TRendimiento
	activeTab: TTabsPro
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ rendimiento }) => {
  const labels: string[] = Object.keys(rendimiento ? rendimiento?.cc_promedio_porcentaje_muestras!: {})
  const valores: number[] = Object.values(rendimiento ? rendimiento?.cc_promedio_porcentaje_muestras!: {})



	return (
		<Card className="w-full h-full">
			<CardBody className="w-full h-full">
        <div className='flex flex-row-reverse'>
          <div className='flex flex-col md:flex-col w-full h-full '>
            <div className={`w-full h-[480px] border dark:border-zinc-700 px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
              <div className='lg:w-full h-hull'>
                <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                <PieChart series={valores! || []} labels={labels! || []}/>
              </div>
              <div className='w-full flex flex-col justify-center mt-4 lg:mt-0'> 
                <h1 className='text-2xl text-center mb-5'>Detalle CC Pepa Calibrada</h1>
                <div className='grid grid-cols-4 gap-x-5 gap-y-2'>
                  <div className='md:col-span-2'>
                    <Label htmlFor='' className='text-center'>Basura</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.basura! * rendimiento?.cc_calculo_final?.kilos_netos! / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras.basura}%</span>
                    </div>
                  </div>
                  <div className='md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Cascara</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.cascara * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras.cascara}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Ciega</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'> 
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.ciega * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras.ciega}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Pelon</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pelon * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras.pelon}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Huerto</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pepa_huerto * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras.pepa_huerto}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Vana Deshidratada</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pepa_bruta * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_muestras?.pepa_bruta!}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaCalibrada;
