import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  ExperimentOutlined,
  FormOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState('users');

  const handleClickNavbarItem = (event) => {
    setSelectedItem(event.key);
  };

  return (
    <Menu
      mode='horizontal'
      selectedKeys={[selectedItem]}
      onClick={handleClickNavbarItem}
    >
      <Menu.Item key='users' icon={<FormOutlined />}>
        <Link to='/'>Usuarios</Link>
      </Menu.Item>
      <Menu.Item key='clients' icon={<UserOutlined />}>
        <Link to='/clients'>Clientes</Link>
      </Menu.Item>
      <Menu.Item key='employees' icon={<ExperimentOutlined />}>
        <Link to='/employees'>Empleados</Link>
      </Menu.Item>
      <Menu.Item key='shipping' icon={<SendOutlined />}>
        <Link to='/shipping'>Envíos</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
