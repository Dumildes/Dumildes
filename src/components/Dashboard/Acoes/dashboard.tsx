import React from 'react';
import './dashboard.css'
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', marginTop: '60px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

