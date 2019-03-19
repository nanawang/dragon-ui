import * as React from 'react';
import classnames from 'classnames';
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
    isDisabled: false,
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
    const { activeValue, popupVisible } = props;
    const { onChange } = this.props;
    this.setState({
      value: activeValue,
      activeValue,
    });
    onChange(options.map(o => o[this.getFieldName('value')]), options);
    this.setPopupVisible(popupVisible);
  }

  onMenuSelect = (targetOption, menuIndex) => {
    const { changeOnSelect, expandTrigger } = this.props;
    let { activeValue } = this.state;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption[this.getFieldName('value')];
    const activeOptions = this.getActiveOptions(activeValue);
    if ((targetOption[this.getFieldName('children')] || []).length === 0) {
      // 点击最后一层（叶子节点），则显示选中项并关闭浮层
      this.setPopupVisible(false);
      this.handleValueChange(activeOptions, { popupVisible: false, activeValue });
    } else if (changeOnSelect) {
      let popupVisible = false;
      if (expandTrigger === 'hover') {
        popupVisible = true;
      }
      this.handleValueChange(activeOptions, { popupVisible, activeValue });
    } else {
      this.setState({ activeValue });
    }
  }

  setPopupVisible = (popupVisible) => {
    if (!('popupVisible' in this.props)) {
      this.setState({
        popupVisible,
        // 如果浮层关闭，则清空搜索框
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

  clearSelection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { searchValue } = this.state;
    if (searchValue) {
      this.setState({ searchValue: '' });
    } else {
      this.handleValueChange([], { popupVisible: false, activeValue: [] });
    }
  }

  render() {
    const { props } = this;
    const {
      prefixCls,
      placeholder,
      isDisabled,
      isSearch,
      style,
      className,
      popupClassName,
      getPopupContainer,
      children,
      fieldNames,
      locale,
      allowClear,
    } = props;
    const { popupVisible: _popupVisible, activeValue, value, searchValue } = this.state;
    const popupVisible = isDisabled ? false : _popupVisible;

    const disabled = 'disabled' in props || isDisabled;
    console.log('value, searchValue', value, searchValue, isDisabled);

    const search = 'search' in props || isSearch;

    let options = props.options;
    // if (state.searchValue) {
    //   options = this.generateFilteredOptions(prefixCls);
    // }
    const menus = (options && options.length > 0)
      ? (<Menus
        value={value}
        activeValue={activeValue}
        fieldNames={getFieldNames(fieldNames)}
        defaultFieldNames={this.defaultFieldNames}
        options={options}
        onSelect={this.onMenuSelect}
      />)
      : (<span className={`${prefixCls}-notfound`}>{locale!.noMatch}</span>);

    const valueText = this.getLabel();
    const clearIcon = (allowClear && !disabled && value.length > 0) || searchValue ? (
      <Icon
        type="wrong-round-fill"
        className={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null;
    const pickerCls = classnames(className, `${prefixCls}-picker`);
    return (
      <div className={prefixCls}>
        <Dropdown
          style={{ minWidth: 'auto' }}
          disabled={disabled}
          visible={popupVisible}
          overlay={menus}
          getPopupContainer={getPopupContainer}
          onVisibleChange={this.handlePopupVisibleChange}
          className={popupClassName}
        >
          {
            children ? children
              : (
                <div className={pickerCls} style={style}>
                  <InputWithTags
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
                </>
              )
          }
        </Dropdown>
      </div>
    );
  }
}

export default LocaleReceiver(Cascader, 'Cascader');
