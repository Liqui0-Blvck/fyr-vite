import React, { SVGProps } from 'react';

const SvgStar = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M12 18l-4.084 2.147a1 1 0 01-1.451-1.054l.78-4.548-3.305-3.22a1 1 0 01.555-1.707l4.566-.663 2.042-4.138a1 1 0 011.794 0l2.042 4.138 4.566.663a1 1 0 01.555 1.706l-3.305 3.221.78 4.548a1 1 0 01-1.45 1.054L12 18z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgStar;
