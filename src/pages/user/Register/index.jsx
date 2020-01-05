import { Button, Col, Form, Input, Popover, Progress, Row, Select } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { Password } = Input;
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：安全</div>,
  pass: <div className={styles.warning}>强度：中等</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const passwordPattern = /^[A-Za-z0-9]{6,20}$/;

class Register extends Component {
  state = {
    count: 0,
    visible: false,
    prefix: '86',
  };

  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSendCode = () => {
    const { form } = this.props;
    form.validateFields(['phone'], {}, (err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'user/sendCode',
          payload: {
            status: 1, // register
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

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
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
          const { prefix } = this.state;
          dispatch({
            type: 'register/submit',
            payload: { ...values, prefix },
          });
        }
      },
    );
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配！');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    this.setState({ visible: true });
    if (!value) {
      this.setState({ visible: false });
      callback('请输入密码！');
    } else if (!passwordPattern.test(value)) {
      this.setState({ visible: false });
      callback('密码格式错误！');
    }
    const { form } = this.props;
    form.validateFields(['confirm'], {
      force: true,
    });
    callback();
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
                {
                  pattern: /^[A-Za-z0-9]{2,40}$/,
                  message: '用户名格式错误！',
                },
              ],
            })(<Input size="large" placeholder="用户名，2-40位字符，可为字母或数字" />)}
          </FormItem>
          <FormItem>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    请至少输入 6 个字符，不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Password size="large" placeholder="密码，6-20位字符，可为字母或数字" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Password size="large" placeholder="确认密码" />)}
          </FormItem>
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
                  className={styles.getCaptcha}
                  onClick={this.onSendCode}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账号登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ loading }) => ({
  submitting: loading.effects['register/submit'],
}))(Form.create()(Register));
