import React, { useEffect, useState } from 'react';
import {
  Table,
  message,
  Space,
  Button,
  Modal,
  Input,
  Select,
  Popconfirm,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import api from '../api';

import { APP_NAME } from '../app.config';

import '../styles/general.css';

const { Option } = Select;

const EmployeesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idempleado: 0,
    nombre: '',
    turno: undefined,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idempleado',
      key: 'idempleado',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Turno',
      dataIndex: 'turno',
      key: 'turno',
      render: (text) => {
        if (text === 0) {
          return <>Matutino</>;
        } else {
          return <>Vespertino</>;
        }
      },
    },
    {
      title: 'Acción',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handleClickEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            cancelText='Cancelar'
            okText='Eliminar'
            onConfirm={() => handleClickDelete(record.idempleado)}
            title='Está a punto de eliminar esta fila, ¿desea continuar?'
          >
            <Button danger={true}>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getAllEmpleados();
  }, []);

  useEffect(() => {
    document.title = `Empleados | ${APP_NAME}`;
  }, []);

  const getAllEmpleados = () => {
    api
      .get('/empleados')
      .then((response) => {
        setData([...response.data]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al obtener la información');
      })
      .finally(() => setLoading(false));
  };

  const handleClickAdd = () => {
    const { nombre, turno } = newRow;

    if (!nombre || isNaN(turno)) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .post('/empleados', {
        nombre,
        turno,
      })
      .then((response) => {
        setShowModal(false);
        message.success('El registro fue insertado correctamente');

        setData([
          ...data,
          {
            idempleado: response.data.idempleado,
            nombre,
            turno,
          },
        ]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al insertar el registro');
      })
      .finally(() => setSending(false));
  };

  const handleClickDelete = (idempleado) => {
    api
      .delete(`/empleados/${idempleado}`)
      .then(() => {
        // Get a copy of the rows
        const temp = [...data].filter((item) => item.idempleado !== idempleado);

        setData([...temp]);

        message.success('La fila fue eliminada correctamente');
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al eliminar la fila');
      });
  };

  const handleClickEdit = (record) => {
    setModalMode('edit');

    setNewRow({
      ...record,
    });

    setShowModal(true);
  };

  const saveChanges = () => {
    const { idempleado, nombre, turno } = newRow;

    if (!nombre || isNaN(turno)) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .put(`/empleados/${idempleado}`, {
        nombre,
        turno,
      })
      .then(() => {
        let temp = [...data];

        const index = temp.findIndex((item) => item.idempleado === idempleado);

        if (index > -1) {
          temp.splice(index, 1, {
            idempleado,
            nombre,
            turno,
          });

          setData([...temp]);

          message.success('La fila fue actualizada correctamente');
        } else {
          message.error('Error desconocido');
          console.log('El registro no fue encontrado... WTF');
        }

        setShowModal(false);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al actualizar los datos');
      })
      .finally(() => setSending(false));
  };

  const resetValues = () => {
    setNewRow({
      idempleado: 0,
      nombre: '',
      turno: undefined,
    });
  };

  return (
    <>
      <div className='main-container'>
        <Space direction='vertical' size='middle' className='full-width'>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setModalMode('add');
              setShowModal(true);
            }}
            type='primary'
          >
            Nuevo registro
          </Button>
          <Table loading={loading} columns={columns} dataSource={data} />
        </Space>
      </div>
      {/* Add new row modal */}
      <Modal
        afterClose={resetValues}
        cancelText='Cancelar'
        confirmLoading={sending}
        okText={modalMode === 'add' ? 'Agregar' : 'Guardar cambios'}
        onCancel={() => setShowModal(false)}
        onOk={modalMode === 'add' ? handleClickAdd : saveChanges}
        title={
          modalMode === 'add' ? 'Agregar nuevo registro' : 'Editar registro'
        }
        visible={showModal}
      >
        <Space direction='vertical' size='middle' className='full-width'>
          <Input
            disabled={sending}
            placeholder='Ingresar nombre'
            value={newRow.nombre}
            onChange={(event) =>
              setNewRow({ ...newRow, nombre: event.currentTarget.value })
            }
          />
          <Select
            disabled={sending}
            className='full-width'
            onChange={(value) => setNewRow({ ...newRow, turno: value })}
            placeholder='Seleccionar turno'
            value={newRow.turno}
          >
            <Option value={0}>Matutino</Option>
            <Option value={1}>Vespertino</Option>
          </Select>
        </Space>
      </Modal>
    </>
  );
};

export default EmployeesPage;
