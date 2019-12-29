import { Button, Form, Input, Select, Upload, Radio, Icon, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import GeographicView from './GeographicView';
import styles from './BaseView.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">更换头像</Button>
      </div>
    </Upload>
  </Fragment>
);

// TODO: 要修改后端数据结构
const getAddress = values => {
  let address = values.country ? values.country : '';
  if (values.address) {
    address += '-' + (values.address.province ? values.address.province.label : '');
    address += '-' + (values.address.city ? values.address.city.label : '');
  } else {
    address += '--';
  }
  return address;
};

class BaseView extends Component {
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        if(key === 'birthday' && currentUser[key]) {
          obj[key] = moment(currentUser[key]);
        }
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser && currentUser.avatar) {
      return currentUser.avatar;
    }
    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'accountSettings/update',
          payload: {
            ...values,
            address: getAddress(values),
            birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="昵称">
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: '昵称不能为空！',
                  },
                ],
              })(<Input placeholder="请输入用户昵称" />)}
            </FormItem>
            <FormItem label="个人简介">
              {getFieldDecorator('profile')(<Input.TextArea placeholder="个人简介" rows={4} />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <Radio.Group>
                  <Radio value={1} className={styles.gender_radio}>
                    <Icon type="man" style={{ color: 'blue', marginRight: '10px' }} />
                    小哥哥
                  </Radio>
                  <Radio value={2} className={styles.gender_radio}>
                    <Icon type="woman" style={{ color: 'deepPink', marginRight: '10px' }} />
                    小姐姐
                  </Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="出生日期">{getFieldDecorator('birthday')(<DatePicker format="YYYY-MM-DD"/>)}</FormItem>
            <FormItem label="国家/地区">
              {getFieldDecorator('country')(
                <Select>
                  <Option value="中国">中国</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="所在省市">{getFieldDecorator('address')(<GeographicView />)}</FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Form.create()(BaseView));
