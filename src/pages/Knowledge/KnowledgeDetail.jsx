import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Descriptions } from 'antd';
import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { knowledgeApi } from '../../services/api';

const KnowledgeDetail = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocumentDetail();
  }, [id]);

  const fetchDocumentDetail = async () => {
    setLoading(true);
    try {
      const data = await knowledgeApi.getDocumentById(id);
      setDocument(data);
    } catch (error) {
      console.error('获取文档详情失败:', error);
      message.error('获取文档详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await knowledgeApi.deleteDocument(id);
      message.success('文档删除成功');
      navigate('/knowledge');
    } catch (error) {
      console.error('删除文档失败:', error);
      message.error('删除文档失败');
    }
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'equipment': '骑行装备',
      'safety': '骑行安全',
      'maintenance': '维修保养',
      'training': '骑行训练'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return <Spin style={{ display: 'block', marginTop: '50px', textAlign: 'center' }} />;
  }

  if (!document) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>文档不存在</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/knowledge')}
        style={{ marginBottom: 16 }}
      >
        返回文档列表
      </Button>

      <Card
        title={document.title}
        extra={
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            删除
          </Button>
        }
      >
        <Descriptions bordered>
          <Descriptions.Item label="分类" span={2}>{getCategoryText(document.category)}</Descriptions.Item>
          <Descriptions.Item label="来源" span={2}>{document.source}</Descriptions.Item>
          <Descriptions.Item label="文件类型" span={2}>{document.fileType}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>{new Date(document.createTime).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="更新时间" span={2}>{new Date(document.updateTime).toLocaleString()}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h4>文档内容</h4>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{document.content}</div>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetail;