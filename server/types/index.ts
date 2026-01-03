export interface Context {
  user?: UserPayload;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

export interface ProjectArgs {
  projectId: string;
  title: string;
  description: string;
}

export interface UpdateProjectArgs {
  projectId: string;
  title?: string;
  description?: string;
}

export interface TaskArgs {
  text: string;
  projectId: string;
}

export interface IdArgs {
  _id: string;
}

export interface ProjectIdArgs {
  projectId: string;
}

export interface TaskIdArgs {
  taskId: string;
}

export interface TaskIdsArgs {
  taskIds: string[];
}

export interface EmailArgs {
  email: string;
}

export interface ResetPasswordArgs {
  email: string;
  newPassword: string;
}

export interface ValidatePINArgs {
  email: string;
  pin: string;
}

export interface UserPayload {
  username: string;
  email: string;
  _id: string;
}

export interface JwtPayload {
  data: UserPayload;
}

export interface AuthRequest {
  req: {
    headers: {
      authorization?: string;
    };
    body?: { token?: string };
    query?: { token?: string };
    user?: UserPayload;
  };
}
