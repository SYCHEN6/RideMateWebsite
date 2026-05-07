import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/routes',
      label: <Link to="/routes">路线管理</Link>,
    },
    {
      key: '/knowledge',
      label: <Link to="/knowledge">知识库</Link>,
    },
  ];

  return (
    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '90%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          <Link to="/" style={{ color: '#1890ff', textDecoration: 'none' }}>RideMate</Link>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderBottom: 0, flex: 1, justifyContent: 'center' }}
        />
        <div style={{ width: '100px' }}></div>
      </div>
    </Header>
  );
};

export default Navbar;