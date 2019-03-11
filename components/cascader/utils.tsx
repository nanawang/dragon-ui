import { FieldNamesType } from './PropsType';

export function getFieldNames(fieldNames: FieldNamesType = {}) {
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
  let result = [];
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
}

export const defaultDisplayRender = (label: string[]) => label.join(' / ');
