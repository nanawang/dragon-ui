import React from 'react';
import { render, shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Cascader from '../index';

const options = [{
  value: 'zhejiang',
  label: '浙江省',
  disabled: true,
  children: [
    {
      value: 'hangzhou',
      label: '杭州市',
      children: [{
        value: 'xihu',
        label: '西湖区',
      }, {
        value: 'shangcheng',
        label: '上城区',
      }],
    }],
},
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      {
        value: 'pudong',
        label: '浦东新区',
      },
      {
        value: 'xuhui',
        label: '徐汇区',
      }
    ],
  }
];
const value = ['shanghai', 'pudong'];
const fieldNames = {
  value: 'code',
  label: 'name',
  children: 'child',
};

describe('Cascader', () => {
  it('renders basic Cascader correctly', () => {
    const onChangeValue = jest.fn();
    const wrapper = shallow(
      <Cascader options={options} value={value} onChange={onChangeValue} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props isDisabled correctly', () => {
    const wrapper = shallow(
      <Cascader options={options} value={value} isDisabled />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props fieldNames correctly', () => {
    const wrapper = shallow(
      <Cascader options={options} fieldNames={fieldNames} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props expandTrigger correctly', () => {
    const wrapper = shallow(
      <Cascader options={options} expandTrigger="hover" />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props changeOnSelect correctly', () => {
    const wrapper = shallow(
      <Cascader options={options} expandTrigger="hover" changeOnSelect />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props children correctly', () => {
    const wrapper = shallow(
      <div>
        <Cascader options={options} expandTrigger="hover">
          <a href="javascript:;">选择地区</a>
        </Cascader>
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props isSearch correctly', () => {
    const wrapper = shallow(
      <Cascader options={options} isSearch />
    )
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders basic Cascader with props loadData correctly', () => {
    const loadData = jest.fn();
    const wrapper = shallow(
      <Cascader options={options} loadData={loadData} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
