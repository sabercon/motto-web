import { Card, List, Typography, Button, Icon, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CreateForm from './components/CreateForm';
import styles from './style.less';
import { save, del } from '@/services/image';

const { Paragraph } = Typography;

const handleAdd = async paramsList => {
  if (!paramsList || !paramsList.length) {
    return true;
  }
  const hide = message.loading('正在添加');
  try {
    await Promise.all(paramsList.map(params => save(params)));
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

class Image extends Component {
  state = {
    createModalVisible: false,
  };

  componentDidMount() {
    const { dispatch, resourceImage } = this.props;
    dispatch({
      type: 'resourceImage/fetchMore',
      payload: {
        start: resourceImage.list ? resourceImage.list.length : 0,
        size: 11,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceImage/reset',
    });
  }

  render() {
    const {
      resourceImage: { list = [] },
      loading,
    } = this.props;
    const { createModalVisible } = this.state;
    const cardList = list && (
      <List
        rowKey="id"
        loading={loading}
        grid={{
          gutter: 24,
          xl: 6,
          lg: 4,
          md: 4,
          sm: 3,
          xs: 2,
        }}
        dataSource={[{ id: 'new' }, ...list]}
        renderItem={item => {
          if (item && item.id !== 'new') {
            return (
              <List.Item>
                <Card
                  className={styles.card}
                  hoverable
                  cover={<img alt={item.name} src={item.thumbnailUrl} />}
                >
                  <Card.Meta
                    title={<a>{item.name}</a>}
                    description={
                      <Paragraph
                        className={styles.item}
                        ellipsis={{
                          rows: 2,
                        }}
                      >
                        {item.type}
                      </Paragraph>
                    }
                  />
                  <div className={styles.cardItemContent}>
                    <span>{moment(item.createTime).fromNow()}</span>
                  </div>
                </Card>
              </List.Item>
            );
          }

          return (
            <List.Item>
              <Button
                type="dashed"
                className={styles.newButton}
                onClick={() => {
                  this.setState({ createModalVisible: true });
                }}
              >
                <Icon type="plus" /> 新增图片
              </Button>
            </List.Item>
          );
        }}
      />
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.coverCardList}>
          <div className={styles.cardList}>{cardList}</div>
        </div>

        <CreateForm
          onSubmit={async value => {
            const success = await handleAdd(value);
            if (success) {
              this.setState({ createModalVisible: false });
            }
          }}
          onCancel={() => {
            this.setState({ createModalVisible: false });
          }}
          modalVisible={createModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ resourceImage, loading }) => ({
  resourceImage,
  loading: loading.models.resourceImage,
}))(Image);
