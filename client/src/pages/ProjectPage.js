import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { ONE_PROJECT } from "../utils/queries";

function ProjectPage() {
  let { id } = useParams();

  const { loading, data } = useQuery(ONE_PROJECT, {
    variables: { _id: id },
  });

  console.log({ data });

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

export default ProjectPage;
