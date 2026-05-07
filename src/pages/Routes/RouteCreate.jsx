import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { routeApi } from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

const RouteCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const difficultyOptions = [
    { value: 'EASY', label: '简单' },
    { value: 'MEDIUM', label: '中等' },
    { value: 'HARD', label: '困难' }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await routeApi.createRoute(values);
      message.success('路线创建成功');
      navigate('/routes');
    } catch (error) {
      console.error('创建路线失败:', error);
      message.error('创建路线失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>创建骑行路线</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="路线名称"
          rules={[{ required: true, message: '请输入路线名称' }]}
        >
          <Input placeholder="请输入路线名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="路线描述"
        >
          <TextArea rows={4} placeholder="请输入路线描述" />
        </Form.Item>

        <Form.Item
          name="startPoint"
          label="起点"
          rules={[{ required: true, message: '请输入起点' }]}
        >
          <Input placeholder="请输入起点（格式：lat,lng）" />
        </Form.Item>

        <Form.Item
          name="endPoint"
          label="终点"
          rules={[{ required: true, message: '请输入终点' }]}
        >
          <Input placeholder="请输入终点（格式：lat,lng）" />
        </Form.Item>

        <Form.Item
          name="distance"
          label="距离（公里）"
          rules={[{ required: true, message: '请输入距离' }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="请输入距离" />
        </Form.Item>

        <Form.Item
          name="duration"
          label="预计时长（分钟）"
          rules={[{ required: true, message: '请输入预计时长' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入预计时长" />
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="难度"
          rules={[{ required: true, message: '请选择难度' }]}
        >
          <Select placeholder="请选择难度">
            {difficultyOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="elevationGain"
          label="总爬升高度（米）"
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入总爬升高度" />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            提交
          </Button>
          <Button onClick={() => navigate('/routes')}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RouteCreate;