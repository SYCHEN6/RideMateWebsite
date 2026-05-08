import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Chat from './pages/Chat';
import RouteList from './pages/Routes/RouteList';
import RouteCreate from './pages/Routes/RouteCreate';
import RouteDetail from './pages/Routes/RouteDetail';
import KnowledgeList from './pages/Knowledge/KnowledgeList';
import KnowledgeUpload from './pages/Knowledge/KnowledgeUpload';
import KnowledgeDetail from './pages/Knowledge/KnowledgeDetail';
import Navbar from './components/Navbar';
import './styles/App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Navbar />
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/routes" element={<RouteList />} />
            <Route path="/routes/create" element={<RouteCreate />} />
            <Route path="/routes/:id" element={<RouteDetail />} />
            <Route path="/knowledge" element={<KnowledgeList />} />
            <Route path="/knowledge/upload" element={<KnowledgeUpload />} />
            <Route path="/knowledge/documents/:id" element={<KnowledgeDetail />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
