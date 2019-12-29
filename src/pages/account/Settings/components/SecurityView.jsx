import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import { List } from 'antd';
import PasswordChange from './PasswordChange';
import PhoneChange from './PhoneChange';

const encrypt = phone => {
  const reg = /^(\d{3})\d*(\d{4})$/;
  return phone.replace(reg, '$1****$2');
};

class SecurityView extends Component {
  state = {
    status: '',
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountSettings/changeCurrentStep',
      payload: 'unbind',
    });
  }

  getData = () => [
    {
      title: '账号密码',
      description: '需要手机号验证',
      actions: [
        <a key="Modify" onClick={() => this.changeStatus('password')}>
          修改
        </a>,
      ],
    },
    {
      title: '密保手机',
      description: `已绑定手机：${encrypt(this.props.phone)}`,
      actions: [
        <a key="Modify" onClick={() => this.changeStatus('phone')}>
          修改
        </a>,
      ],
    },
  ];

  changeStatus = status => {
    this.setState({ status });
  };

  render() {
    const data = this.getData();
    const { status } = this.state;
    let content;
    switch (status) {
      case 'password':
        content = <PasswordChange/>;
        break;
      case 'phone':
        content = <PhoneChange/>;
        break;
      default:
        content = (
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item actions={item.actions}>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        );
    }
    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }
}

export default connect(({ user }) => ({
  phone: user.currentUser.phone,
}))(SecurityView);
