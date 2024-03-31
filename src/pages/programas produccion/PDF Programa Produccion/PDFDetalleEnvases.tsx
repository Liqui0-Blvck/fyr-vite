import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../services/url_number';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { TCamion, TConductor, TEnvases, TGuia, TLoteGuia, TPerfil, TProductor } from '../../../types/registros types/registros.types';
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

const PDFDetalleEnvases = () => {
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()

  const { data: guia } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id[0]}`
  )

  const { data: usuario } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${guia?.creado_por}`
  )

  const { data: productor } = useAuthenticatedFetch<TProductor>(
    authTokens,
    validate,
    `/api/productores/${guia?.productor}`
  )

  const { data: envases } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  const { data: camionero } = useAuthenticatedFetch<TConductor>(
    authTokens,
    validate,
    `/api/registros/choferes/${guia?.camionero}`
  )

  const { data: camion } = useAuthenticatedFetch<TCamion>(
    authTokens,
    validate,
    `/api/registros/camiones/${guia?.camion}`
  )

  console.log(envases)
  console.log(guia)
  console.log(usuario)
  console.log(productor)
  console.log(camionero)
  console.log(camion)

  const kilos_brutos_1 = guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {
    return lote.kilos_brutos_1
  })
  const kilos_brutos_2 = guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {
    return lote.kilos_brutos_2
  })
  const kilos_tara_1 = guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {
    return lote.kilos_tara_1
  })
  const kilos_tara_2 = guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {
    return lote.kilos_tara_2
  })

  
  const kilos_fruta = guia?.lotesrecepcionmp.map((row: TLoteGuia) => {
    const kilos_total_envases = 
      row.envases.map((envase_lote) => {
      const envaseTotal = envases?.
      filter(envase => envase.id === envase_lote.envase).
      reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0)
      return envaseTotal;
      })

      return kilos_total_envases[0]
  })
  console.log(kilos_fruta)

  const kilo_fruta_neta_final = (Number(kilos_brutos_1) + Number(kilos_brutos_2)) - (Number(kilos_tara_1) + Number(kilos_tara_2)) - Number(kilos_fruta)
  const kilos_brutos = Number(kilos_brutos_1) + Number(kilos_brutos_2)
  const kilos_tara = Number(kilos_tara_1) + Number(kilos_tara_2) 
  console.log(kilos_tara)
  console.log(kilos_brutos)
  console.log(kilo_fruta_neta_final)
      
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
              En Programa Produccion N° 43
            </Text>


            <View style={{ width: 150, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {}</Text>
                <Text style={styles.header_date_info_text}>{}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>

                <Text style={styles.header_date_info_text}>{usuario?.user.username}</Text>
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
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Programa Produccion: </Text>
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fruta en Programa: </Text>
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

        
            </View>

            <View style={{
              width: '100%',
              padding: 3
            }}>
            
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Productor : </Text>
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Programa Creado el: </Text>
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Variedad Fruta Programa : </Text>
                <Text style={styles.header_date_info_text}>486836 Kgs</Text>
              </View>

            </View>
          </View>
          

          <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Lotes y envases del pedido</Text>

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
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>#</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Lote</Text>
            </View>


            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Tipo Envase</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Envases</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Ubicación Bodega</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Colectado</Text>
            </View>

          </View>

          {
            guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {

              const envase_lote = lote.envases.map((envase: any) => {
                return envases?.find(envase_ => envase_.id === envase.id)
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
          }

        </View> 
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default PDFDetalleEnvases