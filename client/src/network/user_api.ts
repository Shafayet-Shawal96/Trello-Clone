import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { User } from "../models/user";

let hostUrl = "http://localhost:5000";
if (process.env.NODE_ENV === "production") {
  hostUrl = "https://trello-clone-server-snowy.vercel.app";
}

async function fetchUser(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(`${hostUrl}${input}`, {
    ...init,
    credentials: "include",
  });
  if (response.ok) {
    return response;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedError("Invalid Credentials");
    } else if (response.status === 409) {
      throw new ConflictError(
        "Already have a user with this email address. You can log in instead"
      );
    } else {
      throw Error(
        "Request failed with status: " +
          response.status +
          "message: Unknown Error occured"
      );
    }
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchUser("/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
