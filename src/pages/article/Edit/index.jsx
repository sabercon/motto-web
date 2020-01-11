import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import { Form, Input, Button, Card, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const FormItem = Form.Item;

class Edit extends Component {
  state = {
    type: 'html',
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.form.setFieldsValue({
        text: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'),
      });
    }, 1000);
  }

  handleSubmit = event => {
    event.preventDefault();

    this.props.form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          const submitData = {
            title: values.title,
            text: values.text.toRAW(),
            rawJson: values.text.toRAW(true),
          };
          console.log(submitData);
        }
      },
    );
  };

  render() {
    const { form } = this.props;
    const { type } = this.state;
    const { getFieldDecorator } = form;
    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
      'media',
    ];

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form
            hideRequiredMark
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            style={{
              marginTop: 8,
            }}
          >
            <FormItem label="文章标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              })(<Input size="large" placeholder="请输入标题" />)}
            </FormItem>
            <FormItem label="文章备注">
              {getFieldDecorator('note')(<Input size="large" placeholder="可输入备注" />)}
            </FormItem>
            <FormItem label="文章类型">
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: '请选择类型',
                  },
                ],
              })(
                <Radio.Group
                  value={type}
                  onChange={e => {
                    this.setState({ type: e.target.value });
                  }}
                >
                  <Radio.Button value="html">Html富文本</Radio.Button>
                  <Radio.Button value="markdown">Markdown文本</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem
              label="文章正文"
              labelCol={{
                xs: {
                  span: 24,
                },
                sm: {
                  span: 7,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 24,
                },
                sm: {
                  span: 22,
                  offset: 1,
                },
                md: {
                  span: 22,
                  offset: 1,
                },
              }}
            >
              { getFieldDecorator('html', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <BraftEditor
                  className="my-editor"
                  controls={controls}
                  placeholder="请输入正文内容"
                  style={{ border: '1px solid #d9d9d9', borderRadius: '4px', marginTop: '16px' }}
                />,
              )}
            </FormItem>
            <FormItem {...submitFormLayout}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                style={{
                  marginLeft: 8,
                }}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Edit);
