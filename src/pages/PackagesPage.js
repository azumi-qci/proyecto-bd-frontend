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
  InputNumber,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import api from '../api';

import { APP_NAME } from '../app.config';

import '../styles/general.css';

const { Option } = Select;

const ShippingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idpaquete: 0,
    nombreCliente: '',
    dirDestino: '',
    dimension: '',
    peso: undefined,
    esFragil: undefined,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idpaquete',
      key: 'idpaquete',
    },
    {
      title: 'Nombre del cliente',
      dataIndex: 'nombre_cliente',
      key: 'nombre_cliente',
    },
    {
      title: 'Dirección destino',
      dataIndex: 'dir_destino',
      key: 'dir_destino',
    },
    {
      title: 'Peso',
      dataIndex: 'peso',
      key: 'peso',
      render: (text) => <>{text} kg</>,
    },
    {
      title: 'Dimensiones',
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: 'Es frágil',
      dataIndex: 'es_fragil',
      key: 'es_fragil',
      render: (text) => {
        if (text) {
          return <>Sí</>;
        } else {
          return <>No</>;
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
            onConfirm={() => handleClickDelete(record.idpaquete)}
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
    document.title = `Paquetes | ${APP_NAME}`;
  }, []);

  const getAllRecords = () => {
    api
      .get('/paquetes')
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
    const { nombreCliente, dirDestino, peso, esFragil, dimension } = newRow;

    if (
      !nombreCliente ||
      !dirDestino ||
      isNaN(peso) ||
      isNaN(esFragil) ||
      !dimension
    ) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .post('/paquetes', {
        nombreCliente,
        dirDestino,
        peso,
        esFragil,
        dimension,
      })
      .then((response) => {
        setShowModal(false);
        message.success('El registro fue insertado correctamente');

        setData([
          ...data,
          {
            idpaquete: response.data.idpaquete,
            nombre_cliente: nombreCliente,
            dir_destino: dirDestino,
            peso,
            es_fragil: esFragil,
            dimension,
          },
        ]);
      })
      .catch((reason) => {
        console.log(reason);
        message.error('Se generó un error al insertar el registro');
      })
      .finally(() => setSending(false));
  };

  const handleClickDelete = (idpaquete) => {
    api
      .delete(`/paquetes/${idpaquete}`)
      .then(() => {
        // Get a copy of the rows
        const temp = [...data].filter((item) => item.idpaquete !== idpaquete);

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
      nombreCliente: record.nombre_cliente,
      dirDestino: record.dir_destino,
      esFragil: record.es_fragil,
    });

    setShowModal(true);
  };

  const saveChanges = () => {
    const { idpaquete, nombreCliente, dirDestino, peso, esFragil, dimension } =
      newRow;

    if (
      !nombreCliente ||
      !dirDestino ||
      isNaN(peso) ||
      isNaN(esFragil) ||
      !dimension
    ) {
      message.error('Existen campos vacíos');
      return;
    }

    setSending(true);

    api
      .put(`/paquetes/${idpaquete}`, {
        nombreCliente,
        dirDestino,
        peso,
        esFragil,
        dimension,
      })
      .then(() => {
        let temp = [...data];

        const index = temp.findIndex((item) => item.idpaquete === idpaquete);

        if (index > -1) {
          temp.splice(index, 1, {
            idpaquete,
            nombre_cliente: nombreCliente,
            dir_destino: dirDestino,
            peso,
            es_fragil: esFragil,
            dimension,
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
      idpaquete: 0,
      nombreCliente: '',
      dirDestino: '',
      dimension: '',
      peso: undefined,
      esFragil: undefined,
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
            placeholder='Ingresar nombre del cliente'
            value={newRow.nombreCliente}
            onChange={(event) =>
              setNewRow({ ...newRow, nombreCliente: event.currentTarget.value })
            }
          />
          <Input
            disabled={sending}
            placeholder='Ingresar dirección destino'
            value={newRow.dirDestino}
            onChange={(event) =>
              setNewRow({ ...newRow, dirDestino: event.currentTarget.value })
            }
          />
          <InputNumber
            className='full-width'
            disabled={sending}
            onChange={(value) => setNewRow({ ...newRow, peso: value })}
            placeholder='Ingresar peso en kilogramos'
            value={newRow.peso}
          />
          <Input
            disabled={sending}
            placeholder='Ingresar dimensiones'
            value={newRow.dimension}
            onChange={(event) =>
              setNewRow({ ...newRow, dimension: event.currentTarget.value })
            }
          />
          <Select
            disabled={sending}
            className='full-width'
            onChange={(value) => setNewRow({ ...newRow, esFragil: value })}
            placeholder='¿Es frágil?'
            value={newRow.esFragil}
          >
            <Option value={false}>No</Option>
            <Option value={true}>Sí</Option>
          </Select>
        </Space>
      </Modal>
    </>
  );
};

export default ShippingPage;
