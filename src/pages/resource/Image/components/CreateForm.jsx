import { Modal, Upload, Icon, message } from 'antd';
import React, { Component } from 'react';

class CreateForm extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  onChange = ({ file, fileList }) => {
    this.setState({
      fileList,
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
    const paramsList = fileList
      .filter(file => file.status === 'done' && file.response.success)
      .map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.response.data,
      }));
    onSubmit(paramsList).then(() => {
      this.setState({ fileList: [] });
    });
  };

  handlePreviewCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (file.status !== 'done' || !file.response.success) return;

    this.setState({
      previewImage: file.response.data,
      previewVisible: true,
    });
  };

  render() {
    const { modalVisible, onCancel } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        title="新增图片"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => onCancel()}
      >
        <Upload
          name="img"
          action="/api/oss/img"
          listType="picture-card"
          accept="image/*"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.onChange}
        >
          {fileList.length >= 12 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    );
  }
}

export default CreateForm;
