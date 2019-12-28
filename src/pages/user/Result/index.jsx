import Link from 'umi/link';
import React from 'react';
import { Button, Result } from 'antd';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        立即登录
      </Button>
    </Link>
  </div>
);

const renderMsg = ({ type, user }) => {
  let message = ` 您的账号：${user} `;
  switch (type) {
    case 'register':
      message = message.concat(' 注册成功 ');
      break;
    case 'reset':
      message = message.concat(' 重置密码成功 ');
      break;
    default:
  }
  return message;
};

const UserResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={<div className={styles.title}>{location.state ? renderMsg(location.state) : 'unknown'}</div>}
    extra={actions}
  />
);

export default UserResult;
