import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME, ALL_PROJECTS, USER_PROJECTS } from "../utils/queries";
import { REMOVE_PROJECT } from '../utils/mutations';
import Auth from "../utils/auth";

const Home = () => {

  const [project, setProject] = useState({
    title: "",
    description: "",
    complete: false,
  });

  const { loading: meLoading, data: meData } = useQuery(GET_ME);
  // eslint-disable-next-line
  const user = meData?.me || {}
  // eslint-disable-next-line
  const { loading: projectLoading, data: projectData } = useQuery(ALL_PROJECTS)
  const projectArr = projectData?.allProjects || [];

  const { loading: userLoading, data: userData } = useQuery(USER_PROJECTS)
  const userArr = userData?.userProjects || []
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
         {meLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="square text-center">
            {userArr.map((project) => {
              return (
                <h4 className="projectList pr-4" key={project._id}>
                  <Link to={`/project/${project._id}`}>{project.title}</Link>
                </h4>
              );
            })}
          </ul>
        )}
      </div>
      <div className="card-footer text-center m-3">
        <h2>Ready to create a new project?</h2>
        {!Auth.loggedIn() ? (
          <>
            <Link className="mx-4" to="/login">
              <button className="btn btn-lg btn-warning">Login</button>
            </Link>
            <Link className="mx-4" to="/signup">
              <button className="btn btn-lg btn-warning">Signup</button>
            </Link>
          </>
        ) : (
          <Link to="/project">
            <button className="btn">Add Project</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
