import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { get } from '@/services/article';
import { router, Link } from 'umi';
import Markdown from 'react-markdown/with-html';

class Read extends Component {
  state = {
    id: null,
    title: null,
    type: null,
    text: null,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id && id.match(/^\d+$/)) {
      get({ id }).then(response => {
        if (response.success && response.data) {
          const { title, type, text } = response.data;
          this.setState({
            id,
            title,
            type,
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

  preview = e => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }
    window.previewWindow = window.open();
    window.previewWindow.document.write(this.buildPreviewHtml(e));
    window.previewWindow.document.close();
  };

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.props.form.getFieldValue('html') &&
            this.props.form.getFieldValue('html').toHTML()}</div>
        </body>
      </html>
    `;
  }

  render() {
    const { id, title, type, text } = this.state;

    const titleContent = (
      <div style={{display: 'flex'}}>
        <Link to="/article/list" style={{ flex: 1 }}>
          <Button icon="undo" >
            返回
          </Button>
        </Link>
        <h1 style={{ flex: 6, overflow: 'hidden', textAlign: 'center' }}>{title}</h1>
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
            {type === 'markdown' && <Markdown source={text} escapeHtml={false} />}
            {type === 'markdown' && <Markdown source={text} escapeHtml={false} />}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Read;
