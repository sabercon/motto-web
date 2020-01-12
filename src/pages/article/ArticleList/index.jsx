import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Radio,
  message,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { getPage, del } from '@/services/article';
import { router, Link } from 'umi';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

class ArticleList extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    type: undefined,
    total: undefined,
    list: [],
    loading: false,
  };

  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  addBtn = undefined;

  componentDidMount() {
    this.queryPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.pageNum !== this.state.pageNum ||
      prevState.pageSize !== this.state.pageSize ||
      prevState.title !== this.state.title ||
      prevState.type !== this.state.type
    ) {
      this.queryPage();
    }
  }

  queryPage = async () => {
    const { pageNum, pageSize, title, type } = this.state;
    this.setState({ loading: true });
    const response = await getPage({
      pageNum: pageNum - 1,
      pageSize,
      fuzzyValue: title,
      equalValue: type,
    });
    this.setState({ loading: false });
    if (response.success && response.data) {
      this.setState({
        list: response.data.list,
        total: response.data.totalNum,
      });
    }
  };

  deleteItem = async id => {
    const response = await del({ id });
    if (response.success) {
      message.success('删除成功！');
      this.queryPage();
    } else {
      message.error('删除失败请重试！');
    }
  };

  changeType = type => {
    if (type === this.state.type) {
      this.setState({ type: undefined, pageNum: 1 });
    } else {
      this.setState({ type, pageNum: 1 });
    }
  };

  render() {
    const { pageNum, pageSize, type, total, list, loading } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <a
          style={{ fontSize: '16spx', color: 'rgb(0,0,0,0.65)', marginRight: '16px' }}
          onClick={this.queryPage}
        >
          <Icon type="reload" />
        </a>
        <RadioGroup value={type}>
          <RadioButton onClick={e => this.changeType(e.target.value)} value="html">
            Html富文本
          </RadioButton>
          <RadioButton onClick={e => this.changeType(e.target.value)} value="markdown">
            Markdown文本
          </RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入标题"
          onSearch={value => this.setState({ title: value, pageNum: 1 })}
        />
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      pageSize,
      total,
      onChange: (current, size) => this.setState({ pageNum: current, pageSize: size }),
      onShowSizeChange: (current, size) => this.setState({ pageNum: current, pageSize: size }),
    };

    const ListContent = ({ data: { type: articleType, createTime, updateTime } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>类型</span>
          {articleType === 'html' && <p>Html富文本&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>}
          {articleType === 'markdown' && <p>Markdown文本</p>}
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>更新时间</span>
          <p>{moment(updateTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const MoreBtn = ({ item }) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              key="edit"
              onClick={() => {
                router.push(`/article/edit/${item.id}`);
              }}
            >
              编辑
            </Menu.Item>
            <Menu.Item
              key="delete"
              onClick={() => {
                Modal.confirm({
                  title: '删除文章',
                  content: '确定删除该文章吗？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => this.deleteItem(item.id),
                });
              }}
            >
              删除
            </Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              style={{
                marginTop: 24,
              }}
              bodyStyle={{
                padding: '0 32px 40px 32px',
              }}
              title="文章列表"
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{
                  width: '100%',
                  marginBottom: 8,
                }}
                icon="plus"
                onClick={() => router.push('/article/edit/:id')}
              >
                添加
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Link to={`/article/read/${item.id}`}>阅读</Link>,
                      <MoreBtn key="more" item={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src={this.props.currentUser.avatar} shape="square" size="large" />
                      }
                      title={item.title}
                      description={item.note}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(ArticleList);
