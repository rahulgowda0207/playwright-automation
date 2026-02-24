export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserData {
  standardUser: UserCredentials;
  lockedOutUser: UserCredentials;
  invalidUser: UserCredentials;
}
