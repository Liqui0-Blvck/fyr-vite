import React, { SVGProps } from 'react';

const SvgSending = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M8 13.167L20.447 12 8 10.833V5.772a.5.5 0 01.705-.456l13.84 6.228a.5.5 0 010 .912l-13.84 6.228A.5.5 0 018 18.228v-5.061z'
					fill='currentColor'
				/>
				<path
					d='M4 16h1a1 1 0 010 2H4a1 1 0 010-2zm-3-5h4a1 1 0 010 2H1a1 1 0 010-2zm3-5h1a1 1 0 110 2H4a1 1 0 110-2z'
					fill='currentColor'
					opacity={0.3}
				/>
			</g>
		</svg>
	);
};

export default SvgSending;
