import React, { SVGProps } from 'react';

const SvgEdit1 = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M19.925 8.44l-8.449 8.448a1.5 1.5 0 01-1.075.44l-3.523-.035a1.5 1.5 0 01-1.485-1.463l-.086-3.427a1.5 1.5 0 01.439-1.098l8.522-8.522a1.5 1.5 0 012.121 0l3.536 3.535a1.5 1.5 0 010 2.121z'
					fill='currentColor'
				/>
				<rect fill='currentColor' opacity={0.3} x={5} y={20} width={15} height={2} rx={1} />
			</g>
		</svg>
	);
};

export default SvgEdit1;
