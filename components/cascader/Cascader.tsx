import * as React from 'react';
import Dropdown from '../dropdown';
import Menus from './Menus';
import Icon from '../icon';
import InputWithTags from '../tag-input';
import { propsType, CascaderOptionType } from './PropsType';
import { defaultDisplayRender, getFieldNames, arrayTreeFilter } from './utils';
import LocaleReceiver from '../locale/LocaleReceiver';

interface StateProps {
  value: string[];
  activeValue: string[];
  searchValue: string | null;
  placeholder?: string;
  popupVisible?: boolean;
}

class Cascader extends React.Component<propsType, StateProps> {

  static defaultProps = {
    prefixCls: 'ui-cascader',
    fieldNames: { label: 'label', value: 'value', children: 'children' },
    allowClear: true,
    disabled: false,
    popupPlacement: 'bottomLeft',
  };
  defaultFieldNames = { label: 'label', value: 'value', children: 'children' };

  constructor(props: propsType) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      activeValue: [],
      popupVisible: props.popupVisible,
      searchValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
        activeValue: nextProps.activeValue,
      });
    }
  }

  getActiveOptions = (values) => {
    const activeValue = values || this.props.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options,
      (o, level) => o[this.getFieldName('value')] === activeValue![level],
      { childrenKeyName: this.getFieldName('children') });
  }

  getFieldName = (name): string => {
    const { fieldNames } = this.props;
    return fieldNames![name] || this.defaultFieldNames[name];
  }

  onSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.textContent;
    this.setState({ searchValue });
  }

  getLabel = () => {
    const { options, displayRender = defaultDisplayRender as Function, fieldNames } = this.props;
    const names = getFieldNames(fieldNames);
    const value = this.state.value;
    console.log('getLabel value', value);
    const valueArray = Array.isArray(value[0]) ? value[0] : value;
    const selectedOptions: CascaderOptionType[] = arrayTreeFilter(options,
      (o: CascaderOptionType, level: number) => o[names.value] === valueArray[level],
      { childrenKeyName: names.children },
    );
    const label = selectedOptions.map(o => o[names.label]);
    return displayRender(label, selectedOptions);
  }

  handleValueChange = (options, props) => {
    const { onChange } = this.props;
    onChange(options.map(o => o[this.getFieldName('value')]), options);
    this.setPopupVisible(props.popupVisible);
  }

  onMenuSelect = (targetOption, menuIndex) => {
    const { changeOnSelect, expandTrigger } = this.props;
    let { activeValue, value } = this.state;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption[this.getFieldName('value')];
    const activeOptions = this.getActiveOptions(activeValue);

    if ((targetOption[this.getFieldName('children')] || []).length === 0) {
      // 点击最后一层（叶子节点），则显示选中项并关闭浮层
      value = activeValue;
      this.setPopupVisible(false);
      this.handleValueChange(activeOptions, { popupVisible: false });
    } else if (changeOnSelect) {
      const popupVisible = false;
      if (expandTrigger === 'hover') {
        popupVisible = true;
      }
      this.handleValueChange(activeOptions, { popupVisible });
    }

    this.setState({
      value,
      activeValue,
    });
  }

  setPopupVisible = (popupVisible) => {
    if (!('popupVisible' in this.props)) {
      // 如果浮层关闭，则清空搜索框
      this.setState({
        popupVisible,
        searchValue: popupVisible ? this.state.searchValue : '',
      });
    }
    // 打开浮层，清空之前的高亮选择
    if (popupVisible && !this.state.popupVisible) {
      this.setState({
        activeValue: this.state.value,
      });
    }
    const onPopupVisibleChange = this.props.onPopupVisibleChange;
    if (onPopupVisibleChange) {
      onPopupVisibleChange(popupVisible);
    }
  }

  handlePopupVisibleChange = (popupVisible) => {
    this.setPopupVisible(popupVisible);
  }

  clearSelection = () => {
    const { searchValue } = this.state;
    if (searchValue) {
      this.setState({ searchValue: '' });
    } else {
      this.setValue([]);
      this.handlePopupVisibleChange(false);
    }
  }

  render() {
    const { props } = this;
    const {
      prefixCls,
      placeholder,
      isDisabled,
      isSearch,
      size,
      style,
      getPopupContainer,
      children,
      fieldNames,
      locale,
      allowClear,
    } = props;
    const { popupVisible: _popupVisible, activeValue, value, searchValue } = this.state;
    const popupVisible = isDisabled ? false : _popupVisible;

    console.log('value, searchValue', value, searchValue);
    const disabled = 'disabled' in props || isDisabled;

    const search = 'search' in props || isSearch;

    let options = props.options;
    // if (state.searchValue) {
    //   options = this.generateFilteredOptions(prefixCls);
    // }
    const menus = (options && options.length > 0)
      ? (<Menus
        value={value}
        activeValue={activeValue}
        size={size}
        fieldNames={getFieldNames(fieldNames)}
        defaultFieldNames={this.defaultFieldNames}
        options={options}
        onSelect={this.onMenuSelect}
      />)
      : (<span className={`${prefixCls}-notfound`}>{locale!.noMatch}</span>);

    const valueText = this.getLabel();
    const clearIcon = (allowClear && !disabled && value.length > 0) || searchValue ? (
      <Icon
        type="cross-circle"
        className={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null;
    return (
      <div className={prefixCls}>
        <Dropdown
          style={{ ...style, minWidth: 'auto' }}
          disabled={disabled}
          visible={popupVisible}
          overlay={menus}
          getPopupContainer={getPopupContainer}
          onVisibleChange={this.handlePopupVisibleChange}
        >
          {
            children ? children
              : (
                <span className={`${prefixCls}-picker`} style={style}>
                  <InputWithTags
                    size={size}
                    disabled={disabled}
                    style={style}
                    searchValue={searchValue}
                    value={valueText}
                    search={search}
                    active={popupVisible}
                    placeholder={placeholder || locale!.placeholder}
                    onSearchChange={this.onSearchValueChange}
                  />
                  {clearIcon}
                </span>
              )
          }
        </Dropdown>
      </div>
    );
  }
}

export default LocaleReceiver(Cascader, 'Cascader');
