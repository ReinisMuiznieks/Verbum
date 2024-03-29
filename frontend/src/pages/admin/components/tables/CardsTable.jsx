import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {Container } from 'react-bootstrap';
import { PickerOverlay } from "filestack-react";
import { toast } from 'react-toastify'

function CardsTable() {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isPicker, setIsPicker] = useState(false);
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const [isAudioPicker, setIsAudioPicker] = useState(false);
  const headers = { 'Authorization': `Bearer ${user.token}` };
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "lv_word", headerName: "LV", width: 250 },
    { field: "eng_word", headerName: "ENG", width: 250 },
    {
        field: "category",
        headerName: "Category",
        width: 250,
        renderCell: (params) => params.value ? params.value.name || '' : '',
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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

useEffect(() => {
  axios
    .get("https://verbum-server-kd.onrender.com/api/categories", {headers})
    .then((response) => {
      setCategories(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);



  useEffect(() => {
    axios
      .get("https://verbum-server-kd.onrender.com/api/cards", {headers})
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

    const handleEdit = (item) => {
      setEditingItem(item);
      setSelectedCategory(item.category._id);
      setImage(item?.image || null);
      setAudio(item?.audio || null);
      setShowModal(true);
    };
  
    const handleDelete = (item) => {
      setEditingItem(item);
      setShowDeleteModal(true);
    };
  
  const handleConfirmDelete = () => {
      setShowDeleteModal(false);
      axios
        .delete(`https://verbum-server-kd.onrender.com/api/cards/${editingItem._id}`, { headers })
        .then((response) => {
          setData(data.filter((i) => i._id !== editingItem._id));
          toast.success("Card has been deleted!");
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const handleSave = (event) => {
    event.preventDefault();
    if(editingItem.lv_word.trim().length !== 0 && editingItem.eng_word.trim().length !== 0) {
    axios
      .put(
        `https://verbum-server-kd.onrender.com/api/cards/${editingItem._id}`,
        { ...editingItem, category: selectedCategory, image: image, audio: audio},
        {headers}
      )
      .then((response) => {
        setData(
          data.map((item) =>
            item._id === editingItem._id ? editingItem : item
          )
        );
        console.log(image);
        setEditingItem(null);
        setShowModal(false);
      })
      .catch((error) => {
        console.error(error);
      });
      toast.success(`Successfully updated ${editingItem.lv_word} card!`);
      } else {
        toast.error("Please fill out all of the fields!");
      }
  };
  
  const handleCancel = () => {
    setEditingItem({});
    setShowModal(false);
    setShowDeleteModal(false);
  };

  return (
    <Container className='pt-5'>
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
            <Form.Group controlId="formItemCategory">
              <Form.Label>Category:</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formItemName">
              <Form.Label>LV Word:</Form.Label>
              <Form.Control
                type="text"
                value={editingItem?.lv_word || ""}
                onChange={(event) =>
                  setEditingItem({ ...editingItem, lv_word: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formItemName">
              <Form.Label>ENG Word:</Form.Label>
              <Form.Control
                type="text"
                value={editingItem?.eng_word || ""}
                onChange={(event) =>
                  setEditingItem({ ...editingItem, eng_word: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formItemImage">
              <Form.Label>Image:</Form.Label>
              <div className="d-flex align-items-center">
                {image ? (
                  <img
                    src={image}
                    alt=""
                    width={100}
                    height={100}
                    className="mr-3"
                  />
                ) : (
                  <div className="mr-3" style={{ width: 100, height: 100 }}>
                    No image selected
                  </div>
                )}

                <Button
                  onClick={() => (isPicker ? setIsPicker(false) : setIsPicker(true))}
                  type="button"
                  variant="secondary"
                >
                  Choose Image
                </Button>  
              </div>

              <div className="d-flex align-items-center">
                {audio ? (
                <>              
                  <audio controls>
                    <source src={audio} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                  </audio>
                </>
                ) : (
                  <div className="mr-3" style={{ width: 100, height: 100 }}>
                  No audio selected
                  </div>
                )}

                  <Button
                    onClick={() => (isAudioPicker ? setIsAudioPicker(false) : setIsAudioPicker(true))}
                    type="button"
                    variant="secondary"
                  >
                    Choose Audio
                  </Button>  
              </div>

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

          {/* Filestack Image */}
          {isPicker && (
          <PickerOverlay
            apikey={process.env.REACT_APP_FILESTACK_API_KEY}
            onSuccess={(res) => {
              setImage(res.filesUploaded[0].url);
              setIsPicker(false);
            }}
            onError={(res) => alert(res)}
            pickerOptions={{
              maxFiles: 1,
              accept: ["image/*"],
              errorsTimeout: 2000,
              maxSize: 1 * 1000 * 1000,
            }}
          />
          )}

          {/* Filestack Audio */}
          {isAudioPicker && (
          <PickerOverlay
            apikey={process.env.REACT_APP_FILESTACK_API_KEY}
            onSuccess={(res) => {
              setAudio(res.filesUploaded[0].url);
              setIsAudioPicker(false);
            }}
            onError={(res) => alert(res)}
            pickerOptions={{
              maxFiles: 1,
              accept: ["audio/*"],
              errorsTimeout: 2000,
              maxSize: 1 * 1000 * 1000,
            }}
          />
          )}
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Label>Are you sure you want to delete {editingItem?.lv_word} card?</Form.Label>
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

export default CardsTable;
