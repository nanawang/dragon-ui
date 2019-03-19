import React, { MouseEvent, ReactNode } from 'react';

export type expandTrigger = 'click' | 'hover';
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
  isLeaf?: boolean;
  title?: string;
  children?: Array<CascaderOptionType>;
}

interface BasicPropsType {
  locale?: { [propName: string]: any };
  prefixCls?: string;
  /** 指定选中项 */
  value?: string[];
  /** 默认的选中项 */
  defaultValue?: string[];
  /** 可选项数据源 */
  options: CascaderOptionType[];
  /** 输入框占位文本*/
  placeholder?: string;
  /** 是否禁用 **/
  isDisabled?: boolean;
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义浮层类名 */
  popupClassName?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否支持清除*/
  allowClear?: boolean;
  /** 浮层对齐方式：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement?: string;
  /** 菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger?: expandTrigger;
  /** 选择完成后的回调 */
  onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender?: (label: string[], selectedOptions?: CascaderOptionType[]) => React.ReactNode;
  /** 浮层显示or隐藏的回调 */
  onPopupVisibleChange?: (popupVisible: boolean) => void;
  fieldNames?: FieldNamesType;
  /** 为true表示选择后即改变，可选择父级 */
  changeOnSelect?: boolean;

  popupVisible?: boolean;
  /** 是否支持搜索 **/
  isSearch?: boolean;
  // 后续完善属性
  // loadData?: (selectedOptions?: CascaderOptionType[]) => void;
  // size?: size;
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
  prefixCls?: string;
  visible?: boolean;
  options: CascaderOptionType[];
  value?: string[];
  activeValue?: string[];
  fieldNames?: FieldNamesType;
  defaultFieldNames: FieldNamesType;
  dropdownMenuColumnStyle?: object;
  onSelect: (targetOption: CascaderOptionType[], menuIndex: number, e: MouseEvent) => void;
}
