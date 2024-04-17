import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { useAuth } from '../../../context/authContext';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../services/url_number';
import {TControlCalidadB, TGuia, TPerfil, TRendimiento } from '../../../types/registros types/registros.types';
import { format } from '@formkit/tempo';
import { variedadFilter } from '../../../constants/options.constants';
import { useEffect, useRef, useState } from 'react';
import PieChart from '../../../components/charts/PDFPieChart';
import ChartJsImage from 'chartjs-to-image';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,

  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20

  },
  header_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  header_inferior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  header_logo_box: {
    width: 30,
    height: 30,
  },
    header_info_box_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12
  },
  header_info_inferior: {
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 2,
    border: '1px solid green',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 5
  },
  header_date_info_box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  header_date_info: {
    width: 190,
    height: '100%',
    border: '1px solid green',
    borderRadius: 5,
    padding: 5
  },
  header_date_info_text: {
    fontSize: 10,
    textAlign: 'center'
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 5,
    gap: 2
  },
  body_cc_ren_and_calibre: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,

  },
  body_table: {
    width: '100%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    borderRadius: 5
  },
  body_table_header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    borderBottom: '1px solid green',
    padding: 1
  },
  body_table_info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body_table_info_text: {
    fontSize: 10,
    borderRight: '1px solid green',
    paddingRight: '3px',
    textAlign: 'center'
  },
  body_table_rows: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    
  },
  boxes_table_row: {
    margin: 'auto',
    width: '100%'
  }
})

