import React, { useState, useEffect } from 'react';
import { Card, List, Button, Empty, Spin, Select } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { knowledgeApi } from '../../services/api';

const { Option } = Select;

const KnowledgeList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '', label: '全部' },
    { value: 'equipment', label: '骑行装备' },
    { value: 'safety', label: '骑行安全' },
    { value: 'maintenance', label: '维修保养' },
    { value: 'training', label: '骑行训练' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedCategory) {
        data = await knowledgeApi.getDocumentsByCategory(selectedCategory);
      } else {
        data = await knowledgeApi.getAllDocuments();
      }
      setDocuments(data);
    } catch (error) {
      console.error('获取文档列表失败:', error);
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0, marginRight: 20 }}>骑行知识库</h2>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 150 }}
            placeholder="筛选分类"
          >
            {categories.map(category => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" icon={<UploadOutlined />}>
          <Link to="/knowledge/upload">上传文档</Link>
        </Button>
      </div>

      <Spin spinning={loading}>
        {documents.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 1, xs: 1, sm: 2, md: 3 }}
            dataSource={documents}
            renderItem={document => (
              <List.Item>
                <Card
                  title={document.title}
                  hoverable
                  extra={<Link to={`/knowledge/documents/${document.id}`}><EyeOutlined /></Link>}
                >
                  <p>分类: {getCategoryText(document.category)}</p>
                  <p>来源: {document.source}</p>
                  <p>类型: {document.fileType}</p>
                  <p>创建时间: {new Date(document.createTime).toLocaleString()}</p>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无文档数据" />
        )}
      </Spin>
    </div>
  );
};

export default KnowledgeList;