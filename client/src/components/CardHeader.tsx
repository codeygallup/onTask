import { useState } from "react";
import type { CardHeaderProps } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const CardHeader = ({ project, removeProject }: CardHeaderProps) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    projectId: string
  ): Promise<void> => {
    e.preventDefault();

    try {
      await removeProject({ variables: { projectId } });
      window.location.replace("/");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    handleDelete(e, id);
    setDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Link to={`/project/${project._id}/update`}>
            <button
              className="rounded-md border-2 border-slate-300 bg-teal-500 px-2 py-1 text-white transition-colors hover:bg-teal-600"
              aria-label="Edit project"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </Link>
          <h1 className="text-2xl">{project.title}</h1>
          <button
            className="rounded-md border-2 border-slate-300 bg-red-500 px-2 py-1"
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
              onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
                closeModal(e, project._id),
            },
          ]}
        />
      )}
    </>
  );
};

export default CardHeader;
