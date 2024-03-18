let ultimoNumeroLote: number = 0; // Variable para almacenar el último número de lote generado

export function generarNumeroLote(): string {
    const year: number = new Date().getFullYear();
    const numeroLote: string = `${String(ultimoNumeroLote + 1).padStart(2, '0')}-${year}`;
    ultimoNumeroLote++; // Incrementa el último número de lote generado para el siguiente uso
    return numeroLote;
}