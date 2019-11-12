## Form 表单
表单组件，用于包裹表单元素组件。

### 基础用法

:::demo 使用`Fomr.Item`包裹`Input`,`Button`等表单元素组件。

```js
  render() {
    return (
      <div>
        <Form>
          <Form.Item label="账号">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="密码">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item>
            <Button theme="success">登录</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
```
:::

### 行内排列

:::demo 设置`type`属性为`inline`，并给`Form.Item`设置相应的栅格布局类。

```js
  render() {
    return (
      <Form type="inline">
        <Form.Item
          className="col-sm-4"
          label="类型">
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          className="col-sm-4"
          label="类型"
        >
          <Select placeholder="请输入..." >
            <Select.Option>fdsfdsfd</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="col-sm-4"
          label="来源">
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          className="col-sm-4"
          label="">
          <Button theme="success">查询</Button>
        </Form.Item>
      </Form>
    )
  }
```
:::


### 表单验证

:::demo
  rules支持外部和Form.Item的内联形式, 回调支持promise和callback两种形式,
  如果需要重置表单值 需要如下面例子<font color=red size=2 >手动调用forceUpdate</font>的更新一次组件,
  否则只会重置组件的验证和内部数据, 页面不会更新
  更多关于验证的方法请参考 <br/> <a href="https://github.com/yiminghe/async-validator" target="_blank">async-validator</a>
```js
  constructor (props) {
    super(props)
    this.state = {
      params: {
        account: '',
        password: '',
        sex: '',
        habits: [],
        birthday: '',
        size: '',
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { type: 'string', min: 6, max: 10, message: '必须在6到10个字符', trigger: 'blur,change' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        habits: [
          { type: 'array', required: true, message: '至少选择一种动物', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        size: [
          { required: true, message: '请选择尺寸', trigger: 'change' }
        ]
      }
    }
  }
  handleSubmit (){
    this.form.validate().then(res => {
      if (res) {
        Notification.success('表单验证通过')
      } else {
        Notification.error('表单验证失败')
      }
    })
  }

  handleReset () {
    this.form.resetField();
    console.log(this.state)
    this.forceUpdate();
  }

  render() {
    const { params } = this.state
    return (
      <div>
        <Form scrollToError labelWidth="90" labelPosition="left" type="inline" ref={el => this.form = el} model={this.state.params} rules={this.state.rules} onSubmit={this.handleSubmit.bind(this)}>
          <Form.Item className="col-xs-12" label="账号" prop="account">
            <Input
              style={{ width: 200 }}
              placeholder="请输入..."
              value={params.account}
              onChange={(e) => {
                params.account = e.target.value
                this.setState({ params })
              }}
            />
          </Form.Item>
          <Form.Item
            className="col-xs-12"
            label="密码"
            prop="password"
            rules={
              [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { type: 'string', min: 8, max: 16, message: '密码必须大于等于八位小于等于16位', trigger: 'change, blur' }
              ]
            }
          >
            <Input
              style={{ width: 200 }}
              value={params.password}
              placeholder="请输入..."
              onChange={(e) => {
                params.password = e.target.value
                this.setState({ params })
              }}
            />
          </Form.Item>
          <Form.Item className="col-xs-12" label="性别" prop="sex">
            <Select
              searchPlaceholder="请选择性别"
              style={{ width: 200 }}
              value={params.sex}
              onChange={(data) => {
                params.sex = data.value
                this.setState({ params })
            }}>
              <Select.Option key="boy" value="boy">boy</Select.Option>
              <Select.Option key="girl" value="girl">girl</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="col-xs-12" label="出生日期" prop="birthday">
            <DatePicker
              radius
              allowInput
              style={{width: 200}}
              value={params.birthday}
              placeholder="请选择日期"
              onChange={(date) => {
                params.birthday = date
                this.setState({ params })
              }}
            />
          </Form.Item>
          <Form.Item className="col-xs-12" label="爱好" prop="habits">
            <Checkbox.Group
              value={params.habits}
              onChange={(values) => {
                params.habits = values
                this.setState({ params })
              }}
            >
              <Checkbox value="养猪">养猪</Checkbox>
              <Checkbox value="养牛">养牛</Checkbox>
              <Checkbox value="养狗">养狗</Checkbox>
              <Checkbox value="养猫">养猫</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item className="col-xs-12" prop="size" label="尺寸">
              <Radio.Group
                value={params.size}
                onChange={(e) => {
                  params.size = e.target.value
                  this.setState({ params })
                }}
              >
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
              </Radio.Group>
          </Form.Item>
          <Form.Item className="col-xs-12">
            <Button theme="success" onClick={this.handleSubmit.bind(this)}>登录</Button>
            <Button theme="default" onClick={this.handleReset.bind(this)}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
```
:::

