export interface DecodedToken {
  data: {
    _id: string;
    username: string;
    email: string;
  };
  exp: number;
  iat?: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  projects?: Project[];
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  lastOpenedAt?: string;
  userId: string;
  tasks?: Task[];
}

export interface Task {
  _id: string;
  text: string;
  complete: boolean;
  projectId: string;
}

export interface Auth {
  token: string;
  user: User;
}

export interface RecoveryResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface LoginFormData {
  username?: string;
  email?: string;
  password?: string;
}

export interface ProjectInput {
  projectId?: string;
  title: string;
  description: string;
}

export interface ButtonGroupProps {
  task: Task;
}

export interface CardHeaderProps {
  project: Project;
  removeProject: (options: {
    variables: { projectId: string };
  }) => Promise<any>;
}

export interface LoginFormProps {
  title: string;
  formData: LoginFormData;
  setFormData: (data: LoginFormData) => void;
  handleSub: (options: {
    variables: LoginFormData & { password: string };
  }) => Promise<any>;
  authData: string;
  userIdParam?: string | null;
}

export interface ButtonConfig {
  label: string;
  className: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ModalProps {
  modalMessage: string;
  buttonConfig: ButtonConfig[];
}

export interface FindUserData {
  findUser?: {
    _id?: string;
    email?: string;
  };
}

export interface RecoveryResponse {
  requestPasswordRecovery?: {
    success: boolean;
    user: { _id: string };
  };
}

export interface ProjectInput {
  title: string;
  description: string;
}

export interface TaskFormData {
  text: string;
  complete?: boolean;
  projectId?: string;
}

export interface AddTaskVariables {
  text: string;
  projectId: string;
}

export interface RemoveTasksVariables {
  taskIds: string[];
}

export interface UpdateCompleteVariables {
  taskId: string;
}

export interface OneProjectData {
  oneProject: Project;
}

export interface OneProjectVariables {
  id: string;
}

export interface PasswordProps {
  title?: string;
  password: string;
  setPassword: (password: string) => void;
  errorModal?: boolean;
  passwordRef?: React.RefObject<HTMLInputElement | null>;
}

export interface ProjectFormProps {
  title: string;
  handleSub: (options: { variables: ProjectInput }) => Promise<any>;
  project: ProjectInput;
  setProject: React.Dispatch<React.SetStateAction<ProjectInput>>;
}

export interface TaskContextType {
  task: { text: string; complete: boolean; projectId: string | undefined };
  setTask: React.Dispatch<React.SetStateAction<any>>;
  selectedTasks: string[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddTask: (task: any) => Promise<any>;
  updateComplete: (options: { variables: { taskId: string } }) => Promise<any>;
  refetch: () => Promise<any>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
  projectId: string | undefined;
}

export interface TaskItemProps {
  task: Task;
}

export interface DeleteProjectVariables {
  projectId: string;
}

export interface UserProjectsData {
  userProjects: Project[];
}

export interface RefreshTokenResponse {
  refreshToken: {
    token: string;
  };
}
