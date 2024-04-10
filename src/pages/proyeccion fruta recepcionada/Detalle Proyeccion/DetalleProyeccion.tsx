import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DateRangePicker, Range } from 'react-date-range';
import colors from 'tailwindcss/colors';
import Container from '../../../components/layouts/Container/Container';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import Header, { HeaderLeft, HeaderRight } from '../../../components/layouts/Header/Header';
import DefaultHeaderRightCommon from '../../../templates/layouts/Headers/_common/DefaultHeaderRight.common';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown';
import Button from '../../../components/ui/Button';
import themeConfig from '../../../config/theme.config';
import Breadcrumb from '../../../components/layouts/Breadcrumb/Breadcrumb';
import Card from '../../../components/ui/Card';
import { OPTIONS, TTabs } from '../../../types/registros types/TabsDashboardPrograma.types';
import { useAuth } from '../../../context/authContext';
import { Link, useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../services/url_number';
import useDarkMode from '../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { TControlCalidadB, TEnvasesPrograma, TPerfil, TProduccion, TRendimiento, TTarjaResultante } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import Badge from '../../../components/ui/Badge';
import Tooltip from '../../../components/ui/Tooltip';
import CardFrutaCalibrada from './Calibres.chart';
import CardPepaControl from './ControlPepa.chart';
import CardMuestraControl from './MuestraControl.chart';
import ButtonsTabsProyeccion from './ButtonsTabs';
import { OPTIONSPRO, TTabsPro } from '../../../types/registros types/TabsDetalleProyeccion.types';
import { chartData } from '../../../utils/ChartsData';
import CardTablaInformativa from './TablaInformativa.card';

const DetalleProyeccion = () => {
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [rendimientos, setRendimientos] = useState<TRendimiento>()

  const [open, setOpen] = useState<boolean>(false)
	const [activeTab, setActiveTab] = useState<TTabsPro>(OPTIONSPRO.MC);

	const [selectedDate, setSelectedDate] = useState<Range[]>([
		{
			startDate: dayjs().startOf('week').add(-1, 'week').toDate(),
			endDate: dayjs().endOf('week').toDate(),
			key: 'selection',
		},
	]);

  const { data: control_calidad, loading, setRefresh } = useAuthenticatedFetch<TControlCalidadB[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/`
  )

  const lista_controles = control_calidad?.map(lote => lote.recepcionmp)
  const controles_calidad = lista_controles ? lista_controles.join(",") : "";

  useEffect(() => {
    const getRendimientos = async () => {
      const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/rendimiento_lotes/${controles_calidad}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        }
      })
  
      if (res.ok){
        setRendimientos(await res.json())
      } else {
        console.log("Tuve problemas")
      }
    }
  
    getRendimientos()
  }, [control_calidad])




	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
				<Subheader>
					<SubheaderLeft>
						<ButtonsTabsProyeccion activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-2'>
              <div className='bg-blue-800 px-3 rounded-3xl flex flex-col items-center'>
                <span className='text-lg font-semibold text-white'>{rendimientos?.cc_calculo_final.kilos_netos} kgs</span>
                <label htmlFor="" className='font-semibold text-white'>Total Kilos Neto Recepcionados</label>
              </div>

              <div className='bg-blue-800 px-3 rounded-3xl flex flex-col items-center'>
                <span className='text-lg font-semibold text-white'>{rendimientos?.cc_calculo_final.kilos_brutos} kgs</span>
                <label htmlFor="" className='font-semibold text-white'>Total Kilos Pepa Bruta</label>
              </div>

              <div className='bg-blue-800 px-3 rounded-3xl flex flex-col items-center'>
                <span className='text-lg font-semibold text-white'>{rendimientos?.cc_calculo_final.final_exp} kgs</span>
                <label htmlFor="" className='font-semibold text-white'>Total Kilos Pepa Exportable</label>
              </div>

            </div>
          </SubheaderRight>
				</Subheader>
				<Container>
					<div className='grid grid-cols-12 gap-4'>
						<div className='col-span-12 2xl:col-span-8 h-[500px]'>
              {
                activeTab.text === 'Muestra Control'
                ? <CardMuestraControl activeTab={activeTab} rendimiento={rendimientos!} />
                  : activeTab.text === 'Control Pepa'
                    ? <CardPepaControl activeTab={activeTab} rendimiento={rendimientos!}/>
                    : activeTab.text === 'Calibres Pepa'
                      ? <CardFrutaCalibrada activeTab={activeTab} rendimiento={rendimientos!}/>
                      : activeTab.text === 'Tabla Informativa'
                        ? <CardTablaInformativa activeTab={activeTab} control_calidad={control_calidad || []} />
                        : null
              }
						</div>
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DetalleProyeccion;
