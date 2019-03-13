import React, { MouseEvent, ReactNode } from 'react';

export type trigger = 'click' | 'hover';
export type size = 'xl' | 'lg' | 'sm' | 'xs';

export interface FieldNamesType {
  value?: string;
  label?: string;
  children?: string;
}

export interface CascaderOptionType {
  value?: string;
  label?: ReactNode;
  disabled?: boolean;
  title?: string;
  children?: Array<CascaderOptionType>;
}

interface BasicPropsType {
  locale?: { [propName: string]: any };
  prefixCls?: string;
  value?: string[];
  defaultValue?: string[];
  activeValue?: string[];
  placeholder?: string;
  isDisabled?: boolean;
  size?: size;
  className?: string;
  popupClassName?: string;
  style?: React.CSSProperties;
  options: CascaderOptionType[];
  allowClear?: boolean;
  loadData?: (selectedOptions?: CascaderOptionType[]) => void;
  /** 选择完成后的回调 */
  onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender?: (label: string[], selectedOptions?: CascaderOptionType[]) => React.ReactNode;
  fieldNames?: FieldNamesType;

  /** 为true表示选择后即改变，可选择父级 */
  changeOnSelect?: boolean;
  trigger?: trigger;
  popupVisible?: boolean;

  isSearch?: boolean;

  getPopupContainer?(): HTMLElement;
}

export type propsType = React.HTMLAttributes<any> & BasicPropsType;

export interface StateType {
  visible?: boolean;
  positionInfo: {
    left: number;
    top: number;
  };
  isPending: boolean;
  animationState: string | null;
  activeValue?: string[];
}

export interface MenusProps {
  size?: size;
  prefixCls?: string;
  visible?: boolean;
  options: CascaderOptionType[];
  value?: string[];
  activeValue?: string[];
  fieldNames?: FieldNamesType;
  dropdownMenuColumnStyle?: object;
  onSelect: (targetOption: CascaderOptionType[], menuIndex: number, e: MouseEvent) => void;
}
