import React from 'react';
import classnames from 'classnames';
import Dropdown from '../dropdown';
import Menus from './Menus';
import Icon from '../icon';
import InputWithTags from '../tag-input';
import { propsType, CascaderOptionType, FieldNamesType } from './PropsType';
import { defaultDisplayRender, getFieldNames, arrayTreeFilter, filterOptionRender, hasFilterOption } from './utils';
import LocaleReceiver from '../locale/LocaleReceiver';

interface StateProps {
  value: string[];
  activeValue: string[];
  searchValue: string;
  placeholder?: string;
  popupVisible?: boolean;
}

class Cascader extends React.Component<propsType, StateProps> {

  static defaultProps = {
    prefixCls: 'ui-cascader',
    fieldNames: { label: 'label', value: 'value', children: 'children' },
    allowClear: true,
    isDisabled: false,
    changeOnSelect: false,
    popupPlacement: 'bottomLeft',
    style: {},
  };
  defaultFieldNames = { label: 'label', value: 'value', children: 'children' };
  cachedOptions: CascaderOptionType[];
  flattenedOptions: CascaderOptionType[][];

  constructor(props: propsType) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      activeValue: [],
      popupVisible: props.popupVisible,
      searchValue: '',
    };
    const { options, changeOnSelect, fieldNames } = this.props;
    this.flattenedOptions = this.flattenOptions(options, changeOnSelect, fieldNames);
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
    if ('popupVisible' in nextProps) {
      this.setState({
        popupVisible: nextProps.popupVisible,
      });
    }
    if (nextProps.showSearch && this.props.options !== nextProps.options) {
      this.flattenedOptions = this.flattenOptions(nextProps.options, nextProps.changeOnSelect, nextProps.fieldNames);
    }
  }

  flattenOptions = (
    options: CascaderOptionType[], changeOnSelect: boolean,
    fieldNames: FieldNamesType, linkedPath: CascaderOptionType[] = [],
  ): CascaderOptionType[][] => {
    const childrenName = getFieldNames(fieldNames).children;
    return options.reduce((total, currentOption: CascaderOptionType) => {
      const path = linkedPath.concat(currentOption);
      const children = currentOption[childrenName];
      if (changeOnSelect || !(children || []).length) {
        total.push(path);
      }
      if ((children || []).length > 0) {
        total = total.concat(this.flattenOptions(children, changeOnSelect, fieldNames, path));
      }
      return total;
    }, [] as CascaderOptionType[][]);
  }

  getActiveOptions = (values) => {
    const activeValue = values || this.props.value;
    const options = this.props.options;
    return arrayTreeFilter(options,
      (o, level) => o[this.getFieldName('value')] === activeValue![level],
      { childrenKeyName: this.getFieldName('children') });
  }

  getFieldName = (name): string => {
    const { fieldNames } = this.props;
    return fieldNames![name] || this.defaultFieldNames[name];
  }

  onSearchValueChange = (e) => {
    const searchValue = (e.target as HTMLDivElement).textContent || '';
    this.setState({ searchValue });
  }

  getLabel = () => {
    const { options, displayRender = defaultDisplayRender as Function, fieldNames } = this.props;
    const names = getFieldNames(fieldNames);
    const value = this.state.value;
    if (value.length === 0) {
      return '';
    }
    const selectedOptions: CascaderOptionType[] = arrayTreeFilter(options,
      (o: CascaderOptionType, level: number) => o[names.value] === value[level],
      { childrenKeyName: names.children },
    );
    const label = (selectedOptions || []).map(o => o[names.label]);
    return displayRender(label, selectedOptions);
  }

  handleValueChange = (options, props) => {
    const { activeValue, popupVisible } = props;
    const { onChange } = this.props;
    this.setState({
      value: activeValue,
      activeValue,
    });
    if (typeof onChange !== 'undefined') {
      onChange(options.map(o => o[this.getFieldName('value')]), options);
    }
    this.setPopupVisible(popupVisible);
  }

  onMenuSelect = (targetOption, menuIndex, e) => {
    // 如果当前是点击的搜索出来的菜单，则直接变更
    if (targetOption.isFiltered) {
      this.handleValueChange(targetOption.path, { popupVisible: false, activeValue: targetOption.value  });
      return;
    }
    const { changeOnSelect, expandTrigger, loadData } = this.props;
    let { activeValue } = this.state;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption[this.getFieldName('value')];
    const activeOptions = this.getActiveOptions(activeValue);
    const hasChildren: boolean = (targetOption[this.getFieldName('children')] || []).length > 0;
    if (targetOption.isLeaf === false && !hasChildren && loadData) {
      if (changeOnSelect) {
        this.handleValueChange(activeOptions, { popupVisible: true, activeValue });
      } else {
        this.setState({ activeValue });
      }
      loadData(targetOption, activeValue, activeOptions);
      return;
    }
    if (!hasChildren) {
      // 点击最后一层（叶子节点），则显示选中项并关闭浮层
      this.setPopupVisible(false);
      this.handleValueChange(activeOptions, { popupVisible: false, activeValue });
    } else if (changeOnSelect && e.type === 'click') {
      let popupVisible = true;
      if (expandTrigger === 'hover') {
        popupVisible = false;
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

  getFilteredOptions = () => {
    const { fieldNames: fieldNamesProps, prefixCls } = this.props;
    const { searchValue } = this.state;
    const fieldNames = getFieldNames(fieldNamesProps);
    const filteredPathOptions = this.flattenedOptions.filter(
      (optionPath) => hasFilterOption(searchValue, optionPath, fieldNames),
    );
    if (filteredPathOptions.length > 0) {
      return filteredPathOptions.map((path: CascaderOptionType[]) => {
        return {
          [fieldNames.label]: filterOptionRender(searchValue, path, fieldNames, prefixCls),
          [fieldNames.value]: path.map((o: CascaderOptionType) => o[fieldNames.value]),
          disabled: path.some((o: CascaderOptionType) => !!o.disabled),
          path,
          isFiltered: true,
        };
      });
    }
    return [];
  }

  render() {
    const { props } = this;
    const {
      prefixCls,
      placeholder,
      isDisabled,
      isSearch,
      expandTrigger,
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

    const search = 'search' in props || isSearch;

    let options = props.options;
    if (searchValue) {
      options = this.getFilteredOptions();
    }

    if (!_popupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }
    const notFoundStyle = { width: style.width || 300 };
    const menus = (options && options.length > 0)
      ? (<Menus
        value={value}
        activeValue={activeValue}
        fieldNames={getFieldNames(fieldNames)}
        defaultFieldNames={this.defaultFieldNames}
        options={options}
        expandTrigger={expandTrigger}
        onSelect={this.onMenuSelect}
      />)
      : (<span className={`${prefixCls}-notfound`} style={notFoundStyle}>{locale!.noMatch}</span>);

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
                </div>
              )
          }
        </Dropdown>
      </div>
    );
  }
}

export default LocaleReceiver(Cascader, 'Cascader');
