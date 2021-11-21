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

import { APP_NAME } from '../app.config';

import '../styles/general.css';

const { Option } = Select;

const ClientsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idcliente: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    genero: null,
    fechaNacimiento: '',
    curp: '',
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idcliente',
      key: 'idcliente',
    },
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
          return <>Masculino</>;
        } else if (text === 1) {
          return <>Femenino</>;
        }

        return <>Sin definir</>;
      },
    },
    {
      title: 'Fecha de nacimiento',
      dataIndex: 'fecha_nacimiento',
      key: 'fecha_nacimiento',
      render: (text) => <>{new Date(text).toLocaleDateString()}</>,
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

  useEffect(() => {
    document.title = `Clientes | ${APP_NAME}`;
  }, []);

  const getAllClients = () => {
    api
      .get('/clientes')
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

        setData([
          ...data,
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
        const temp = [...data].filter((item) => item.idcliente !== idcliente);

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
      fechaNacimiento: record['fecha_nacimiento'],
    });

    setShowModal(true);
  };

  const saveChanges = () => {
    const {
      idcliente,
      nombre,
      direccion,
      telefono,
      curp,
      genero,
      fechaNacimiento,
    } = newRow;

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
      .put(`/clientes/${idcliente}`, {
        nombre,
        direccion,
        telefono,
        curp,
        genero,
        fechaNacimiento,
      })
      .then(() => {
        let temp = [...data];

        const index = temp.findIndex((item) => item.idcliente === idcliente);

        if (index > -1) {
          temp.splice(index, 1, {
            idcliente,
            nombre,
            direccion,
            telefono,
            curp,
            genero,
            fecha_nacimiento: fechaNacimiento,
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
      idcliente: 0,
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
            className='full-width'
            onChange={(value) => setNewRow({ ...newRow, genero: value })}
            placeholder='Seleccionar género'
            value={newRow.genero}
          >
            <Option value={2}>Sin definir</Option>
            <Option value={0}>Masculino</Option>
            <Option value={1}>Femenino</Option>
          </Select>
          <DatePicker
            className='full-width'
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
