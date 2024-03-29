import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {Container} from 'react-bootstrap';
import { toast } from 'react-toastify'

function UsersTable() {
  const { user } = useSelector((state) => state.auth);
  const headers = { 'Authorization': `Bearer ${user.token}` };
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    {
      field: "role",
      headerName: "is Admin",
      width: 130,
      renderCell: (params) =>
        params.value == "admin" ? <span>✓</span> : <span>✕</span>,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => {
        const onClickEdit = () => handleEdit(params.row);
        const onClickDelete = () => handleDelete(params.row);
        return (
          <>
            <Button variant="primary" onClick={onClickEdit}>
              Edit
            </Button>{" "}
            <Button variant="danger" onClick={onClickDelete} className='m-2'>
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get("https://verbum-server-kd.onrender.com/api/users", {headers})
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setEditingItem(item);
    setShowDeleteModal(true);
  };

const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    axios
      .delete(`https://verbum-server-kd.onrender.com/api/users/${editingItem._id}`, { headers })
      .then((response) => {
        setData(data.filter((i) => i._id !== editingItem._id));
        toast.success("User has been deleted!");
      })
      .catch((error) => {
        console.error(error);
      });
};


  const handleSave = (event) => {
    event.preventDefault();
    axios
      .put(`https://verbum-server-kd.onrender.com/api/users/${editingItem._id}`, 
      { ...editingItem, role: selectedRole}, 
      {headers})
      .then((response) => {
        setData(
          data.map((item) =>
            item._id === editingItem._id ? editingItem : item
          )
        );
        setEditingItem(null);
        setShowModal(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    setEditingItem({});
    setShowModal(false);
    setShowDeleteModal(false);
  };

  return (
    <Container className='pt-5 pb-5'>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
        disableRowSelectionOnClick
        style={{backgroundColor: "white"}}
      />
        <Modal show={showModal} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              <Form.Group controlId="formItemName">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem?.name || ''}
                  onChange={(event) =>
                    setEditingItem({ ...editingItem, name: event.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formItemCategory">
              <Form.Label>Role:</Form.Label>
              <Form.Select
                value={editingItem?.role}
                onChange={(event) => setSelectedRole(event.target.value)}
              >
                  <option value={"user"}>User</option>
                  <option value={"admin"}>Admin</option>
              </Form.Select>
            </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal show={showDeleteModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Label>Are you sure you want to delete {editingItem?.name} user?</Form.Label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
    </Container>
  );
}

export default UsersTable;
