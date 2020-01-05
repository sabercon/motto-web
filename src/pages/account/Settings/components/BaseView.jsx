import { Button, Form, Input, Select, Upload, Radio, Icon, DatePicker, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import GeographicView from './GeographicView';
import styles from './BaseView.less';
import provinces from '../geographic/province.json';
import cities from '../geographic/city.json';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, onChange, fileList }) => (
  <Fragment>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload
      fileList={fileList}
      name="img"
      action="/api/oss/img"
      accept=".bmp,.gif,.jpg,.jpeg,.png,.svg,.tiff,.webp"
      onChange={onChange}
      showUploadList={false}
    >
      <div className={styles.button_view}>
        <Button icon="upload">更换头像</Button>
      </div>
    </Upload>
  </Fragment>
);

class BaseView extends Component {
  state = {
    avatar: '',
    fileList: [],
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      const obj = {};
      Object.keys(form.getFieldsValue()).forEach(key => {
        obj[key] = currentUser[key] || null;
        if (key === 'birthday' && currentUser[key]) {
          obj[key] = moment(currentUser[key]);
        }
      });
      // 根据省市获取地址
      const currentProvince = provinces.find(e => e.name === currentUser.province) || {};
      const province = { key: currentProvince.id, label: currentProvince.name };
      const currentCity =
        Object.values(cities)
          .flat()
          .find(e => e.name === currentUser.city) || {};
      const city = { key: currentCity.id, label: currentCity.name };
      obj.address = { province, city };

      form.setFieldsValue(obj);
      this.setState({
        avatar: currentUser.avatar || '',
      });
    }
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    const { avatar } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const { province, city } = values.address;
        dispatch({
          type: 'accountSettings/update',
          payload: {
            ...values,
            avatar,
            province: province ? province.label : null,
            city: city ? city.label : null,
            address: '', // 地址置空防止form上传对象报错
            birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
          },
        });
      }
    });
  };

  uploadAvatar = ({ file, fileList }) => {
    this.setState({
      fileList: [...fileList],
    });
    if (file.status !== 'done') return;
    if (file.response.success) {
      this.setState({
        avatar: file.response.data,
      });
      message.success('头像上传成功！');
    } else {
      message.error('头像上传失败！');
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { avatar, fileList } = this.state;
    return (
      <div className={styles.baseView}>
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
              })(<Input placeholder="请输入用户昵称！" />)}
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
                </Radio.Group>
              )}
            </FormItem>
            <FormItem label="出生日期">
              {getFieldDecorator('birthday')(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
            <FormItem label="国家/地区">
              {getFieldDecorator('country')(
                <Select>
                  <Option value="中国">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="所在省市">{getFieldDecorator('address')(<GeographicView />)}</FormItem>
            <Button type="primary" onClick={this.handlerSubmit} loading={loading}>
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={avatar} onChange={this.uploadAvatar} fileList={fileList} />
        </div>
      </div>
    );
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.accountSettings,
}))(Form.create()(BaseView));
