import React from 'react';

import Cascader from '../../../components/cascader';
import '../../../components/cascader/style';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  onChange = (value) => {
    console.log(value);
  }

  render() {

    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];

    return (
      <Cascader options={options} onChange={this.onChange} placeholder="Please select" />
    );
  }
}
