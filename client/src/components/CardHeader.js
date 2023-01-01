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
      <div className="project-header text-center">
        <Link to={`/project/${project._id}/update`}>
          <button className="btn btn-link card-btn">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </Link>
        <h1 className="card card-header">{project.title}</h1>
        <button
          className="btn btn-danger card-btn"
          onClick={(e) => handleDelete(e, project._id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <details className="card-body text-center mb-4">
        <summary className="float-right">Project description</summary>
        <p>{project.description}</p>
      </details>
      <h5 className="text-center">Tasks:</h5>
    </>
  );
}
