import React, { useEffect, useState } from 'react';
import { Table, message, Space, Button, Modal, Input, Popconfirm } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import api from '../api';

import { APP_NAME } from '../app.config';

import '../styles/general.css';

const BusinessPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idempresa: 0,
    nombre: '',
    nombreRepresentante: '',
    telefono: '',
    idvehiculo: '',
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idempresa',
      key: 'idempresa',
    },
    {
      title: 'Nombre de la empresa',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Nombre del representante',
      dataIndex: 'nombre_representante',
      key: 'nombre_representante',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Número de vehículo',
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
            onConfirm={() => handleClickDelete(record.idempresa)}
            title='Está a punto de eliminar esta fila, ¿desea continuar?'
          >
            <Button danger={true}>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getAllClients();
  }, []);

  useEffect(() => {
    document.title = `Empresas externas | ${APP_NAME}`;
  }, []);

  const getAllClients = () => {
    api
      .get('/empresas')
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
    const { nombre, nombreRepresentante, telefono, idvehiculo } = newRow;

    if (!nombre || !nombreRepresentante || !telefono || !idvehiculo) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .post('/empresas', {
        nombre,
        nombreRepresentante,
        telefono,
        idvehiculo,
      })
      .then((response) => {
        setShowModal(false);
        message.success('El registro fue insertado correctamente');

        setData([
          ...data,
          {
            idempresa: response.data.idempresa,
            nombre,
            nombre_representante: nombreRepresentante,
            telefono,
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

  const handleClickDelete = (idempresa) => {
    api
      .delete(`/empresas/${idempresa}`)
      .then(() => {
        // Get a copy of the rows
        const temp = [...data].filter((item) => item.idempresa !== idempresa);

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
      nombreRepresentante: record['nombre_representante'],
    });

    setShowModal(true);
  };

  const saveChanges = () => {
    const { idempresa, nombre, nombreRepresentante, telefono, idvehiculo } =
      newRow;

    if (!nombre || !nombreRepresentante || !telefono || !idvehiculo) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .put(`/empresas/${idempresa}`, {
        nombre,
        nombreRepresentante,
        telefono,
        idvehiculo,
      })
      .then(() => {
        let temp = [...data];

        const index = temp.findIndex((item) => item.idempresa === idempresa);

        if (index > -1) {
          temp.splice(index, 1, {
            idempresa,
            nombre,
            nombre_representante: nombreRepresentante,
            telefono,
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
      idempresa: 0,
      nombre: '',
      nombreRepresentante: '',
      telefono: '',
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
            placeholder='Ingresar nombre de la empresa'
            value={newRow.nombre}
            onChange={(event) =>
              setNewRow({ ...newRow, nombre: event.currentTarget.value })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar nombre del representante'
            value={newRow.nombreRepresentante}
            onChange={(event) =>
              setNewRow({
                ...newRow,
                nombreRepresentante: event.currentTarget.value,
              })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar número telefónico'
            value={newRow.telefono}
            onChange={(event) =>
              setNewRow({ ...newRow, telefono: event.currentTarget.value })
            }
          />
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

export default BusinessPage;
