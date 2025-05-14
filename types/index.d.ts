type authType = "sign-in" | "sign-up";

interface ServerResponse<T = unknown> {
  success: boolean;
  message: string;
  context?: T;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface VapiError {
  errorMsg: string;
}
