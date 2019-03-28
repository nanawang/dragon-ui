import * as React from 'react';
import { FieldNamesType, CascaderOptionType } from './PropsType';

export function getFieldNames(fieldNames: FieldNamesType) {
  const names = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value',
  };
  return names;
}

export const arrayTreeFilter = (data, filterFn, options) => {
  options = options || {};
  options.childrenKeyName = options.childrenKeyName || 'children';
  let children = data || [];
  let result: CascaderOptionType[] = [];
  let level = 0;
  let foundItem;
  do {
    foundItem = children.filter(function (item) {
      return filterFn(item, level);
    })[0];
    if (!foundItem) {
      break;
    }
    result.push(foundItem);
    children = foundItem[options.childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
};

export const defaultDisplayRender = (label: string[]) => label.join(' / ');

export const hasFilterOption = (inputValue: string, path: CascaderOptionType[], fieldNames: FieldNamesType) => {
  return path.some(option => (option[fieldNames.label] as string).indexOf(inputValue) > -1);
};

export const filterOptionRender = (
  searchValue: string, path: CascaderOptionType[],
  fieldNames: FieldNamesType, prefixCls: string) => {
  return path.map((option, index: number) => {
    const label = option[fieldNames.label];
    let labelWithHighlight = label;
    if ((label as string).indexOf(searchValue) > -1) {
      labelWithHighlight = label.split(searchValue).map((chars: string, index: number) => {
        return index === 0
          ? [chars, <span className={`${prefixCls}-menu-item-keyword`} key={index}>{searchValue}</span>]
          : chars;
      });
    }
    return index === 0 ? labelWithHighlight : [' / ', labelWithHighlight];
  });
};
