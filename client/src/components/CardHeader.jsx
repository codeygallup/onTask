import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function CardHeader({ project, removeProject }) {
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
            onClick={(e) => handleDelete(e, project._id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <details className="mb-4">
          <summary>Project description</summary>
          <p>{project.description}</p>
        </details>
      </div>
    </>
  );
}
