import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  ExperimentOutlined,
  FormOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState('users');

  const handleClickNavbarItem = (event) => {
    // TODO: Navigate to the page
    setSelectedItem(event.key);
  };

  return (
    <Menu
      mode='horizontal'
      selectedKeys={[selectedItem]}
      onClick={handleClickNavbarItem}
    >
      <Menu.Item key='users' icon={<FormOutlined />}>
        Usuarios
      </Menu.Item>
      <Menu.Item key='clients' icon={<UserOutlined />}>
        Clientes
      </Menu.Item>
      <Menu.Item key='employees' icon={<ExperimentOutlined />}>
        Empleados
      </Menu.Item>
      <Menu.Item key='shipping' icon={<SendOutlined />}>
        Envíos
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
