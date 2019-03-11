import * as React from 'react';
import Dropdown from '../dropdown';
import Menus from './Menus';
import InputWithTags from '../checkbox';
import { propsType, CascaderOptionType } from './PropsType';
import { defaultDisplayRender, getFieldNames, arrayTreeFilter } from './utils';

interface StateProps {
  value: string | string[];
  dropdown: boolean;
  searchValue: string | null;
  showPlacehoder: boolean;
}

class Cascader extends React.Component<propsType, StateProps> {

  static defaultProps = {
    prefixCls: 'ui-cascader',
  };
  constructor(props: propsType) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      popupVisible: props.popupVisible,
    };
  }

  onSearchValueChange = (e) => {
    this.setState({
      searchValue: (e.target as HTMLDivElement).textContent,
      popupVisible: true,
    });
  }

  getLabel = () => {
    const { options, displayRender = defaultDisplayRender as Function, fieldNames } = this.props;
    const names = getFieldNames(fieldNames);
    const value = this.state.value;
    const valueArray = Array.isArray(value[0]) ? value[0] : value;
    const selectedOptions: CascaderOptionType[] = arrayTreeFilter(options,
      (o: CascaderOptionType, level: number) => o[names.value] === valueArray[level],
      { childrenKeyName: names.children },
    );
    const label = selectedOptions.map(o => o[names.label]);
    return displayRender(label, selectedOptions);
  }

  render() {
    const { props } = this;
    const {
      prefixCls,
      placeholder,
      isRadius,
      isDisabled,
      isSearch,
      size,
      tagTheme,
      style,
      getPopupContainer,
      children,
      locale,
    } = props;

    const { popupVisible: _popupVisible } = this.state;
    const popupVisible = disabled ? false : _popupVisible;

    const disabled = 'disabled' in props || isDisabled;

    const radius = 'radius' in props || isRadius;
    const search = 'search' in props || isSearch;

    let options = props.options;
    if (state.inputValue) {
      options = this.generateFilteredOptions(prefixCls);
    }

    const menus = (options && options.length > 0)
      ? (<Menus size={size}>{options}</Menus>)
      : (<span className={`${prefixCls}-notfound`}>{locale!.noMatch}</span>);

    const valueText = this.getLabel();
    return (
      <Dropdown
        triggerBoxStyle={style}
        disabled={disabled}
        visible={popupVisible}
        isRadius={radius}
        overlay={menus}
        getPopupContainer={getPopupContainer}
        onVisibleChange={(visible) => {
          if (visible === true) {
            this.setState({ dropdown: visible, searchValue: '' });
          } else {
            this.setState({ dropdown: visible });
          }
        }}
      >
        children && children.length > 0
        ? children
        : (<InputWithTags
        radius={radius}
        size={size}
        disabled={disabled}
        style={style}
        searchValue={this.state.searchValue}
        search={search}
        active={popupVisible}
        value={valueText}
        placeholder={placeholder}
        onSearchChange={this.onSearchValueChange}
      />)

      </Dropdown>
  }
}

export default Cascader;
