import React from 'react';
import Header, { HeaderLeft, HeaderRight } from '../../../components/layouts/Header/Header';
import DefaultHeaderRightCommon from './_common/DefaultHeaderRight.common';
import SearchPartial from './_partial/Search.partial';
import SelectYear from './_partial/SelectYear';

const DefaultHeaderTemplate = () => {
	return (
		<Header>
			<HeaderLeft>
				<SearchPartial />
			</HeaderLeft>
			<HeaderRight>
				<SelectYear />
				<DefaultHeaderRightCommon />
			</HeaderRight>
		</Header>
	);
};

export default DefaultHeaderTemplate;
