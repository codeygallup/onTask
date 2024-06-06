import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Modal from "./Modal";

export default function CardHeader({ project, removeProject }) {
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async (e, projectId) => {
    e.preventDefault();

    try {
      await removeProject({
        variables: { projectId },
      });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = (e, id) => {
    handleDelete(e, id);
    setDeleteModal(false);
  };

  return (
    <>
      <div className="text-center bg-body-secondary pt-1">
        <div className="d-flex justify-content-between align-items-center bg-body-secondary">
          <Link to={`/project/${project._id}/update`}>
            <button className="btn bg-info text-light ms-2">
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </Link>
          <h1>{project.title}</h1>
          <button
            className="btn btn-danger me-2"
            onClick={() => setDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <details className="mb-4">
          <summary>Project description</summary>
          <p>{project.description}</p>
        </details>
      </div>
      {deleteModal && (
        <Modal
          modalMessage={"Are you sure you want to delete this project?"}
          buttonConfig={[
            {
              label: "Cancel",
              className: "btn-success",
              onClick: () => setDeleteModal(false),
            },
            {
              label: "Confirm",
              className: "btn-danger",
              onClick: (e) => closeModal(e, project._id),
            },
          ]}
        />
      )}
    </>
  );
}
