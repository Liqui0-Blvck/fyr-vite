import React, { SVGProps } from 'react';

const SvgGlassMartini = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M13 19.4l3.686 1.474a.5.5 0 01.314.465v.161a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-.161a.5.5 0 01.314-.465L11 19.4v-5.9h2v5.9z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M13.25 13.961a2 2 0 01-2.812-.312L3.87 5.437A1.5 1.5 0 015.04 3h13.92a1.5 1.5 0 011.171 2.437l-6.57 8.212a2 2 0 01-.312.312zM6.08 5L8.5 8.012h7L17.92 5H6.08z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgGlassMartini;
