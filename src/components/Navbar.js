import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  InboxOutlined,
  FileMarkdownFilled,
  UserOutlined,
  IdcardOutlined,
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
      theme='dark'
    >
      <Menu.Item key='cashier' icon={<FileMarkdownFilled />}>
        <Link to='/'>Empleados</Link>
      </Menu.Item>
      <Menu.Item key='clients' icon={<UserOutlined />}>
        <Link to='/clients'>Clientes</Link>
      </Menu.Item>
      <Menu.Item key='packages' icon={<InboxOutlined />}>
        <Link to='/packages'>Paquetes</Link>
      </Menu.Item>
      <Menu.Item key='delivery' icon={<IdcardOutlined />}>
        <Link to='/delivery'>Repartidorres</Link>
      </Menu.Item>
      <Menu.Item key='business' icon={<IdcardOutlined />}>
        <Link to='/business'>Empresas externas</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
