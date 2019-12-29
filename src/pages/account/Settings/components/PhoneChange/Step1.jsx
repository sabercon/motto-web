import { Button, Col, Form, Input, Row } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

const encrypt = phone => {
  const reg = /^(\d{3})\d*(\d{4})$/;
  return phone.replace(reg, '$1****$2');
};

class Step1 extends Component {
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
        status: 5, // unbindPhone
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
            type: 'accountSettings/unbindPhone',
            payload: { ...values },
          });
        }
      },
    );
  };

  render() {
    const { form, submitting, phone } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          style={{ margin: '30px auto', maxWidth: '360px' }}
        >
          <Input size="large" value={encrypt(phone)} style={{ marginBottom: '24px' }} disabled />
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
              解绑手机
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ user, loading }) => ({
  phone: user.currentUser.phone,
  submitting: loading.effects['accountSettings/unbindPhone'],
}))(Form.create()(Step1));
