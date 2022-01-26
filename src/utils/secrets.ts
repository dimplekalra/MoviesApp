import log from "../logger";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(".env")) {
  log.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  log.debug("Using .env.example file to supply config environment variables");
  dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") }); // you can delete this after you create your own .env file!
}

export const port = process.env["port"] || 5000;
export const host = process.env["host"] || "localhost";
export const local_dbUri =
  process.env["local_dbUri"] || "mongodb://localhost:27017/";

export const read_writes =
  process.env["read_writes"] || "retryWrites=true&w=majority";
export const database = process.env["database"] || "Movies";
export const testDatabase = process.env["testDatabase"] || "MoviesTest";
export const saltWorkFactor = process.env["saltWorkFactor"] || 10;
export const accessTokenTtl = process.env["accessTokenTtl"] || "1d";
export const accessTokenSec = process.env["accessTokenSec"] || 1000 * 60 * 60;
export const refreshTokenSec =
  process.env["refreshTokenSec"] || 365 * 24 * 1000 * 60 * 60;
export const refreshTokenTtl = process.env["refreshTokenTtl"] || "1y";
export const privateKey =
  process.env["privateKey"] ||
  `-----BEGIN RSA PRIVATE KEY-----
  MIICWwIBAAKBgQCQNBc4IP2ewViqE+ZHbnqGoCZFyAUtrxKmO4k/boSvBisJH6BX
  01ajpafM7c7f5PO+wAcGYIxiTQsv9ml2/cgnB6MWG/YYKDCfbWLNbpvQxYlUCu0f
  bRHc4dYM3AysBpx/SE9JNAlUoRsuQ05PP3U0IsM9FzYUpyZ9TDR7bjPYyQIDAQAB
  AoGABnnAXS3mFb36/FA+dBC7AdapQVL1IJMPFFXyGN4eqTlur08zRR5hcqHawjIf
  qyA97d/zsM6fHz70dKftHoHQ/hZKfWsBr2+R8C7rY/tlJhM24kqusDvNA9AMNoQW
  K4+DF+J05q5a+VWjP07Y976LZjq+vXlEVBfEiHig4wECaDECQQDbRQ5L9Mcibd5a
  R+Y3LxtXu0agpSG1dYDcWlLzRAt6yDD/EziRV8DSFyvgj1amO0SQ+2K/Hp5BEHii
  fDJB48ZFAkEAqFv32dNZcBy4IKAAHPgxhsYBcuUCHGfwwxxXJ3DjjZlhuR4K9YjO
  0alf4zNOlUyoULe9z+OAIgIqI9EyIX2itQJAShMeLVLYIy1yvJUllOb5Gb5Osd6X
  cLHtgoORGlWWezg+NS3NImy+2zqwvAAwiZ/kHgaO6XnyhJCH8Hx8jf3g8QJAepLK
  tlo7iXY/T/FtY6oHVNof/+hfSxMZpNOjWGHGKjd7gG0xCWZbPSYVW7LlCanP+URs
  +0fk592vlHggCWYQ6QJANZzno1FwUOjtGLeKm83ZGdbo3K+00i25FmBgB2d0uAtk
  noxFVOjsY+eSXHZqNybrhWRAzutSnpz/QEf/7Vg97g==
  -----END CERTIFICATE-----`;
// Movie_API_URL: "https://sameer-imdb-movies.herokuapp.com/movies/",
// API_KEY: "1c9676f5",
export const MOVIE_API_URL =
  process.env["MOVIE_API_URL"] || "https://api.themoviedb.org/3/";
export const API_KEY =
  process.env["API_KEY"] || "a18a4c3abe6c63b9d003880cedebf790";
