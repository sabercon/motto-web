import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        <FormattedMessage id="userandregisterresult.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage id="userandregisterresult.register-result.msg" username={Location.state.username}/>
      </div>
    }
    // subTitle={formatMessage({
    //   id: 'userandregisterresult.register-result.activation-email',
    // })}
    extra={actions}
  />
);

export default RegisterResult;
