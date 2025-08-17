const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    findUser(_id: ID!): User
    oneProject(_id: ID!): Project
    userProjects(userId: ID): [Project]
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
    userId: ID
    tasks: [Task]
  }

  type Task {
    _id: ID
    text: String
    complete: Boolean
    projectId: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type RecoveryResponse {
    success: Boolean!
    message: String
    user: User
  }

  type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addProject(userId: ID, title: String!, description: String!): Project
    updateProject(projectId: ID, title: String!, description: String!): Project
    removeProject(projectId: ID): Project
    addTask(text: String!, projectId: ID): Task
    removeTasks(taskIds: [ID]): Task
    updateComplete(taskId: ID): Task
    requestPasswordRecovery(email: String!): RecoveryResponse
    resetPassword(email: String!, newPassword: String!): RecoveryResponse
    validatePIN(email: String!, pin: String!): RecoveryResponse
  }
`;

module.exports = typeDefs;
