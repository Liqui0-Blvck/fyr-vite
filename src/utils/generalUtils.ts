export const cargolabels = (perfilData: any) => {
  if (!perfilData) {
    return [];
  }

  const cargoLabels = perfilData.cargos.map((cargo: any) => cargo.cargo_label) || [];
  // Agrega más campos aquí según sea necesario

  return cargoLabels;
};
