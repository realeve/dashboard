import { AlignCenterIcon, AlignRightIcon, AlignLeftIcon } from './iconAlign';
import Radio from '@/component/field/Radio';

export default (props) => {
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
