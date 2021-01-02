import React, { useState, useEffect } from 'react';
import Field from '@/component/field';
import type { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio, { Select } from '@/component/field/Radio';
import AntSelect from '@/component/field/Select';
import InputRange from '@/component/field/InputRange';
import { ImgSelector } from '@/component/field';
import { Switch, Divider } from 'antd';
import classnames from 'classnames';
import { useDebounce } from 'react-use';

type IFormItemValue = string | number | boolean | (number | string)[];

interface IFormItemProps {
  config: IChartConfig;
  value?: IFormItemValue;
  onChange?: (e: IFormItemValue) => void;
  style?: React.CSSProperties;
  type?: string;
  disabled?: boolean;
  [v: string]: any;
}

export const FormField = ({
  value = '',
  onChange,
  config: { defaultValue, valueType = 'number', type, key, title, subTitle, ...config },
  style,
  disabled = false,
}: IFormItemProps) => {
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (!R.equals(innerValue, value)) {
      setInnerValue(value);
    }
  }, [value]);

  useDebounce(
    () => {
      if (R.equals(innerValue, value)) return;
      onChange(innerValue);
    },
    500,
    [innerValue],
  );

  if (type === 'divider') {
    return <Divider plain>{title}</Divider>;
  }
  if (type === 'label') {
    return (
      <Field style={style} subTitle={subTitle}>
        <label style={{ color: '#6e7481' }}>{title}</label>
      </Field>
    );
  }
  if (type === 'image') {
    return <ImgSelector onChange={onChange} value={value as string} title={title} {...config} />;
  }

  switch (type) {
    case 'input':
    default:
      return (
        <input
          type={valueType}
          onChange={(e) => {
            setInnerValue(valueType === 'number' ? Number(e.target.value) : e.target.value);
          }}
          className={classnames('data_input')}
          value={String(R.isNil(innerValue) ? '' : innerValue)}
          {...config}
          style={style}
          disabled={disabled}
          readOnly={disabled}
        />
      );
      break;
    case 'radio': {
      const { option, ...props } = config;
      return (
        <Radio
          disabled={disabled}
          onChange={onChange}
          value={value as string | number}
          config={option}
          {...props}
        />
      );
    }
    case 'select':
      return (
        <Select
          disabled={disabled}
          onChange={onChange}
          value={value as string | number}
          config={config.option}
        />
      );
      break;
    case 'antselect':
      return (
        <AntSelect
          disabled={disabled}
          onChange={onChange}
          value={value as string | number}
          config={config.option}
        />
      );
      break;
    case 'switch':
      return (
        <Switch disabled={disabled} checked={value as boolean} onChange={onChange} {...config} />
      );
      break;
    case 'range':
      return (
        <InputRange disabled={disabled} value={Number(value)} onChange={onChange} {...config} />
      );
      break;
    case 'color':
      return (
        <ColorPicker disabled={disabled} value={innerValue} onChange={setInnerValue} {...config} />
      );
      break;
    case 'purecolor':
      return (
        <PureColor
          disabled={disabled}
          value={innerValue as string}
          onChange={setInnerValue}
          {...config}
        />
      );
      break;
    case 'slider':
      {
        // 支持任意长度的slide排为一组
        const len = config.length || 2;
        const arr = R.range(0, len);
        return (
          <div className="alignRow">
            {arr.map((id) => (
              <React.Fragment key={id}>
                <input
                  type="number"
                  className={classnames('data_input')}
                  value={innerValue?.[id] || 0}
                  onChange={(e) => {
                    const val = R.update(
                      id,
                      Number(e.target.value),
                      (innerValue as number[]).slice(),
                    );
                    setInnerValue(val);
                  }}
                  disabled={disabled}
                  readOnly={disabled}
                  {...config}
                />
                {id < len - 1 && <span style={{ margin: '0 5px' }}> {config.split ?? '~'} </span>}
              </React.Fragment>
            ))}
          </div>
        );
      }
      break;
  }
};

export const FormItem = (props: IFormItemProps) => {
  const {
    config: { key, title, type, subTitle },
    style,
    disabled = false,
  } = props;

  if (['divider', 'label', 'image'].includes(type)) {
    return <FormField {...props} />;
  }

  return (
    <Field
      title={title || key}
      subTitle={subTitle}
      disabled={disabled}
      style={style}
      className={classnames({ disabled })}
    >
      <FormField {...props} />
    </Field>
  );
};
