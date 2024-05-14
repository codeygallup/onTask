import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_PROJECTS } from "../utils/queries";
import Auth from "../utils/auth";
import { ScaleLoader } from "react-spinners";

const Home = () => {
  const { loading, data: { userProjects = [] } = {} } = useQuery(USER_PROJECTS);

  if (loading)
    return (
      <div className="d-flex justify-content-evenly align-items-center vh-100">
        <ScaleLoader height={100} width={15} color="#1b89bc" />
      </div>
    );

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 mx-3">
        <div className="card container border text-center shadow p-2">
          <div className="card-header d-flex align-items-center justify-content-between">
            {Auth.loggedIn() && (
              <div className="d-flex align-items-center">
                <div className="title-part">
                  <p className="mb-0 font-weight-bold card-title">
                    Hello {Auth.getProfile()?.data?.username}
                  </p>
                </div>
              </div>
            )}
            <div className="title-part">
              <h1 className="card-title mb-0 font-weight-bold">
                Welcome to OnTask!
              </h1>
            </div>

            {Auth.loggedIn() && (
              <button className="btn bg-dark text-white" onClick={Auth.logout}>
                Logout
              </button>
            )}
          </div>
          <div className="card-body my-4">
            {!Auth.loggedIn() ? (
              <>
                <h2 className="mb-5">
                  Create an account or sign in to view projects
                </h2>
                <Link className="mx-4" to="/login">
                  <button className="btn btn-lg btn-dark">Login</button>
                </Link>
                <Link className="mx-4" to="/signup">
                  <button className="btn btn-lg btn-dark">Signup</button>
                </Link>
              </>
            ) : (
              <>
                <h2>Project List</h2>
                <hr />
                <div>
                  {userProjects.map((project) => {
                    return (
                      <p key={project._id} className="fs-2 mb-3">
                        <Link
                          to={`/project/${project._id}`}
                          className="text-dark"
                        >
                          {project.title}
                        </Link>
                      </p>
                    );
                  })}
                </div>
                <Link to="/project">
                  <button className="btn btn-dark">Add Project</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
