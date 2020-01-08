import { Button, Divider, Dropdown, Form, Icon, Menu, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { save, del, list } from '@/services/file';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await save(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await Promise.all(selectedRows.map(row => del({ id: row.id })));
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const showDeleteConfirm = (record, actionRef) => {
  Modal.confirm({
    title: '你确定要删除文件吗',
    content: '删除文件后无法恢复',
    okType: 'danger',
    onOk() {
      handleRemove([record]).then(success => {
        if (success && actionRef.current) {
          actionRef.current.reload();
        }
      })
    },
  });
};

const handleQuery = rawParams => {
  const params = {
    pageNum: rawParams.current - 1,
    pageSize: rawParams.pageSize,
    fuzzyValue: rawParams.name || undefined,
  };
  return list(params).then(response => {
    if (response.success) {
      const pageResult = {
        data: response.data.list,
        success: true,
        total: response.data.totalNum,
      };
      return pageResult;
    }
    return false;
  });
}

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      hideInSearch: true,
      renderText: val => `${(val / 1000000).toFixed(3)} Mb`,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a href={record.url}>下载</a>
          <Divider type="vertical" />
          <a
            style={{color: 'red'}}
            onClick={() => showDeleteConfirm(record, actionRef)}
          >
            删除
          </a>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="文件列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={(selectedRowKeys, selectedRows) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
            <span>
              文件大小总计{' '}
              {(selectedRows.reduce((pre, item) => pre + item.size, 0) / 1000000).toFixed(3)} Mb
            </span>
          </div>
        )}
        request={params => handleQuery(params)}
        columns={columns}
        rowSelection={{}}
        pagination={{
          showSizeChanger: true,
        }}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create()(TableList);
