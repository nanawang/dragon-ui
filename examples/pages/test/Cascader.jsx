import React from 'react';

import Cascader from '../../../components/cascader';
import '../../../components/cascader/style';
import '../../../components/dropdown/style';
import '../../../components/tag-input/style';
import { CascaderOptionType } from '../../../components/cascader/PropsType';

const options = [{
  value: 'zhinan',
  label: '指南指南',
  children: [{
    value: 'shejiyuanze',
    label: '设计原则',
    isLeaf: false,
  }, {
    value: 'daohang',
    label: '导航',
    children: [{
      value: 'cexiangdaohang',
      label: '侧向导航',
    }, {
      value: 'dingbudaohang',
      label: '顶部导航',
    }],
  }],
}, {
  value: 'zujian',
  label: '组件',
  children: [{
    value: 'basic',
    label: 'Basic',
    isLeaf: false,
  }, {
    value: 'form',
    label: 'Form',
    children: [{
      value: 'radio',
      label: 'Radio 单选框',
    }, {
      value: 'checkbox',
      label: 'Checkbox 多选框',
    }, {
      value: 'input',
      label: 'Input 输入框',
    }, {
      value: 'input-number',
      label: 'InputNumber 计数器',
    }, {
      value: 'select',
      label: 'Select 选择器',
    }, {
      value: 'cascader',
      label: 'Cascader 级联选择器',
    }, {
      value: 'switch',
      label: 'Switch 开关',
    }, {
      value: 'slider',
      label: 'Slider 滑块',
    }, {
      value: 'time-picker',
      label: 'TimePicker 时间选择器',
    },
  }],
}, {
  value: 'ziyuan',
  label: '资源',
  disabled: true,
  children: [{
    value: 'axure',
    label: 'Axure Components',
  }, {
    value: 'sketch',
    label: 'Sketch Templates',
  }, {
    value: 'jiaohu',
    label: '组件交互文档',
  }],
}];

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ['zhinan', 'shejiyuanze', 'yizhi'],
      options,
    };
  }

  componentDidMount() {
  }

  onChange = (value) => {
    console.log(value);
  };

  loadData = (targetOption, activeValue, activeOptions) => {
    console.log(targetOption, activeValue, activeOptions);
    targetOption.loading = true;
    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [{
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      }];
      this.setState({
        options: [...this.state.options],
      });
    }, 300);
  };

  render() {
    const { value } = this.state;
    {/*<Cascader isDisabled options={options} onChange={this.onChange} isSearch value={value} />*/
    }
    {/*<Cascader options={options} onChange={this.onChange} isSearch value={value} />*/
    }
    {/*<Cascader style={{ width: 500 }} options={options} onChange={this.onChange} isSearch />*/
    }
    {/*<Cascader style={{ width: 500 }} className="demo-picker" options={options} onChange={this.onChange} isSearch />*/
    }
    {/*<Cascader style={{ width: 500 }} changeOnSelect expandTrigger="hover" className="demo-picker" options={options} onChange={this.onChange} isSearch />*/
    }
    {/*<Cascader style={{ width: 500 }}  changeOnSelect expandTrigger="hover" className="demo-picker" options={options} onChange={this.onChange} isSearch />*/
    }
    {/*<Cascader style={{ width: 500 }} loadData={this.loadData} changeOnSelect expandTrigger="hover" className="demo-picker" options={this.state.options} onChange={this.onChange} isSearch />*/
    }

    return (
      <Cascader style={{ width: 500 }} loadData={this.loadData} changeOnSelect expandTrigger="hover" className="demo-picker" options={this.state.options} onChange={this.onChange} isSearch>
        <a href="#">Change city</a>
      </Cascader>
    );
  }
}
