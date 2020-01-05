import { Alert, Checkbox, Icon } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/submit',
        payload: { ...values, type, remember: autoLogin },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['phone'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'user/fetchCode',
              payload: {
                status: 2, // login
                phone: values.phone,
              },
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, type: loginType, msg } = userLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(msg)}
            <UserName
              name="username"
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名！',
                },
                {
                  pattern: /^[A-Za-z0-9]{2,40}$/,
                  message: '用户名格式错误！',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  pattern: /^[A-Za-z0-9]{6,20}$/,
                  message: '密码格式错误！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();

                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {status === 'error' && loginType === 'mobile' && !submitting && this.renderMessage(msg)}
            <Mobile
              name="phone"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <Captcha
              name="smsCode"
              placeholder="验证码"
              countDown={59}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText="获取验证码"
              getCaptchaSecondText="s"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <Link style={{ float: 'right' }} to="/user/reset">
              忘记密码
            </Link>
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon type="wechat" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              注册账号
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
