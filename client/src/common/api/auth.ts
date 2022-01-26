import { BaseURL } from "../endpoints";
import { ICredentials } from "../interfaces";

export const signIn = (user: object) => {
  return fetch(`${BaseURL}/sessions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const signout = async (credentials: ICredentials) => {
  return fetch(`${BaseURL}/sessions`, {
    method: "DELETE",
    headers: {
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err: Error) => console.log(err));
};

export const getSession = async (credentials: ICredentials) => {
  return fetch(`${BaseURL}/sessions/single`, {
    method: "GET",
    headers: {
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((response) => response.json())
    .catch((err: Error) => console.log(err));
};
