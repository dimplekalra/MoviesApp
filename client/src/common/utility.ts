import { getSession, signout } from "./api/auth";

import { IJWT, ICredentials } from "./interfaces";

export const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    let item = sessionStorage.getItem("jwt");

    if (item) {
      let data = JSON.parse(item);

      if (data) {
        // let now = new Date();

        // let expiration = getExpiryTime(data.timestamp, data.expiry);
        // console.log("expi", expiration.getMinutes());
        // if (now.getTime() > expiration.getTime()) {
        //   return getSession({
        //     t: data.accessToken,
        //     r: data.refreshToken,
        //   }).then((res: any) => {
        //     data = false;
        //     console.log("Res ", res);
        //     // sessionStorage.removeItem("jwt");

        //     return data;
        //   });
        // }
        return data;
      }
      return false;
    } else return false;
  },
  authenticate(jwt: IJWT, cb: () => void) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  async signOut(cb: () => void) {
    await cb();
    document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
  },
};

export const ItemsPerPage = (list: any[], page: number) => {
  const array = list.filter((val, idx) => {
    let low, high;
    low = page * 20 - 20;
    high = page * 20;

    if (idx >= low && idx < high) return true;
    else return false;
  });

  return array;
};

export const getClassByRate = (vote: number) => {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
};

export const getExpiryTime = (timestamp: Date, str: string): Date => {
  const dur = str.split("");

  let exp = new Date(timestamp);

  switch (dur[1]) {
    case "d":
      exp.setDate(exp.getDate() + Number(dur[0]));
      return exp;
    case "h":
      exp.setHours(exp.getHours() + Number(dur[0]));
      return exp;
    case "m":
      exp.setMinutes(exp.getMinutes() + Number(dur[0]));
      return exp;
    case "y":
      exp.setFullYear(exp.getFullYear() + Number(dur[0]));
      return exp;
    default:
      return new Date();
  }
};

export function timeConvert(n: Number) {
  let num = n;
  let hours = Number(num) / 60;
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  return rhours + " hour(s) and " + rminutes + " minute(s).";
}
