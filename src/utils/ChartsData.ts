export function chartData(lista: any) {
  const labels: string[] = [];
  const valores: number[] = [];
  
  if (lista.length === 0) {
    return { labels, valores };
  }
  
  const keys = Object.keys(lista[0]);
  const indexToRemove = keys.indexOf('cc_lote');
  
  if (indexToRemove !== -1) {
    keys.splice(indexToRemove, 1);
  }
  
  lista.forEach((item: any) => {
    keys.forEach(key => {
      if (key !== 'cc_lote') {
        const porcentaje = item[key];
        labels.push(`${key}: ${porcentaje.toFixed(1)}%`);
        valores.push(porcentaje);
      }
    });
  });
  
  return { labels, valores };
}


