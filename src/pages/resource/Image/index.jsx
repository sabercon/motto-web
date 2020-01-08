import { Card, Form, List, Typography, Input, Button, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;

class Image extends Component {
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
              <Button type="dashed" className={styles.newButton}>
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
