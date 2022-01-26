import { BaseURL } from "../endpoints";

import { ICredentials } from "../interfaces";

export interface IParams {
  userId: string | number;
}

export const createUser = (user: object) => {
  return fetch(`${BaseURL}/users`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...user }),
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getUser = (credentials: ICredentials) => {
  return fetch(`${BaseURL}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err: Error) => console.log(err));
};

export const updateUser = (credentials: ICredentials, user: object) => {
  return fetch(`${BaseURL}/users`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${credentials.t}`,
      "x-refresh": credentials.r,
    },
    body: JSON.stringify({ ...user }),
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const removeUser = (
  userId: string | number,
  credentials: ICredentials
) => {
  return fetch(`${BaseURL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err: Error) => console.log(err));
};
