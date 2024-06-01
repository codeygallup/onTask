import { gql } from "@apollo/client";

export const FIND_USER = gql`
  query findUser($id: ID!) {
    findUser(_id: $id) {
      _id
      email
    }
  }
`;

export const ONE_PROJECT = gql`
  query oneProject($id: ID!) {
    oneProject(_id: $id) {
      _id
      title
      description
      tasks {
        _id
        taskText
        complete
      }
    }
  }
`;

export const USER_PROJECTS = gql`
  query userProjects {
    userProjects {
      _id
      title
      description
      tasks {
        _id
        taskText
        complete
      }
    }
  }
`;
