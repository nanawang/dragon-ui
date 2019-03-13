import * as React from 'react';
import Dropdown from '../dropdown';
import Menus from './Menus';
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
  };

  constructor(props: propsType) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      activeValue: props.activeValue || [],
      popupVisible: props.popupVisible,
      searchValue: '',
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

  onMenuSelect = () => {
    console.log('onMenuSelect');
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
    } = props;
    const { popupVisible: _popupVisible } = this.state;
    const popupVisible = isDisabled ? false : _popupVisible;

    const disabled = 'disabled' in props || isDisabled;

    const search = 'search' in props || isSearch;

    let options = props.options;
    // if (state.inputValue) {
    //   options = this.generateFilteredOptions(prefixCls);
    // }
    const menus = (options && options.length > 0)
      ? (<Menus
        size={size}
        fieldNames={getFieldNames(fieldNames)}
        options={options}
        onSelect={this.onMenuSelect}
      />)
      : (<span className={`${prefixCls}-notfound`}>{locale!.noMatch}</span>);

    const valueText = this.getLabel();
    return (
      <div className={prefixCls}>
        <Dropdown
          triggerBoxStyle={style}
          disabled={disabled}
          visible={popupVisible}
          overlay={menus}
          getPopupContainer={getPopupContainer}
          onVisibleChange={(visible) => {
            if (visible === true) {
              this.setState({ popupVisible: visible, searchValue: '' });
            } else {
              this.setState({ popupVisible: visible });
            }
          }}
        >
          {
            children ? children
              : (<InputWithTags
                size={size}
                disabled={disabled}
                style={style}
                searchValue={this.state.searchValue}
                search={search}
                active={popupVisible}
                value={valueText}
                placeholder={placeholder || locale!.placeholder}
                onSearchChange={this.onSearchValueChange}
              />)
          }
        </Dropdown>
      </div>
    );
  }
}

export default LocaleReceiver(Cascader, 'Cascader');
