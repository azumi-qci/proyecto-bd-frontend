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

const DeliveryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idrepartidor: 0,
    nombre: '',
    turno: undefined,
    idvehiculo: '',
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idrepartidor',
      key: 'idrepartidor',
    },
    {
      title: 'Nombre del repartidor',
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
      title: 'Numero de vehículo',
      dataIndex: 'idvehiculo',
      key: 'idvehiculo',
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
            onConfirm={() => handleClickDelete(record.idrepartidor)}
            title='Está a punto de eliminar esta fila, ¿desea continuar?'
          >
            <Button danger={true}>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getAllRecords();
  }, []);

  useEffect(() => {
    document.title = `Repartidores | ${APP_NAME}`;
  }, []);

  const getAllRecords = () => {
    api
      .get('/repartidores')
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
    const { nombre, turno, idvehiculo } = newRow;

    if (!nombre || isNaN(turno) || !idvehiculo) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .post('/repartidores', {
        nombre,
        turno,
        idvehiculo,
      })
      .then((response) => {
        setShowModal(false);
        message.success('El registro fue insertado correctamente');

        setData([
          ...data,
          {
            idrepartidor: response.data.idrepartidor,
            nombre,
            turno,
            idvehiculo,
          },
        ]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al insertar el registro');
      })
      .finally(() => setSending(false));
  };

  const handleClickDelete = (idrepartidor) => {
    api
      .delete(`/repartidores/${idrepartidor}`)
      .then(() => {
        // Get a copy of the rows
        const temp = [...data].filter(
          (item) => item.idrepartidor !== idrepartidor
        );

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
    const { idrepartidor, nombre, turno, idvehiculo } = newRow;

    if (!nombre || isNaN(turno) || !idvehiculo) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .put(`/repartidores/${idrepartidor}`, {
        nombre,
        turno,
        idvehiculo,
      })
      .then(() => {
        let temp = [...data];

        const index = temp.findIndex(
          (item) => item.idrepartidor === idrepartidor
        );

        if (index > -1) {
          temp.splice(index, 1, {
            idrepartidor,
            nombre,
            turno,
            idvehiculo,
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
      idrepartidor: 0,
      nombre: '',
      turno: undefined,
      idvehiculo: '',
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
            placeholder='Ingresar nombre del repartidor'
            value={newRow.nombre}
            onChange={(event) =>
              setNewRow({ ...newRow, nombre: event.currentTarget.value })
            }
          />

          <Select
            disabled={sending}
            className='full-width'
            onChange={(value) => setNewRow({ ...newRow, turno: value })}
            placeholder='Ingrese turno'
            value={newRow.turno}
          >
            <Option value={0}>Matutino</Option>
            <Option value={1}>Vespertino</Option>
          </Select>
          <Input
            disabled={sending}
            placeholder='Ingresar número de vehículo'
            value={newRow.idvehiculo}
            onChange={(event) =>
              setNewRow({ ...newRow, idvehiculo: event.currentTarget.value })
            }
          />
        </Space>
      </Modal>
    </>
  );
};

export default DeliveryPage;
