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
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Link to={`/project/${project._id}/update`}>
            <button
              className="border-2 border-slate-300 rounded-md py-1 px-2 bg-teal-500 hover:bg-teal-600 text-white transition-colors"
              aria-label="Edit project"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </Link>
          <h1 className="text-2xl">{project.title}</h1>
          <button
            className="border-2 border-slate-300 rounded-md py-1 px-2 bg-red-500"
            aria-label="Delete project"
            onClick={() => setDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <details className="mt-2 text-center">
          <summary aria-label="Toggle project description">
            Project description
          </summary>
          <p>{project.description}</p>
        </details>
      </div>
      {deleteModal && (
        <Modal
          modalMessage={"Are you sure you want to delete this project?"}
          buttonConfig={[
            {
              label: "Cancel",
              className:
                "px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600",
              onClick: () => setDeleteModal(false),
            },
            {
              label: "Delete Project",
              className:
                "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600",
              onClick: (e) => closeModal(e, project._id),
            },
          ]}
        />
      )}
    </>
  );
}
