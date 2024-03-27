import React, { FC } from 'react';
import { IChartOptions } from '../../interface/chart.interface';
import Chart from '../Chart';

interface IPieProps {
	series: number[] 
	labels: string[]
}

const PieChart: FC<IPieProps> = ({ series, labels }) => {
	const options: IChartOptions = {
		series,
		options: {
			chart: {
				id: 'pie_chart',
				height: 220,
				type: 'pie',
				toolbar: {
					show: false,
				},
			},
			labels,
			dataLabels: {
				// enabled: true,
			},
			stroke: {
				curve: 'monotoneCubic',
			},
			markers: {
				size: 0,
			},
			xaxis: {
				categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				title: {
					text: 'Days',
				},
			},
			yaxis: {
				title: {
					text: 'Views',
				},
			},
		},
	};

	return (
		<Chart
			series={options.series}
			options={options.options}
			type={options.options.chart?.type}
			height={options.options.chart?.height}
      width={options.options.chart?.width}
		/>
	);
};

export default PieChart;