### 自定义验证

:::demo 自定义表单项的验证

```js
  constructor(props) {
    super(props)

    this.state = {
      params: {
        password: '',
        confirmPassword: '',
        money: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        money: [
          { required: true, message: '请输入重置金额', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const val = Number(value)
              if (!Number.isInteger(val)) {
                callback(new Error('重置金额必须为数字'))
              } else if (Number(val) > 1000) {
                callback(new Error('重置金额必须小于1000 ！！'))
              } else {
                callback()
              }
            },
            trigger: 'change,blur'
          },
        ],
      }
    }
  }
  handleSubmit() {
    this.formRef.validate(result => {
      console.log(result)
    })
  }

  render() {
    const { params, rules } = this.state;

    return (
      <Form type="inline" model={params} rules={rules} ref={el => this.formRef = el}>
        <Form.Item
          label="密码"
          prop="password"
          className="col-xs-6"
        >
          <Input
            placeholder="请输入密码"
            value={params.password}
            onChange={e => {
              params.password = e.target.value
              this.setState({ params })
            }}
          />
        </Form.Item>

        <Form.Item
          label="确认密码"
          required
          className="col-xs-6"
        >
          <Input
            placeholder="请再次输入密码"
            value={params.confirmPassword}
            onChange={e => {
              params.confirmPassword = e.target.value
              this.setState({ params })
            }}
          />
        </Form.Item>

        <Form.Item
          label="重置金额"
          prop="money"
          className="col-xs-6"
        >
          <Input
            placeholder="请输入重置金额"
            value={params.money}
            onChange={e => {
              params.money = e.target.value
              this.setState({ params })
            }}
          />
        </Form.Item>

        <Form.Item className="col-xs-12">
          <Button theme="success" onClick={this.handleSubmit.bind(this)}>确认</Button>
        </Form.Item>
      </Form>
    )
  }
```
:::

### 动态表单验证

:::demo 动态表单表单项的验证

```js
  constructor(props) {
    super(props)

    this.state = {
      family: {
        people: [
          { name: '' }
        ]
      }
    }
  }
  handleAdd() {
    const people = this.state.family.people
    people.push({ name: '' })
    this.setState({
      family: {
        people
      }
    })
  }
  handleDel(index) {
    const people = this.state.family.people
    people.splice(index, 1)
    this.setState({
      family: {
        people
      }
    })
  }
  handleSubmit() {
    this.formRef.validate(result => {
      console.log(result)
    })
  }

  render() {
    const { people } = this.state.family
    return (
      <Form type="inline" model={this.state.family} ref={el => this.formRef = el}>
        {
          people.map((person, index) => (
            <Form.Item
              className="col-xs-12"
              key={person+index}
              label={`家人${index + 1}`}
              prop={`people.${index}`}
              rules={
                {
                  type: 'object',
                  required: true,
                  fields: {
                    name: [
                      { required: true, message: '姓名不能为空', trigger: 'blur' },
                      { type: 'string', min:3, max: 6, message: '姓名必须在3到6个字符', trigger: 'change' }
                    ]
                  }
                }
              }
            >
              <Input
                placeholder="请输入家人姓名"
                value={person.name}
                onChange={e => {
                  people[index].name = e.target.value
                  this.setState({
                    family: {
                      people
                    }
                  })
                }}
              />
              <Button theme="default" onClick={this.handleDel.bind(this, index)}>删除此项</Button>
            </Form.Item>
          ))
        }
        <Form.Item className="col-xs-12">
          <Button theme="success" onClick={this.handleAdd.bind(this)}>增加成员</Button>
        </Form.Item>
        <Form.Item className="col-xs-12">
          <Button theme="info" onClick={this.handleSubmit.bind(this)}>提交</Button>
        </Form.Item>
      </Form>
    )
  }
```
:::


### Form Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| type     | 类型   | string  |   inline/horizontal       |    horizontal    |
| model     | 表单数据对象   | object  |   -       |    -    |
| rules     | 表单校验规则   | object  |   -       |    -    |

### Form Method
| 参数       | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| validate  | 表单验证方法   | func  |   -       |    -    |
| validateField        | 对表单单项进行验证   | func  |   -       |    -    |
| resetField        | 对表单数据model重置   | func  |   -       |    -    |

### Form.Item Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| required    | 是否必填 | boolean  |   -     |   false  |
| rules    | 校验规则(优先级高级外部rules) | object/array  |   -     |   -  |
| label    | label文案 | string  |   -     |   - |
| labelWidth    | label栅格宽度 | string/number  |   -     |   - |
| labelPosition    | label对其位置 | left/right  |   -     |   - |




