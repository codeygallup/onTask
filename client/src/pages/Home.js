import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_PROJECTS } from "../utils/queries";
import Auth from "../utils/auth";

const Home = () => {
  const { loading, data } = useQuery(USER_PROJECTS);
  const userArr = data?.userProjects || [];

  return (
    <div className="container-fluid w-95 border text-center">
      <div className="card-header bg-dark">
        <h1>Welcome to OnTask App!</h1>
        {Auth.loggedIn() ? (
          <button className="btn bg-dark logout" onClick={Auth.logout}>
            Logout
          </button>
        ) : null}
      </div>
      <div className="card-body text-center m-3">
        {!Auth.loggedIn() ? (
          <>
          <h2>Create an account or sign in to view projects</h2>
            <Link className="mx-4" to="/login">
              <button className="btn btn-lg btn-dark">Login</button>
            </Link>
            <Link className="mx-4" to="/signup">
              <button className="btn btn-lg btn-dark">Signup</button>
            </Link>
          </>
        ) : (
          <>
            <div className="card-body p-5">
              <div className="text-center">
                {userArr.map((project) => {
                  return (
                    <p
                      className={
                        userArr.length < 10 ? "projectList" : "projectLongList"
                      }
                      key={project._id}
                    >
                      <Link to={`/project/${project._id}`}>
                        {project.title}
                      </Link>
                    </p>
                  );
                })}
              </div>
            </div>
            <h2 className="mt-4">Project List</h2>
            <Link to="/project">
              <button className="btn btn-dark">Add Project</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
