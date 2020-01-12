import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { get } from '@/services/article';
import { router, Link } from 'umi';
import Markdown from 'react-markdown/with-html';
import styles from './style.less';

class Read extends Component {
  state = {
    id: null,
    title: null,
    text: null,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id && id.match(/^\d+$/)) {
      get({ id }).then(response => {
        if (response.success && response.data) {
          const { title, text } = response.data;
          this.setState({
            id,
            title,
            text,
          });
        } else {
          router.replace('/article/list');
        }
      });
    } else {
      router.replace('/article/list');
    }
  }

  render() {
    const { id, title, text } = this.state;

    const titleContent = (
      <div style={{display: 'flex'}}>
        <Link to="/article/list" style={{ flex: 1 }}>
          <Button icon="undo" >
            返回
          </Button>
        </Link>
        <h1 style={{ flex: 6, overflow: 'hidden', textAlign: 'center', marginBottom: '0' }}>{title}</h1>
        <Link to={`/article/edit/${id}`} style={{ flex: 1 }}>
          <Button icon="edit" style={{float: 'right'}}>
            编辑
          </Button>
        </Link>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={titleContent} >
          <div style={{ margin: '20px' }}>
            <Markdown source={text} escapeHtml={false} className={styles.htmlContainer}/>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Read;
