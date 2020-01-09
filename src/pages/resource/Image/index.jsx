import { Card, Form, List, Typography, Input, Button, Icon, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import CreateForm from './components/CreateForm';
import styles from './style.less';
import { save, del, getPage } from '@/services/image';

const FormItem = Form.Item;
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
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceImage/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      resourceImage: { list = [] },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { createModalVisible } = this.state;
    const cardList = list && (
      <List
        rowKey="id"
        loading={loading}
        grid={{
          gutter: 24,
          xl: 4,
          lg: 3,
          md: 3,
          sm: 2,
          xs: 1,
        }}
        dataSource={list}
        renderItem={item => {
          if (item && item.id !== 'fake-list-0') {
            return (
              <List.Item>
              <Card
                className={styles.card}
                hoverable
                cover={<img alt={item.title} src={item.cover} />}
              >
                <Card.Meta
                  title={<a>{item.title}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 2,
                      }}
                    >
                      {item.subDescription}
                    </Paragraph>
                  }
                />
                <div className={styles.cardItemContent}>
                  <span>{moment(item.updatedAt).fromNow()}</span>
                </div>
              </Card>
            </List.Item>
            );
          }

          return (
            <List.Item>
              <Button type="dashed" className={styles.newButton} onClick={() => {
                this.setState({ createModalVisible: true });
              }}>
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
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow
              title="图片类型"
              block
              style={{
                paddingBottom: 11,
              }}
            >
              <FormItem>
                {getFieldDecorator('type')(
                  <TagSelect expandable>
                    <TagSelect.Option value="image/bmp">BMP</TagSelect.Option>
                    <TagSelect.Option value="image/gif">GIF</TagSelect.Option>
                    <TagSelect.Option value="image/jpeg">JPG</TagSelect.Option>
                    <TagSelect.Option value="image/png">PNG</TagSelect.Option>
                    <TagSelect.Option value="image/svg+xml">SVG</TagSelect.Option>
                    <TagSelect.Option value="image/tiff">TIFF</TagSelect.Option>
                    <TagSelect.Option value="image/webp">WEBP</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="图片过滤" grid last>
                  <FormItem label="名称">
                    {getFieldDecorator('name')(<Input placeholder="请输入图片名" />)}
                  </FormItem>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>
          {cardList}
        </div>
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

const WarpForm = Form.create({
  onValuesChange({ dispatch }) {
    // 表单项变化时请求数据
    // 模拟查询表单生效
    dispatch({
      type: 'resourceImage/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(Image);
export default connect(({ resourceImage, loading }) => ({
  resourceImage,
  loading: loading.models.resourceImage,
}))(WarpForm);
