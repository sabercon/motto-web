import { Form, Input, Modal } from 'antd';
import React from 'react';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props;

  const okHandle = () => {
    form.validateFields((err, values) => {
      if (err) return;
      form.resetFields();
      handleAdd(values);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新增文件"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="名称"
      >
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '文件名称不能为空！',
            },
          ],
        })(<Input placeholder="请输入文件名称" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
