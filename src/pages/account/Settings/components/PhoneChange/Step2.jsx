import { Button, Col, Form, Input, Row, Select, Alert } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

class Step2 extends Component {
  state = {
    count: 0,
    prefix: '86',
  };

  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onFetchCode = () => {
    const { form } = this.props;
    form.validateFields(['phone'], {}, (err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'user/fetchCode',
          payload: {
            status: 6, // bindPhone
            phone: values.phone,
          },
        });

        let count = 59;
        this.setState({
          count,
        });
        this.interval = window.setInterval(() => {
          count -= 1;
          this.setState({
            count,
          });

          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'accountSettings/bindPhone',
            payload: { ...values },
          });
        }
      },
    );
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          style={{ margin: '30px auto', maxWidth: '360px' }}
        >
          <Alert
            closable
            showIcon
            message="当前账号为可换绑状态，请尽快换绑。"
            style={{
              marginBottom: 24,
            }}
          />
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{
                  width: '20%',
                }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误！',
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{
                    width: '80%',
                  }}
                  placeholder="手机号"
                />,
              )}
            </InputGroup>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('smsCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ],
                })(<Input size="large" placeholder="验证码" />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={!!count}
                  onClick={this.onFetchCode}
                  style={{ display: 'block', width: '100%' }}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button size="large" loading={submitting} type="primary" htmlType="submit">
              绑定手机
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ loading }) => ({
  submitting: loading.effects['accountSettings/bindPhone'],
}))(Form.create()(Step2));
