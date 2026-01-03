import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation addProject($title: String!, $description: String!) {
    addProject(title: $title, description: $description) {
      _id
      title
      description
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation updateProject(
    $projectId: ID
    $title: String!
    $description: String!
  ) {
    updateProject(
      projectId: $projectId
      title: $title
      description: $description
    ) {
      _id
      title
      description
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation removeProject($projectId: ID!) {
    removeProject(projectId: $projectId) {
      _id
    }
  }
`;

export const ADD_TASK = gql`
  mutation addTask($text: String!, $projectId: ID) {
    addTask(text: $text, projectId: $projectId) {
      _id
      text
      complete
    }
  }
`;

export const REMOVE_TASKS = gql`
  mutation removeTask($taskIds: [ID]!) {
    removeTasks(taskIds: $taskIds) {
      _id
    }
  }
`;

export const UPDATE_COMPLETE = gql`
  mutation updateComplete($taskId: ID) {
    updateComplete(taskId: $taskId) {
      _id
    }
  }
`;

export const REQUEST_PASSWORD_RECOVERY = gql`
  mutation requestPasswordRecovery($email: String!) {
    requestPasswordRecovery(email: $email) {
      success
      message
      user {
        _id
        email
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $newPassword: String!) {
    resetPassword(email: $email, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const VALIDATE_PIN = gql`
  mutation validatePIN($email: String!, $pin: String!) {
    validatePIN(email: $email, pin: $pin) {
      success
      message
    }
  }
`;

export const UPDATE_LAST_OPENED = gql`
  mutation updateLastOpened($projectId: ID!) {
    updateLastOpened(projectId: $projectId) {
      _id
      lastOpenedAt
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`;
