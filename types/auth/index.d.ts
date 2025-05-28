interface CreateUserParams {
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}
