## Cascader
级联选择器

### 基础用法1-设置初始值
可设置初始值，并且可通过disabled禁用任何一个层级的菜单选项

:::demo
```js
constructor(props) {
    super(props);
    this.options = [{
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
}

onChangeValue(value, selectedOptions){
    console.log(value, selectedOptions);
}

render() {
    const value = ['shanghai', 'pudong'];
    return <Cascader options={this.options}  value={value} onChange={this.onChangeValue.bind(this)} />
}
```
:::

### 基础用法2-禁用选择
可通过isDisabled禁用选择

:::demo
```js
constructor(props) {
    super(props);
    this.options = [{
      value: 'zhejiang',
      label: '浙江省',
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
}

render() {
    const value = ['shanghai', 'pudong'];
    return <Cascader options={this.options} value={value} isDisabled/>
}
```
:::

### 支持自定义字段名称
可自定义options中的label name children 的字段名称

:::demo

```js
constructor(props) {
    super(props);
    this.options = [{
      code: 'zhejiang',
      name: '浙江省',
      child: [
        {
          code: 'hangzhou',
          name: '杭州市',
          child: [{
            code: 'xihu',
            name: '西湖区',
          }, {
            code: 'shangcheng',
            name: '上城区',
          }],
        }],
      },
      {
        code: 'shanghai',
        name: '上海市',
        child: [
          {
            code: 'pudong',
            name: '浦东新区',
          },
          {
            code: 'xuhui',
            name: '徐汇区',
          }
        ],
      }
    ];
}

render() {
    const fieldNames = {
      value: 'code',
      label: 'name',
      children: 'child',
    }
    return <Cascader options={this.options} fieldNames={fieldNames}  />
}

```
:::

### 支持移入展开
默认为'click'点击展开当前项的下级菜单，可选择'hover'设置为移入展开方式
:::demo

```js
constructor(props) {
    super(props);
    this.options = [{
         value: 'zhinan',
         label: '指南指南',
       }, {
         value: 'zujian',
         label: '组件',
         children: [{
             value: 'basic',
             label: 'Basic',
           },
           {
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
             }],
           },
           {
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
           }
         ]
       }];
}

render() {
    return <Cascader options={this.options} expandTrigger="hover" />
}

```
:::

### 支持选中即变更当前值
默认是需要选中到子节点才会变更当前值，可通过changeOnSelect属性支持选中任何层级的菜单即可变更当前值
:::demo

```js
constructor(props) {
    super(props);
    this.options =[{
       value: 'zhinan',
       label: '指南指南',
     }, {
       value: 'zujian',
       label: '组件',
       children: [{
           value: 'basic',
           label: 'Basic',
         },
         {
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
           }],
         },
         {
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
         }
       ]
     }];
}
render() {
    return <Cascader options={this.options} expandTrigger="hover" changeOnSelect/>
}

```
:::

### 自定义显示的目标元素
默认显示为Input输入框，如果传入children，则展示children作为显示的目标元素
:::demo

```js
constructor(props) {
    super(props);
    this.options = [{
      value: 'zhejiang',
      label: '浙江省',
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
    this.state ={
        value: '',
    }
}


onChange(value, selectedOptions) {
    this.setState({ value: selectedOptions.map(o => o.label).join(', ')})
}


render() {
    return (
        <div>
            <Cascader options={this.options} expandTrigger="hover" onChange={this.onChange.bind(this)}>
                <a href="javascript:;">选择地区</a>
            </Cascader>
            <p>{this.state.value}</p>
        </div>
    );
}

```
:::

### 支持搜索
可以通过搜索来快速定位选项。
:::demo

```js
constructor(props) {
    super(props);
    this.options = [{
      value: 'zhejiang',
      label: '浙江省',
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
        ],mount
      }
    ];
}

render() {
    return <Cascader options={this.options} isSearch />
}


```
:::

### 支持动态加载
使用属性loadData实现动态加载,且通过isLeaf属性来标志哪项菜单是否含有子菜单。
说明: loadData 与 isSearch 两者不可同时使用。
:::demo

```js
constructor(props) {
    super(props);
    this.state = {
      options :[{
          value: 'zhejiang',
          label: '浙江省',
          children: [
            {
              value: 'hangzhou',
              label: '杭州市',
              isLeaf: false,
              },
              {
                value: 'shaoxing',
                label: '绍兴市',
                isLeaf: false,
              }
          ]
         }]
    };
}

loadData(targetOption, selectedValue, selectedOptions){
    console.log(targetOption, selectedValue, selectedOptions);
    targetOption.loading = true;
    // 模拟后端请求
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
    return <Cascader options={this.state.options} loadData={this.loadData.bind(this)}/>
}

```
:::

### Cascader Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| options    | 可选项数据源  | array |   -  |   []  |
| value    | 指定选中项 | string[] |   -  |   []  |
| defaultValue    | 默认选中项 | string[] |   -  |   []  |
| placeholder     | 占位符   | string  |   -      |    -     |
| isDisabled     | 是否禁用  | boolean  |   -      |    false    |
| className | 目标元素自定义类名 | string | — | '' |
| style | 目标元素自定义样式  | Object | — | - |
| popupClassName | 浮层自定义类名 | string | — | '' |
| popupPlacement     | 浮层对齐方式   | string  |   'bottomLeft'', 'bottomRight'', 'topLeft'', 'topRight'  |  'bottomLeft'  |
| expandTrigger     | 菜单的展开方式   | string  |   `click`, `hover`  |  'click'   |
| allowClear     | 是否支持清除  | boolean  |   -      |    false    |
| fieldNames | 自定义 options中label，name以及children的字段名称  | Object | — |
| changeOnSelect     | 是否选中即变更当前值  | boolean  |   -      |    false    |
| popupVisible     | 外部控制浮层显示或隐藏  | boolean  |   -      |    false    |
| isSearch     | 是否支持搜索  | boolean  |   -      |    false    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| onChange | 选择完成后的回调 | (value, selectedOptions) => void |
| getPopupContainer     | 获取dropdown挂载点的函数  | 	()=> HTMLElement  |
| displayRender     | 选择后展示的指定的自定义渲染函数  | (label, selectedOptions) => ReactNode  |
| onPopupVisibleChange     | 显示/隐藏浮层的回调  | 	(popupVisible: boolean) => void  |
| loadData     | 实现动态加载  | 	(targetOption, selectedValue, selectedOptions) => void;  |    |


