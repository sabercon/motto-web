import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';
import styles from './style.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="motto log 现已发布，有任何问题可联系作者"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/SaberCon/motto">
          本项目后端 github 地址
        </a>
      </Typography.Text>
      <CodePreview> https://github.com/SaberCon/motto</CodePreview>
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/SaberCon/motto-web"
        >
          本项目前端 github 地址
        </a>
      </Typography.Text>
      <CodePreview> https://github.com/SaberCon/motto-web</CodePreview>
    </Card>
    <p
      style={{
        textAlign: 'center',
        marginTop: 24,
      }}
    >
      This is the github address of the author{' '}
      <a href=" https://github.com/SaberCon" target="_blank" rel="noopener noreferrer">
        SaberCon
      </a>
      。
    </p>
  </PageHeaderWrapper>
);
