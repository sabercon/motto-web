import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Motto Log</span>
              </Link>
            </div>
            <div className={styles.desc}>Motto Log 是一个可以记录和分享个人生活的网站</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright="2020 SaberCon 个人网站出品"
          links={[
            {
              key: 'motto-web',
              title: 'motto-web',
              href: 'https://github.com/SaberCon/motto-web',
              blankTarget: true,
            },
            {
              key: 'SaberCon',
              title: <Icon type="github" />,
              href: 'https://github.com/SaberCon',
              blankTarget: true,
            },
            {
              key: 'motto',
              title: 'motto',
              href: 'https://github.com/SaberCon/motto',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
