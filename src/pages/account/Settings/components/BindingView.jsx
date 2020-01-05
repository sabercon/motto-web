import { Icon, List, message } from 'antd';
import React, { Component, Fragment } from 'react';

class BindingView extends Component {
  getData = () => [
    {
      title: '绑定微信',
      description: '当前账号未绑定微信',
      actions: [<a key="Bind" onClick={() => message.info("功能还在开发中。。。")}>绑定</a>],
      avatar: <Icon type="wechat" style={{ color: '#04BE02', fontSize: '48px' }} />,
    },
  ];

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default BindingView;
