import React, { useEffect, useState } from 'react';
import {
  Table,
  message,
  Space,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Popconfirm,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import api from '../api';

import '../styles/Clients.page.css';

const { Option } = Select;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [newRow, setNewRow] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    curp: '',
    genero: null,
    fechaNacimiento: '',
  });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'CURP',
      dataIndex: 'curp',
      key: 'curp',
    },
    {
      title: 'Género',
      dataIndex: 'genero',
      key: 'genero',
      render: (text) => {
        if (text === 0) {
          return <p>Masculino</p>;
        } else if (text === 1) {
          return <p>Femenino</p>;
        }

        return <p>Sin definir</p>;
      },
    },
    {
      title: 'Fecha de nacimiento',
      dataIndex: 'fecha_nacimiento',
      key: 'fecha_nacimiento',
      render: (text) => <p>{new Date(text).toLocaleDateString()}</p>,
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
            onConfirm={() => handleClickDelete(record.idcliente)}
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

  const getAllClients = () => {
    api
      .get('/clientes')
      .then((response) => {
        setClients([...response.data]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al obtener la información');
      });
  };

  const handleClickAdd = () => {
    const { nombre, direccion, telefono, curp, genero, fechaNacimiento } =
      newRow;

    if (
      !nombre ||
      !direccion ||
      !telefono ||
      !curp ||
      isNaN(genero) ||
      !fechaNacimiento
    ) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .post('/clientes', {
        nombre,
        direccion,
        telefono,
        curp,
        genero,
        fechaNacimiento,
      })
      .then((response) => {
        setShowModal(false);
        message.success('El registro fue insertado correctamente');

        setClients([
          ...clients,
          {
            idcliente: response.data.idcliente,
            nombre,
            direccion,
            telefono,
            curp,
            genero,
            fecha_nacimiento: fechaNacimiento,
          },
        ]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al insertar el registro');
      })
      .finally(() => setSending(false));
  };

  const handleClickDelete = (idcliente) => {
    api
      .delete(`/clientes/${idcliente}`)
      .then(() => {
        // Get a copy of the rows
        const temp = [...clients].filter((row) => row.idcliente !== idcliente);

        setClients([...temp]);

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
      fechaNacimiento: record['fecha_nacimiento'],
    });

    setShowModal(true);
  };

  const saveChanges = () => {
    const { nombre, direccion, telefono, curp, genero, fechaNacimiento } =
      newRow;

    if (
      !nombre ||
      !direccion ||
      !telefono ||
      !curp ||
      isNaN(genero) ||
      !fechaNacimiento
    ) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);
  };

  const resetValues = () => {
    setNewRow({
      nombre: '',
      direccion: '',
      telefono: '',
      curp: '',
      genero: null,
      fechaNacimiento: '',
    });
  };

  return (
    <>
      <div className='clients-container'>
        <Space direction='vertical' size='middle' className='clients-spacer'>
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
          <Table columns={columns} dataSource={clients} />
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
        <Space direction='vertical' size='middle' className='clients-spacer'>
          <Input
            disabled={sending}
            placeholder='Ingresar nombre'
            value={newRow.nombre}
            onChange={(event) =>
              setNewRow({ ...newRow, nombre: event.currentTarget.value })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar dirección'
            value={newRow.direccion}
            onChange={(event) =>
              setNewRow({ ...newRow, direccion: event.currentTarget.value })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar teléfono'
            value={newRow.telefono}
            onChange={(event) =>
              setNewRow({ ...newRow, telefono: event.currentTarget.value })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar CURP'
            value={newRow.curp}
            onChange={(event) =>
              setNewRow({ ...newRow, curp: event.currentTarget.value })
            }
          />
          <Select
            disabled={sending}
            className='clients-spacer'
            onChange={(value) => setNewRow({ ...newRow, genero: value })}
            placeholder='Seleccionar género'
            value={newRow.genero}
          >
            <Option value={2}>Sin definir</Option>
            <Option value={0}>Masculino</Option>
            <Option value={1}>Femenino</Option>
          </Select>
          <DatePicker
            className='clients-spacer'
            disabled={sending}
            placeholder='Seleccionar fecha de nacimiento'
            value={
              newRow.fechaNacimiento ? moment(newRow.fechaNacimiento) : null
            }
            onChange={(value) =>
              setNewRow({ ...newRow, fechaNacimiento: value.toISOString() })
            }
          />
        </Space>
      </Modal>
    </>
  );
};

export default ClientsPage;
