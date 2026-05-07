import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Descriptions } from 'antd';
import { EditOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { routeApi } from '../../services/api';

const RouteDetail = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRouteDetail();
  }, [id]);

  const fetchRouteDetail = async () => {
    setLoading(true);
    try {
      const data = await routeApi.getRouteById(id);
      setRoute(data);
    } catch (error) {
      console.error('获取路线详情失败:', error);
      message.error('获取路线详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await routeApi.deleteRoute(id);
      message.success('路线删除成功');
      navigate('/routes');
    } catch (error) {
      console.error('删除路线失败:', error);
      message.error('删除路线失败');
    }
  };

  const getDifficultyText = (difficulty) => {
    const difficultyMap = {
      'EASY': '简单',
      'MEDIUM': '中等',
      'HARD': '困难'
    };
    return difficultyMap[difficulty] || difficulty;
  };

  if (loading) {
    return <Spin style={{ display: 'block', marginTop: '50px', textAlign: 'center' }} />;
  }

  if (!route) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>路线不存在</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/routes')}
        style={{ marginBottom: 16 }}
      >
        返回路线列表
      </Button>

      <Card
        title={route.name}
        extra={
          <div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => navigate(`/routes/edit/${id}`)}
            >
              编辑
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              删除
            </Button>
          </div>
        }
      >
        <Descriptions bordered>
          <Descriptions.Item label="起点">{route.startPoint}</Descriptions.Item>
          <Descriptions.Item label="终点">{route.endPoint}</Descriptions.Item>
          <Descriptions.Item label="距离" span={2}>{route.distance} 公里</Descriptions.Item>
          <Descriptions.Item label="预计时长">{route.duration} 分钟</Descriptions.Item>
          <Descriptions.Item label="难度">{getDifficultyText(route.difficulty)}</Descriptions.Item>
          <Descriptions.Item label="总爬升高度" span={2}>{route.elevationGain || 0} 米</Descriptions.Item>
          <Descriptions.Item label="创建者ID" span={2}>{route.creatorId}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>{new Date(route.createTime).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="更新时间" span={2}>{new Date(route.updateTime).toLocaleString()}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h4>路线描述</h4>
          <p>{route.description || '暂无描述'}</p>
        </div>
      </Card>
    </div>
  );
};

export default RouteDetail;