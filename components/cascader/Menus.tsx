import * as React from 'react';
import classnames from 'classnames';
import { MenusProps } from './PropsType';
import { arrayTreeFilter } from './utils';
import Icon from '../icon';

interface StateProps {
  activeValue?: string[];
  value?: string[];
  popupVisible: boolean;
}

class Menus extends React.Component<MenusProps, StateProps> {
  static defaultProps = {
    value: [],
    activeValue: [],
    fieldNames: [],
    prefixCls: 'ui-cascader',
    visible: false,
  };

  expandIcon = (<Icon type="arrow-right" className={`${this.props.prefixCls}-menu-item-expand-icon`} />);
  loadingIcon = (<Icon type="loading" className={`${this.props.prefixCls}-menu-item-loading-icon`} />);

  defaultFieldNames = { label: 'label', value: 'value', children: 'children' };

  getFieldName = (name) => {
    const { fieldNames } = this.props;
    return fieldNames![name] || this.defaultFieldNames[name];
  }

  getActiveOptions = () => {
    const activeValue = this.props.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options,
      (o, level) => o[this.getFieldName('value')] === activeValue![level],
      { childrenKeyName: this.getFieldName('children') });
  }

  getShowOptions = () => {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption[this.getFieldName('children')])
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  }

  isActiveOption = (option, menuIndex) => {
    const { activeValue } = this.props;
    return activeValue![menuIndex] === option[this.getFieldName('value')];
  }

  getOption = (option, menuIndex) => {
    const { prefixCls, onSelect } = this.props;
    const { loading, disabled } = option;
    const [children, value, label] = [
      option[this.getFieldName('children')],
      option[this.getFieldName('value')],
      option[this.getFieldName('label')],
    ];
    const hasChildren = children && children.length > 0;
    const isActive = this.isActiveOption(option, menuIndex);
    const menuItemCls = classnames({
      [`${prefixCls}-menu-item`]: true,
      [`${prefixCls}-menu-item-loading`]: !!loading,
      [`${prefixCls}-menu-item-active`]: isActive,
      [`${prefixCls}-menu-item-disabled`]: disabled,
    });
    const loadingIcon = !!loading ? this.loadingIcon : null;
    let expandIcon: any = null;
    if (hasChildren && !loading) {
      expandIcon = this.expandIcon;
    }

    return (
      <li
        className={menuItemCls}
        key={value}
        title={label}
        onClick={(e) => {
          onSelect(option, menuIndex, e);
        }}
      >
        {label}
        {expandIcon}
        {loadingIcon}
      </li>
    );
  }

  render() {
    const { prefixCls, dropdownMenuColumnStyle } = this.props;
    const menus = this.getShowOptions().map(
      (options, menuIndex) => (
        <ul className={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
          {options.map(option => this.getOption(option, menuIndex))}
        </ul>
      ));
    return (
      <div className={`${prefixCls}-menus`}>
        {menus}
      </div>
    );
  }
}

export default Menus;
