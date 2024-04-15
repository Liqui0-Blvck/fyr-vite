import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../services/url_number';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { TCamion, TConductor, TEnvases, TEnvasesPrograma, TGuia, TLoteGuia, TPatioTechadoEx, TPerfil, TProduccion, TProductor } from '../../../types/registros types/registros.types';
import { TProduct } from '../../../mocks/db/products.db';
import { variedadFilter } from '../../../constants/options.constants';


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
    padding: 20,
    gap: 2

  },
  header_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  header_inferior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    border: '1px solid green',
    borderRadius: 5,
    height: 60

  },
  header_logo_box: {
    width: 100,
    height: 80,
  },
  header_info_box_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12,
  },
  header_info_inferior: {
    width: '100%',
    height: 55,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10
  },
  input_style: {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    padding: '0 3px'
  },
  label: {
    fontWeight: 'bold',
    width: '100px',
    fontSize: '12px'
  },
  input_text: {
    borderRadius: '2px',
    border: '1px solid #E3E7EA',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    height: '25px',
    width: '70%',
    fontWeight: 'semibold',
    fontSize: 12,
    padding: '0 5px',
    overflow: 'hidden'
  },
  logo: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  footer_box: {
    marginTop: '100px',
    border: '0.5px solid #E3E7EA',
    borderRadius: 2,
    height: '100%',
    width: '100%'
  },
  footer_header: {
    height: '30px',
    width: '100%',
    border: '0.5px solid #E3E7EA',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3px 5px'
  },
  items_box: {
    width: '100%',
    border: '0.5px solid #E3E7EA',
    height: '40px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_box_signatures: {
    height: '100px',
    width: '100%',
    position: 'absolute',
    bottom: 10,
    right: 0,
    left: 10,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'space-between'
  },
  signature_box: {
    border: '1px solid #E3E7EA',
    borderRadius: 5,
    width: '300px',
    padding: '2px 5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signature_pic: {
    width: '60%',
    height: '100%',
    objectFit: 'contain',
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
})

const PDFDocumentoEntrada = () => {
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV

  const { data: programa } = useAuthenticatedFetch<TProduccion>(
    authTokens,
    validate,
    `/api/produccion/${id}`
  )

  const { data: lotes_en_programa} = useAuthenticatedFetch<TEnvasesPrograma[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/lotes_en_programa/`
  )

  const { data: guia } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${lotes_en_programa?.[0].guia_recepcion}/`
  )

  const { data: guia_interna } = useAuthenticatedFetch<TPatioTechadoEx>(
    authTokens,
    validate,
    `/api/patio-exterior/${lotes_en_programa?.[0].guia_patio}/`
  )

  const total_fruta_programa = lotes_en_programa?.reduce((acc, lote) => lote.kilos_fruta + acc, 0)
      
  return (
    <PDFViewer style={{ height: '100%'}}>
      <Document>
        <Page>
        <View style={styles.header}>
        <View style={styles.header_superior}>
            <View style={{ position: 'relative', top: -9 }}>
              <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
            </View>

            <Text style={{ width: 240, textAlign: 'center', fontSize: 14, position: 'relative', left: 10, top: 10}}>
              Lista de Lotes y Envases a Procesar
              En Programa Produccion N° {programa?.id}
            </Text>


            <View style={{ width: 150, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {format(new Date(), { date: 'medium', time: 'short'}, 'es')}</Text>
                <Text style={styles.header_date_info_text}>{}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>

                <Text style={styles.header_date_info_text}>{perfilData.user.username}</Text>
              </View>
            </View>
          </View>

          <View style={{
            width: '100%',
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'row'
          }}>
            <View style={{
              width: '100%',
              padding: 3
            }}>
            
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Comercializador: </Text>
                <Text style={styles.header_date_info_text}>{guia?.nombre_comercializador} </Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Total Kilos en programa: </Text>
                <Text style={styles.header_date_info_text}>{total_fruta_programa}</Text>
              </View> 

        
            </View>

            <View style={{
              width: '100%',
              padding: 3
            }}>
            
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Productor : </Text>
                <Text style={styles.header_date_info_text}>{guia?.nombre_productor} Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fecha de Inicio Programa Produccion: </Text>
                <Text style={styles.header_date_info_text}>{format(programa?.fecha_creacion!, { date: 'short', time: 'short'}, 'es')}</Text>
              </View>

            </View>
          </View>
          

          <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Detalle Lotes en Programa</Text>

          <View style={{ 
            width: '100%',
            height: 26,
            backgroundColor: 'lightgray',
            borderRadius: '1px', 
            display: 'flex',
            flexDirection: 'row',
            fontWeight: 'bold',
            paddingBottom: 2
            }}>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Lote</Text>
            </View>


            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Envases del Lote</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Productor</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Variedad</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos Fruta</Text>
            </View>

          </View>

          {
            lotes_en_programa?.map((lote: TEnvasesPrograma) => {
              console.log(lote)
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  }}>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{lote.numero_lote}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{lotes_en_programa  ?.length}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{guia?.nombre_productor}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{variedadFilter.find(variety => variety.value === lote.variedad)?.label}</Text>
                  </View>
      
                  
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{guia_interna?.ubicacion_label}</Text>
                  </View>
                </View>
              )
            })
          }

          {/* {
            guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {

              const envase_lote = lote.envases.map((envase: any) => {
                // return envases?.find(envase_ => envase_.id === envase.id)
              })

              const cantidad = lote.envases.map((lote) => {
                return lote.cantidad_envases
              })

              const variedad = lote.envases.map((lote) => {
                return lote.variedad
              })

              const variedad_lote = variedadFilter.find(variety => variety.value === String(variedad))?.label
            

              const kilo_fruta_neto = (lote.kilos_brutos_1 + lote.kilos_brutos_2) - (lote.kilos_tara_1) + lote.kilos_tara_2

              
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  }}>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{lote.numero_lote}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{envase_lote.map((envase) => envase?.nombre)}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{cantidad}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{envase_lote.map(envase => envase?.peso)} kgs</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{kilo_fruta_neta_final} kgs</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{variedad_lote}</Text>
                  </View>
                </View>
              )
            })
          } */}

        </View> 
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default PDFDocumentoEntrada