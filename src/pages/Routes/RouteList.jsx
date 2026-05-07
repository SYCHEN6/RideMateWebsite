import React, { useState, useEffect } from 'react';
import { Card, List, Button, Empty, Spin } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { routeApi } from '../../services/api';
import './Routes.css';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await routeApi.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('获取路线列表失败:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="route-list">
      <div className="route-list-header">
        <h2>骑行路线</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/routes/create">创建路线</Link>
        </Button>
      </div>

      <Spin spinning={loading}>
        {routes.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 1, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={routes}
            renderItem={route => (
              <List.Item>
                <Card
                  title={route.name}
                  hoverable
                  extra={<Link to={`/routes/${route.id}`}><EyeOutlined /></Link>}
                >
                  <p>起点: {route.startPoint}</p>
                  <p>终点: {route.endPoint}</p>
                  <p>距离: {route.distance} 公里</p>
                  <p>时长: {route.duration} 分钟</p>
                  <p>难度: {getDifficultyText(route.difficulty)}</p>
                  <p>创建时间: {new Date(route.createTime).toLocaleString()}</p>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无路线数据" />
        )}
      </Spin>
    </div>
  );
};

export default RouteList;