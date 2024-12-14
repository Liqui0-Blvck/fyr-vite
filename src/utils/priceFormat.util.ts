const priceFormat = (price: number, currency: string ): string => {
	return price.toLocaleString('es-ES', {
		style: 'currency',
		currency: currency,
	});
};

export default priceFormat;
