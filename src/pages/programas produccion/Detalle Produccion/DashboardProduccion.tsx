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
import Balance1Partial from './Balance1.partial';
import { OPTIONS, TTabs } from '../../../types/registros types/TabsDashboardPrograma.types';
import DetalleEnvasesLote from '../Detalle Envases Lote/DetalleEnvasesLote';
import DetalleEnvasesMasivosLotes from '../Detalle Masivo Envases Lotes/DetalleEnvasesMasivosLotes';
import DetalleOperarioPrograma from '../Detalle Operarios Programa/DetalleOperarioPrograma';
import DetalleTarjaResultante from '../Detalle Tarja Resultante/DetalleTarjaResultante';
import Balance3Partial from './Balance3.partial';
import Balance2Partial from './Balance2.partial';
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

const DashboardProduccion = () => {
  const { authTokens, validate } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { isDarkTheme } = useDarkMode()
	const { i18n } = useTranslation();

  const [open, setOpen] = useState<boolean>(false)
	const [activeTab, setActiveTab] = useState<TTabs>(OPTIONS.GN);

	const [selectedDate, setSelectedDate] = useState<Range[]>([
		{
			startDate: dayjs().startOf('week').add(-1, 'week').toDate(),
			endDate: dayjs().endOf('week').toDate(),
			key: 'selection',
		},
	]);

  const { data: programa_produccion } = useAuthenticatedFetch<TProduccion>(
    authTokens,
    validate,
    `/api/produccion/${id}/`
  )

  const { data: userData } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${programa_produccion?.registrado_por}/`
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


	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
				<Subheader>
					<SubheaderLeft>
						<PeriodButtonsPartial activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-1 w-full h-10'>
            <Badge color='emerald' variant='solid' className='rounded-lg text-xs font-bold animate-pulse'>
              {programa_produccion?.estado_label}
            </Badge>
            {
              programa_produccion?.estado === '5'
                ? null
                : (
                  <Tooltip text='Añadir Lote al Programa'>
                    <Link to={`/app/produccion/registro-programa/${id}`}>
                      <button
                        type='button' 
                        className=' dark:bg-lime-800 rounded-md flex items-center justify-center w-full h-12 px-3 py-2'>
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
                      width='w-40 rounded-md h-12 bg-blue-700 flex items-center justify-center px-5 py-3 hover:scale-105'
                      >
                        <FormularioRegistroTarja tab={setActiveTab} setOpen={setOpen}/>
                    </ModalRegistro>
                    )
                  : null
              }
            </div>

            
          </SubheaderRight>
				</Subheader>
				<Container>
					<div className='grid grid-cols-12 gap-4'>
						{
              activeTab.text === 'General'
                ? (
                  <>
                    <div className='col-span-12 sm:col-span-4 lg:col-span-4'>
                      <Balance1Partial activeTab={activeTab}  programa={programa_produccion!} envases_programa={envases_programa!}/>
                    </div>
                    <div className='col-span-12 sm:col-span-4 lg:col-span-4'>
                      <Balance2Partial activeTab={activeTab} programa={programa_produccion!} tarjas_resultantes={tarjas_resultantes!}/>
                    </div>
                    <div className='col-span-12 sm:col-span-4 lg:col-span-4'>
                      <Balance3Partial activeTab={activeTab}  programa={programa_produccion!} envases_programa={envases_programa!} tarjas_resultantes={tarjas_resultantes!}/>
                    </div>
                    </>
                  )
                : null
            }

						<div className='col-span-12 2xl:col-span-8'>
							{
                activeTab.text === 'Tarja Resultante'
                ? <DetalleTarjaResultante />
                  : activeTab.text === 'Envases de Lotes Seleccionados'
                    ? <DetalleEnvasesLote />
                    : activeTab.text === 'Procesar Masivamente' && programa_produccion?.lotes.every(lote => lote.bin_procesado !== true)
                      ? <DetalleEnvasesMasivosLotes programa_produccion={programa_produccion!}/>
                      : activeTab.text === 'Operarios en Programa'
                        ? <DetalleOperarioPrograma />
                        : null
              }
						</div>
						{
              activeTab.text === 'General'
                ? (
                  <>
                    <div className='col-span-12 2xl:col-span-4'>
                      {/* <CommentPartial /> */}
                    </div>

                    <div className='col-span-12 2xl:col-span-8'>
                      <Card className='h-full'>
                        {/* <TablePartial /> */}
                        hola
                      </Card>
                    </div>
                    <div className='col-span-12 2xl:col-span-4'>
                      {/* <TimelinePartial /> */}
                    </div>
                  </>
                  )
                : null
            }

					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardProduccion;
