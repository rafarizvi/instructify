import {
  Button,
  Modal,
  PropTypes
} from './index'

//exporting to dashboard were user can delete their tutorial with confirmation
const ConfirmDelete = ({ show, handleClose, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this tutorial?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmDelete.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default ConfirmDelete;
