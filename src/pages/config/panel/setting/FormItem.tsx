import React from 'react';
import Field from '@/component/field';
import { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio, { Select } from '@/component/field/Radio';
import AntSelect from '@/component/field/Select';
import InputRange from '@/component/field/InputRange';
import { ImgSelector } from '@/component/field';
import { Switch, Divider } from 'antd';
import classnames from 'classnames';

export const FormItem = ({
  value,
  onChange,
  config: { defaultValue, valueType = 'number', type, key, title, ...config },
  style,
  disabled = false,
}: {
  config: IChartConfig;
  value: string | number | boolean;
  onChange: (e: string | number | boolean) => void;
  style?: React.CSSProperties;
  type?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  if (type === 'divider') {
    return <Divider plain>{title}</Divider>;
  } else if (type === 'label') {
    return (
      <Field style={style}>
        <label style={{ color: '#6e7481' }}>{title}</label>
      </Field>
    );
  } else if (type === 'image') {
    return <ImgSelector onChange={onChange} value={value as string} title={title} {...config} />;
  }
  let Item: null | React.ReactNode = null;
  switch (type) {
    case 'input':
    default:
      Item = (
        <input
          type={valueType}
          onChange={(e) => {
            onChange(valueType === 'number' ? Number(e.target.value) : e.target.value);
          }}
          className={classnames('data_input')}
          value={String(R.isNil(value) ? '' : value)}
          {...config}
          disabled={disabled}
          readOnly={disabled}
        />
      );
      break;
    case 'radio':
      let { option, ...props } = config;
      Item = (
        <Radio disabled={disabled} onChange={onChange} value={value} config={option} {...props} />
      );
      break;
    case 'select':
      Item = (
        <Select disabled={disabled} onChange={onChange} value={value} config={config.option} />
      );
      break;
    case 'antselect':
      Item = (
        <AntSelect disabled={disabled} onChange={onChange} value={value} config={config.option} />
      );
      break;
    case 'switch':
      Item = (
        <Switch disabled={disabled} checked={value as boolean} onChange={onChange} {...config} />
      );
      break;
    case 'range':
      Item = (
        <InputRange disabled={disabled} value={Number(value)} onChange={onChange} {...config} />
      );
      break;
    case 'color':
      Item = <ColorPicker disabled={disabled} value={value} onChange={onChange} {...config} />;
      break;
    case 'purecolor':
      Item = <PureColor disabled={disabled} value={value} onChange={onChange} {...config} />;
      break;
    case 'slider':
      Item = (
        <div className="alignRow">
          <input
            type="number"
            className={classnames('data_input')}
            value={value?.[0] || 0}
            onChange={(e) => {
              let val = Number(e.target.value);
              onChange([val, value[1]]);
            }}
            disabled={disabled}
            readOnly={disabled}
            {...config}
          />
          <span style={{ margin: '0 8px' }}> {config.split || '~'} </span>
          <input
            type="number"
            className={classnames('data_input')}
            onChange={(e) => {
              let val = Number(e.target.value);
              onChange([value[0], val]);
            }}
            value={value[1] || 0}
            {...config}
            disabled={disabled}
            readOnly={disabled}
          />
        </div>
      );
      break;
  }
  return (
    <Field
      title={title || key}
      disabled={disabled}
      style={style}
      className={classnames({ disabled })}
    >
      {Item}
    </Field>
  );
};
