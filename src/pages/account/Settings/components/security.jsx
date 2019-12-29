import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import { List } from 'antd';

const encrypt = phone => {
  const reg = /^(\d{3})\d*(\d{4})$/;
  return phone.replace(reg, '$1****$2');
};

class SecurityView extends Component {
  getData = () => [
    {
      title: '账号密码',
      description: '需要手机号验证',
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '密保手机',
      description: `已绑定手机：${encrypt(this.props.phone)}`,
      actions: [<a key="Modify">修改</a>],
    },
  ];

  render() {
    const data = this.getData();
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default connect(({ user }) => ({
  phone: user.currentUser.phone,
}))(SecurityView);