const CCRendimiento = () => {
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rendimientos, setRendimientos] = useState<TRendimiento | null>(null)
  const base_url = process.env.VITE_BASE_URL_DEV

  let valores: any
  let labels: any
  let formattedData: any

  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id}`
  )

  const { data: usuario } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${control_calidad?.cc_registrado_por}`
  )

  const { data: guia } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${control_calidad?.guia_recepcion}`
  )


  const rendimiento_cc = rendimientos?.cc_muestra[0] ? rendimientos.cc_muestra[0] : [];
  const labels_pre = Object.keys(rendimiento_cc || {});
  valores = Object.values(rendimiento_cc || {});

  const entry = Object.entries(rendimiento_cc) 
  const filteredEntry = entry.filter(([key]) => key !== 'cc_lote')
  console.log(filteredEntry)
  formattedData = filteredEntry.map(([key, value]) => ({
    label: key,
    data: [value]
  }));
    const total = valores.reduce((acc: number, curr: number) => acc + curr, 0);

  labels = labels_pre.map((label, index) => {
    if (label !== 'cc_lote') {
      const porcentaje = (valores[index] / total) * 100;
      return `${label}: ${porcentaje.toFixed(1)}%`;
    }
    return null; // Ignorar 'cc_lote' devolviendo null
  }).filter(label => label !== null);
  

  useEffect(() => {
    const getRendimientos = async () => {
      const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/rendimiento_lotes/${control_calidad?.recepcionmp}/`, {
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


  

  console.log(formattedData)

  useEffect(() => {
    if (!formattedData) {
        return; // No hagas nada si formattedData es undefined
    }

    const myChart = new ChartJsImage();
    myChart.setConfig({
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: formattedData.map((item: any) => item.data[0]),
                backgroundColor: ['#49c6c4', '#49c65a', '#3b82f6', '#F43F5E', '#D885FF', '#49c65a'],
                borderColor: "white",
                size: 20
            }],
        },
        options: {
          legend: {
             display: true },         
             tooltips: { enabled: true }
      }
    }).setHeight(400).setWidth(600);

    setImageSrc(myChart.getUrl());

    return () => {}
  }, [formattedData]);  

  
  return (
    <PDFViewer style={{ height: '100%'}}>
      <Document>
        <Page style={styles.page} size='A4'>
          // Top Superior
          <View style={styles.header}>
            <View style={styles.header_superior}>
              <View style={{ position: 'relative', top: -15 }}>
                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
                <Text style={{ fontSize: 5, width: 100}}>Actividades de Apoyo a la agrícultura
                      Dirección: Fundo Challay Alto Lote A-1, Paine
                      Teléfonos: +56 2 228215583 - +56 2 2282 25584</Text>
              </View>

              <View style={{ width: 190, border: '1px solid green', height: 40, padding: 5, borderRadius: 5, position: 'relative', top: 30 }}>
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Fecha Recepción: </Text>
                  <Text style={styles.header_date_info_text}>{format(guia?.fecha_creacion!, { date: 'short'}, 'es')}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Hora Recepción: </Text>
                  <Text style={styles.header_date_info_text}>{format(guia?.fecha_creacion!, { time: 'short'}, 'es')}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Registrado Por: </Text>

                  <Text style={styles.header_date_info_text}>{usuario?.user.username}</Text>
                </View>
              </View>
            </View>

            // Top Inferior 

            <Text style={{ textAlign: 'center', fontSize: 14, position: 'relative', top: -20}}>Informe Control De Calidad Materia Prima</Text>

            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              position: 'relative',
              top: -20
            }}>

              <View style={styles.header_info_box_superior}>
                <Text style={{ fontSize: 10 }}>Datos Guia Recepcion Materia Prima </Text>
                <View style={styles.header_info_inferior}>
                
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>N° Lote: </Text>
                    <Text style={styles.header_date_info_text}>{control_calidad?.numero_lote}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Variedad: </Text>

                    {/* <Text style={styles.header_date_info_text}>{variedad}</Text> */}
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Productor: </Text>

                    <Text style={styles.header_date_info_text}>{guia?.nombre_productor}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Comercializador: </Text>

                    <Text style={styles.header_date_info_text}>{guia?.comercializador}</Text>
                  </View>
                  
                </View>
              </View>

              <View style={styles.header_info_box_superior}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Datos Inspección Control De Calidad</Text>
                <View style={styles.header_info_inferior}>
                
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Kilos Totales: </Text>
                    <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_netos} kgs</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Humedad: </Text>

                    <Text style={styles.header_date_info_text}>{control_calidad?.humedad} %</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Presencia de insectos:</Text>

                    <Text style={styles.header_date_info_text}>{control_calidad?.presencia_insectos ? 'Con presencia de insectos' : 'Sin presencia de insectos'}</Text>
                  </View>
                  
                </View>
              </View>

            </View>

            <Text style={{ 
              fontSize: 14,
              marginTop: 10,
              textAlign: 'center',
              position: 'relative',
              top: -20
             }}>Observaciones</Text>
              <View style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 40,
                border: '1px solid green',
                borderRadius: 5,
                position: 'relative',
                top: -20,
                padding: 5
            }}>
                <Text style={{ fontSize: 10 }}>
                  {control_calidad?.observaciones}
                </Text>
              </View>
          </View>

          // Body

          <View style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            padding: 20,
            gap: 2,
            position: 'relative',
            top: -30
          }}>
            <View style={styles.header_inferior}>
              <View style={{
                width: '100%',
                position: 'relative',
                top: -20
              }}>
                  <Text style={{ fontSize: 10}}>Control Rendimiento</Text>
                  <View style={{width: '100%', height: 170, padding: 20}} >
                    <Image source={`${imageSrc}`} style={{ height: 150 }}/>
              
                  </View>
                </View>
                <View style={styles.header_info_box_superior}>
                  <Text style={{ fontSize: 12, textAlign: 'center'}}>Calibres</Text>
                  <View style={{width: '100%', height: 150}}>
                    <View style={styles.body_table}>
                      
                      // 1
                      <View style={styles.body_table_header}>
                         <View style={{ width: '100%'}}>
                          <Text style={styles.header_date_info_text}>MM</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>U/oz</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>Kilos</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>%</Text>
                          </View>
                      </View>

                      // 2
                      <View style={styles.body_table_info}>
                        // 1
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>16</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>18/20</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_18_20! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_18_20}%</Text> 
                          </View>
                        </View>

                        // 2

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>15</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>20/22</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_20_22! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_20_22}%</Text> 
                          </View>
                        </View>

                        // 3
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>14</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>23/25</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_23_25! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_23_25}%</Text> 
                          </View>
                        </View>

                        // 4
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>13</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>25/27</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_25_27! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_25_27}%</Text> 
                          </View>
                        </View>

                        // 5
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>12</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>27/30</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_27_30! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_27_30}%</Text> 
                          </View>
                        </View>

                        // 6
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>10</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>30/32</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_30_32! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_30_32}%</Text> 
                          </View>
                        </View>
                        
                        // 7
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>10</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>32/34</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_32_34! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_32_34}%</Text> 
                          </View>
                        </View>

                        // 8
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>-10</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>34/36</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_34_36! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_34_36}%</Text> 
                          </View>
                        </View>

                        // 9
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>-10</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>36/40</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_36_40! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_36_40}%</Text> 
                          </View>
                        </View>

                        // 10
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ width: '100%', borderRight: '1px solid green', color: 'white', fontSize: 10}}>a</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>40/+</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_40_mas! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].calibre_40_mas}%</Text> 
                          </View>
                        </View>

                        // 10
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ width: '100%', borderRight: '1px solid green', color: 'white', fontSize: 10}}>a</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>Pre calibre</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].precalibre! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 10}}>{rendimientos?.cc_pepa_calibre[0].precalibre}%</Text> 
                          </View>
                        </View>

                
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.header_inferior}>
                <View style={{
                  width: '100%',
                  position: 'relative',
                  top: -30
                }}>
                  <Text style={{ fontSize: 12, textAlign: 'center' }}>CAT 2</Text>
                  <View style={{width: '100%', height: 100}}>
                    <View style={styles.body_table}>
                      
                      // 1
                      <View style={styles.body_table_header}>
                         <View style={{ width: '100%'}}>
                          <Text style={styles.header_date_info_text}>CAT 2</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>%</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>% Permitido</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.header_date_info_text}>Kilos Desc.</Text>
                          </View>
                      </View>

                      // 2
                      <View style={styles.body_table_info}>
                        // 1
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 6, borderRight: '1px solid green', padding: 7}}>Mezcla Variedades</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].mezcla}%</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>5 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, textAlign: 'center', fontSize: 6}}>{rendimientos?.cc_descuentos[0].mezcla}%</Text> 
                          </View>
                        </View>

                        // 2

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Fuera Color</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].color}%</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>5 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 9}}>{rendimientos?.cc_descuentos[0].color}%</Text> 
                          </View>
                        </View>

                        // 4
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Dobles</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].dobles}%</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>10 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ textAlign: 'center', fontSize: 9}}>{rendimientos?.cc_descuentos[0].dobles}%</Text> 
                          </View>
                        </View>

                        // 5
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid green'}}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ padding: 4, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Total CAT2</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}></Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={styles.body_table_info_text}></Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].cat2} %</Text> 
                          </View>
                        </View>

   
                      </View>
                  </View>
                </View>


                  <Text style={{ fontSize: 12, textAlign: 'center' }}>Desechos</Text>
                    <View style={{width: '100%', height: 170}}>
                  
                    <View style={styles.body_table}>
                      
                      <View style={styles.body_table_header}>
                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 6, textAlign: 'center', padding: 7}}>Desechos</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 6, textAlign: 'center', padding: 7}}>%</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 6, textAlign: 'center', padding: 7}}>% Permitido</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 6, textAlign: 'center', padding: 7}}>Kilos des</Text> 
                          </View>
                        </View>
                      </View>
                      <View style={styles.body_table_info}>
                        <View style={styles.body_table_rows}>
                          <View style={{ width: '350px'}}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Daño insecto</Text> 
                          </View>
                          <View style={{ width: '350px'}}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].insecto} %</Text> 
                          </View>
                          <View style={{ width: '350px'}}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>1.5 %</Text> 
                          </View>
                          <View style={{ width: '350px'}}>
                            <Text style={{ padding: 7, fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].insecto} Kgs</Text> 
                          </View>
                        </View>

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Presencia de Hongo</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].hongo} %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>1.5 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].hongo} Kgs</Text> 
                          </View>
                        </View>

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, paddingHorizontal: 1, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Vana Deshidratada</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].vana} %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>1 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].vana} Kgs</Text> 
                          </View>
                        </View>

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, paddingHorizontal: 1, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Punto de Goma</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].pgoma} %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>0.5 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].pgoma} Kgs</Text> 
                          </View>
                        </View>

                        <View style={styles.body_table_rows}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, paddingHorizontal: 1, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Goma</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>{rendimientos?.cc_pepa[0].goma} %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>0.5 %</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 8, fontSize: 6, textAlign: 'center'}}>{rendimientos?.cc_descuentos[0].goma} Kgs</Text> 
                          </View>
                        </View>

                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid green'}}>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 7, paddingHorizontal: 1, fontSize: 6, textAlign: 'center', borderRight: '1px solid green'}}>Total Desechos</Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 7, fontSize: 6, textAlign: 'center'}}></Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 7, fontSize: 6, textAlign: 'center'}}></Text> 
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 7, fontSize: 6, textAlign: 'center'}}>{(rendimientos?.cc_descuentos[0].desechos)?.toFixed(1)} Kgs</Text> 
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>


                <View style={{
                  width: '100%',
                  height: `${control_calidad?.estado_aprobacion_cc === 1 ? 320 : 160}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'space-between',
                }}>
                  <Text style={{ fontSize: 14, textAlign: 'center' }}>Resumen</Text>
                  <View style={{width: '100%', height: 80, border: '1px solid green', borderRadius: 4, padding: '10px'}}>
                  
                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Kilos Totales Recepcionados: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                          <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_netos} kgs</Text>
                      </View>
                    </View>

                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Kilos Pepa Bruta: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_brutos} kgs</Text>
                      </View>
                    </View>

                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Porcentaje Pepa Bruta: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.por_brutos} %</Text>
                      </View>
                    </View>


                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Kilos Pepa Exportable: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{(rendimientos?.cc_kilos_des_merma[0].exportable)?.toFixed(1)} kgs</Text>
                      </View>
                      
                    </View>

                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Porcentaje Pepa Exportable: </Text>
                      </View>
                      
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{(rendimientos?.cc_kilos_des_merma[0].exportable! / rendimientos?.cc_calculo_final.kilos_netos! * 100).toFixed(2)} %</Text>
                      </View>
                    </View>                    
                  
                  </View>

                  <View style={{
                    width: '100%',
                    height: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    border: '1px solid green',
                    borderRadius: 5,
                    padding: 5,
                    paddingLeft: 10,
                    marginBottom: 20,
                  }}>
                  
                    <View style={{
                      width: '100%',
                      height: 'auto',
                      display: 'flex',
                      flexDirection: 'column',  
                      borderRadius: 2
                    }}>
                      <View style={{
                         width: '100%',
                         display: 'flex',
                         flexDirection: 'row',
                         justifyContent:'space-between',
                         padding: 1,
                         marginBottom: 3
                      }}>
                        <Text style={{ fontSize: 9 }}></Text>
                        <Text style={{ fontSize: 9 }}></Text>
                        <Text style={{ fontSize: 9 }}>Merma</Text>
                        <Text style={{ fontSize: 9, position: 'relative', left: -20 }}>Final</Text>
                      </View>

                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 20
                      }}>
                        <View style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                          <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                            <Text style={{ fontSize: 9}}>Almendras Exportables</Text>
                          </View>

                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40}}>
                            <Text style={{ fontSize: 9}}>{rendimientos?.cc_calculo_final.merma_exp} kgs</Text>
                          </View>

                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35}}>
                            <Text style={{ fontSize: 9}}>{rendimientos?.cc_calculo_final.final_exp} kgs</Text>
                          </View>
                          
                        </View>
                      </View>
                      
                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 20
                      }}>
                        <View style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                          <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                            <Text style={{ fontSize: 9, textAlign: 'center'}}>CAT 2</Text>
                          </View>
                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40 }}>
                            <Text style={{ fontSize: 9}}>{rendimientos?.cc_calculo_final.merma_cat2}</Text>
                          </View>

                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                            <Text style={{ fontSize: 9}}>{rendimientos?.cc_calculo_final.final_cat2}</Text>
                          </View>
                          
                        </View>
                      </View>

                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 20
                      }}>
                        <View style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                          <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5}}>
                            <Text style={{ fontSize: 9}}>Desechos</Text>
                          </View>
                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40 }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold'}}>{rendimientos?.cc_calculo_final.merma_des} kgs</Text>
                          </View>
                          
                          <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                            <Text style={{ fontSize: 9}}>{rendimientos?.cc_calculo_final.final_des} kgs</Text>
                          </View>
                          
                        </View>
                      </View>                      
                    </View>
                  </View>

                  {
                    control_calidad?.estado_aprobacion_cc === '1'
                        ? (
                          <View style={{ width: '100%', display: 'flex', height: 100, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, position: 'relative', top: 20 }}>
                            <Image source='/src/assets/firma_donandres.png' style={{ width: 100, height: 50}}/>
                            <Text style={{ 
                              borderBottom: '1px solid green',
                              height: 15,
                              width: '100%',
                              fontSize: 10,
                              textAlign: 'center'
                            }}>
                              CC Aprobado por Andres Hasbun
                            </Text>
                            <Text style={{ fontSize: 9 }}>Gerente de Operaciones</Text>
                          </View>
                          )
                        : null
                  
                  }



                </View>
              </View>

              
          </View>
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default CCRendimiento