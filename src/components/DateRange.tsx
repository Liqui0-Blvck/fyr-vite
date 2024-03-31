import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { DateRange, Range } from 'react-date-range';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors';
import themeConfig from '../config/theme.config';

interface IDatePicket {
  setState: Dispatch<SetStateAction<Range[]>>
  state: Range[]
}

const DateRangePicker: FC<IDatePicket> = ({ setState, state }) => {
	
	return (
		<DateRange
      className='mx-auto'
			editableDateInputs
			onChange={(item) => setState([item.selection])}
			moveRangeOnFirstSelection={false}
			ranges={state}
			color={colors[themeConfig.themeColor][themeConfig.themeColorShade]}
		/>
	);
};

export default DateRangePicker;
