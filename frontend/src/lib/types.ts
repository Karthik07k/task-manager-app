export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  dueDate: string;
  userId: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}