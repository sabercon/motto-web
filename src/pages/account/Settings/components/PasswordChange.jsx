import { Button, Col, Form, Input, Row } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Password } = Input;

class PasswordChange extends Component {
  state = {
    count: 0,
  };

  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onFetchCode = () => {
    const { phone, dispatch } = this.props;
    dispatch({
      type: 'user/fetchCode',
      payload: {
        status: 4, // updatePassword
        phone,
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
            type: 'accountSettings/updatePassword',
            payload: { ...values },
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} style = {{marginTop: '30px', maxWidth: '360px'}}>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  pattern: /^[A-Za-z0-9]{6,20}$/,
                  message: '密码格式错误！',
                },
              ],
            })(<Password size="large" placeholder="密码" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '两次输入的密码不匹配！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Password size="large" placeholder="确认密码" />)}
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
                <Button size="large" disabled={!!count} onClick={this.onFetchCode}>
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button size="large" loading={submitting} type="primary" htmlType="submit">
              修改密码
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ user, loading }) => ({
  phone: user.currentUser.phone,
  submitting: loading.effects['accountSettings/updatePassword'],
}))(Form.create()(PasswordChange));
