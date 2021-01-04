import React from 'react';
import { AlignCenterIcon, AlignRightIcon, AlignLeftIcon } from './iconAlign';
import Radio, { IRadioProps } from '@/component/field/Radio';

export default (props: IRadioProps) => {
  return (
    <Radio
      {...props}
      config={[
        {
          title: <AlignLeftIcon style={{ color: '#fff' }} />,
          value: 'left',
        },
        {
          title: <AlignCenterIcon style={{ color: '#fff' }} />,
          value: 'center',
        },
        {
          title: <AlignRightIcon style={{ color: '#fff' }} />,
          value: 'right',
        },
      ]}
    />
  );
};
