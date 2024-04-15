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
import PeriodButtonsPartial from './PeriodButtons.partial';
import Balance1Partial from './CardFrutaIngresa.chart';
import { OPTIONS, TTabs } from '../../../types/registros types/TabsDashboardPrograma.types';
import DetalleEnvasesLote from '../Detalle Envases Lote/DetalleEnvasesLote';
import DetalleEnvasesMasivosLotes from '../Detalle Masivo Envases Lotes/DetalleEnvasesMasivosLotes';
import DetalleOperarioPrograma from '../Detalle Operarios Programa/DetalleOperarioPrograma';
import DetalleTarjaResultante from '../Detalle Tarja Resultante/DetalleTarjaResultante';
import Balance3Partial from './CardFrutaProcesadaUltimaHora';
import Balance2Partial from './CardFrutaCalibrada.chart';
import { useAuth } from '../../../context/authContext';
import { Link, useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../services/url_number';
import useDarkMode from '../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { TEnvasesPrograma, TPerfil, TProduccion, TTarjaResultante } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroTarja from '../Formularios Produccion/Formulario Registro Tarja/FormularioRegistroTarja';
import Badge from '../../../components/ui/Badge';
import Tooltip from '../../../components/ui/Tooltip';
import CardFrutaIngresada from './CardFrutaIngresa.chart';
import CardFrutaCalibrada from './CardFrutaCalibrada.chart';

const DashboardProduccion = () => {
  const { authTokens, validate } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const [open, setOpen] = useState<boolean>(false)
	const [activeTab, setActiveTab] = useState<TTabs>(OPTIONS.GN);

  const { data: programa_produccion, setRefresh, loading  } = useAuthenticatedFetch<TProduccion>(
    authTokens,
    validate,
    `/api/produccion/${id}/`
  )

  const { data: envases_programa } = useAuthenticatedFetch<TEnvasesPrograma[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/lotes_en_programa`
  )

  const { data: tarjas_resultantes } = useAuthenticatedFetch<TTarjaResultante[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/tarjas_resultantes/`
  )

  useEffect(() => {
    if (activeTab.text === 'General'){
      setRefresh(true)
    }
  }, [activeTab])

  console.log("soy una tarja resultante", tarjas_resultantes)

	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
				<Subheader>
					<SubheaderLeft>
						<PeriodButtonsPartial activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-2 w-full h-10'>
            <Badge color='emerald' variant='solid' className='rounded-lg text-xs font-bold animate-pulse'>
              {programa_produccion?.estado_label}
            </Badge>
            {
              programa_produccion?.estado === '5' || programa_produccion?.estado === '3'
                ? null
                : (
                  <Tooltip text='Añadir Lote al Programa'>
                    <Link to={`/app/produccion/registro-programa/${id}`}>
                      <button
                        type='button' 
                        className=' dark:bg-zinc-700 bg-zinc-700 rounded-md flex items-center justify-center w-full h-12 px-5  py-2 text-white hover:scale-105'>
                        <span>Añadir Lote al Programa N°{id}</span>
                      </button>
                    </Link>
                  </Tooltip>
                  )
            }
              
              {
                programa_produccion?.estado === '2'
                  ? (
                    <ModalRegistro
                      title='Registro Tarja'
                      open={open}
                      setOpen={setOpen}
                      textButton={`Registro Tarja`}
                      width='w-auto rounded-md h-12 bg-blue-700 flex items-center justify-center px-5 py-3 hover:scale-105 text-white'
                      >
                        <FormularioRegistroTarja tab={setActiveTab} setOpen={setOpen} refresh={setRefresh}/>
                    </ModalRegistro>
                    )
                  : null
              }
            </div>

            
          </SubheaderRight>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full'>
					<div className='grid grid-cols-12 gap-2'>

            <div className='col-span-12 2xl:col-span-12 gap-2'>
            {
              activeTab.text === 'General'
                ? (
                  <>
                    <div className='col-span-12 '>
                      <CardFrutaIngresada activeTab={activeTab}  programa={programa_produccion!} tarjas_resultantes={tarjas_resultantes!} envases_programa={envases_programa!} refresh={setRefresh}/>
                    </div>
                    <div className='row-start-2 col-span-12 mt-2'>
                      <CardFrutaCalibrada activeTab={activeTab} programa={programa_produccion!} tarjas_resultantes={tarjas_resultantes!} refresh={setRefresh}/>
                    </div>
                  </>
                  )
                : null
            }
            </div>
						

						<div className='col-span-12 2xl:col-span-12'>
							{
                activeTab.text === 'Tarja Resultante'
                ? <DetalleTarjaResultante produccion={programa_produccion} refresh={setRefresh}/>
                  : activeTab.text === 'Envases de Lotes Seleccionados'
                    ? <DetalleEnvasesLote />
                    : activeTab.text === 'Procesar Masivamente'
                      ? <DetalleEnvasesMasivosLotes programa_produccion={programa_produccion!} refresh={setRefresh}/>
                      : activeTab.text === 'Operarios en Programa'
                        ? <DetalleOperarioPrograma programa_produccion={programa_produccion!} loading={loading} refresh={setRefresh}/>
                        : null
              }
						</div>
		
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardProduccion;
