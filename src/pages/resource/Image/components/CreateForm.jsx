import { Modal, Upload, Icon, message } from 'antd';
import React, { Component } from 'react';

const { Dragger } = Upload;

class CreateForm extends Component {
  state = {
    fileList: [],
  };

  onChange = ({ file, fileList }) => {
    this.setState({
      fileList: [...fileList],
    });
    const { status } = file;
    if (status === 'done' && file.response.success) {
      message.success(` ${file.name} 图片上传成功！`);
    } else if (status === 'error') {
      message.error(` ${file.name} 图片上传失败！`);
    }
  };

  okHandle = () => {
    const { onSubmit } = this.props;
    const { fileList } = this.state;
    const paramsList = fileList.filter(file => file.status === 'done' && file.response.success).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.response.data,
    }));
    onSubmit(paramsList).then(() => {
      this.setState({ fileList: [] });
    });
  };

  render() {
    const { modalVisible, onCancel } = this.props;
    const { fileList } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新增图片"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => onCancel()}
      >
        <Dragger
          name="file"
          multiple
          action="/api/oss/file"
          fileList={fileList}
          onChange={this.onChange}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击此处或拖拽文件到此处实现上传</p>
          <p className="ant-upload-hint">
            支持多文件上传，注意不要上传超过100MB的文件
          </p>
        </Dragger>
      </Modal>
    );
  }
}

export default CreateForm;
