export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}
