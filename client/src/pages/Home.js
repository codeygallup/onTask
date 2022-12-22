import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_PROJECTS } from "../utils/queries";
import Auth from "../utils/auth";

const Home = () => {

  const { loading, data } = useQuery(USER_PROJECTS)
  const userArr = data?.userProjects || []
  console.log(userArr)
 
  return (
    <div className="container-fluid w-95 border text-center">
      <div className="card-header bg-dark">
        <h1>Welcome to OnTask App!</h1>
        {Auth.loggedIn() ? (
          <button className="btn bg-dark logout" onClick={Auth.logout}>Logout</button>
        ) : null }
      </div>
      <div className="card-body">
        <h2 className="mt-4">Project List</h2>
         {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-center">
            {userArr.map((project) => {
              return (
                <p className={userArr.length < 10 ? "projectList" : "projectLongList"} key={project._id}>
                  <Link to={`/project/${project._id}`}>{project.title}</Link>
                </p>
              );
            })}
          </div>
        )}
      </div>
      <div className="card-footer text-center m-3">
        <h2>Ready to create a new project?</h2>
        {!Auth.loggedIn() ? (
          <>
            <Link className="mx-4" to="/login">
              <button className="btn btn-lg btn-dark">Login</button>
            </Link>
            <Link className="mx-4" to="/signup">
              <button className="btn btn-lg btn-dark">Signup</button>
            </Link>
          </>
        ) : (
          <Link to="/project">
            <button className="btn btn-dark">Add Project</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
