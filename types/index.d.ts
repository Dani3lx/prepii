type authType = "sign-in" | "sign-up";

interface ServerResponse {
  success: boolean;
  message: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}
