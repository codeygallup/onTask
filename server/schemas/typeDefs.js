const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
    findUser(_id: ID!): User
    oneProject(_id: ID!): Project
    userProjects(projectUser: ID): [Project]
    projectTasks(taskProject: ID): [Task]
    completeProjectTasks(taskProject: ID): [Task]
    incompleteProjectTasks(taskProject: ID): [Task]
  }

  type User {
    _id: ID
    username: String
    email: String
    projects: [Project]
  }

  type Project {
    _id: ID
    title: String
    description: String
    projectUser: ID
    tasks: [Task]
  }

  type Task {
    _id: ID
    taskText: String
    complete: Boolean
    taskProject: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addProject(projectUser: ID, title: String!, description: String!): Project
    updateProject(projectId: ID, title: String!, description: String!): Project
    removeProject(projectId: ID): Project
    addTask(taskText: String!, taskProject: ID): Task
    removeTask(taskId: ID): Task
    updateComplete(taskId: ID): Task
    requestPasswordRecovery(email: String!): Auth
    resetPassword(email: String!, newPassword: String!): Auth
    validatePIN(email: String!, pin: String!): Auth
  }
`;

module.exports = typeDefs;
