import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
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

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="userandregisterresult.register-result.msg"
          values={{
            username: location.state ? location.state.username : 'unknown user',
          }}
        />
      </div>
    }
    extra={actions}
  />
);

export default RegisterResult;
