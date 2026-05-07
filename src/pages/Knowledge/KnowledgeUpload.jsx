import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { knowledgeApi } from '../../services/api';

const { Option } = Select;

const KnowledgeUpload = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { value: 'equipment', label: '骑行装备' },
    { value: 'safety', label: '骑行安全' },
    { value: 'maintenance', label: '维修保养' },
    { value: 'training', label: '骑行训练' }
  ];

  const handleUpload = async () => {
    const values = await form.validateFields();
    if (fileList.length === 0) {
      message.error('请选择要上传的文件');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);
      formData.append('title', values.title);
      formData.append('category', values.category);

      await knowledgeApi.uploadDocument(formData);
      message.success('文档上传成功');
      navigate('/knowledge');
    } catch (error) {
      console.error('上传文档失败:', error);
      message.error('上传文档失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>上传知识库文档</h2>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="文档标题"
          rules={[{ required: true, message: '请输入文档标题' }]}
        >
          <Input placeholder="请输入文档标题" />
        </Form.Item>

        <Form.Item
          name="category"
          label="文档分类"
          rules={[{ required: true, message: '请选择文档分类' }]}
        >
          <Select placeholder="请选择文档分类">
            {categories.map(category => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="file"
          label="文档文件"
          rules={[{ required: true, message: '请选择要上传的文件' }]}
        >
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // 手动上传
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleUpload} loading={loading} style={{ marginRight: 8 }}>
            上传
          </Button>
          <Button onClick={() => navigate('/knowledge')}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default KnowledgeUpload;