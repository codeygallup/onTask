import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      projects {
        _id
        title
        description
      }
    }
  }
`;

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

export const PROJECT_TASKS = gql`
  query projectTasks($taskProject: ID) {
    projectTasks(taskProject: $taskProject) {
      _id
      taskText
      complete
    }
  }
`;

export const COMPLETE_PROJECT_TASKS = gql`
  query completeProjectTasks($taskProject: ID) {
    completeProjectTasks(taskProject: $taskProject) {
      _id
      taskText
      complete
    }
  }
`;

export const INCOMPLETE_PROJECT_TASKS = gql`
  query incompleteProjectTasks($taskProject: ID) {
    incompleteProjectTasks(taskProject: $taskProject) {
      _id
      taskText
      complete
    }
  }
`;
