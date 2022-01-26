import app from "../app";
import request from "supertest";
import User from "../model/user.model";
import Movie from "../model/movie.model";
import mongoose from "mongoose";
// import config from "config";
import { IMovieDocument } from "../model/movie.model";
import { removeUserSessions } from "../service/session.service";
import {
  local_dbUri,
  production_dbUri,
  read_writes,
  testDatabase,
} from "../utils/secrets";

beforeAll((done) => {
  const dbUri =
    process.env.NODE_ENV === "development"
      ? local_dbUri
      : // || (config.get("local_dbUri") as string)
        production_dbUri;
  // ||  (config.get("production_dbUri") as string);

  const database = testDatabase || "MoviesTest";
  // config.get("testDatabase") as string;

  // const read_writes =
  //   (process.env.read_writes as string) || "retryWrites=true&w=majority";
  // config.get("read_writes") as string;

  const uri = `${dbUri}${database}?${read_writes}`;

  mongoose
    .connect(uri, {
      // useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
      console.log("connected");
      done();
    })
    .catch((err: any) => console.log(err));
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async function () {
    const result = await request(app).get("/healthcheck");
    expect(result.statusCode).toEqual(200);
  });
});

describe("POST /users", function () {
  let data = {
    name: "dummy",
    email: "dummy@dummy.com",
    password: "dummy12",
    passwordConfirmation: "dummy12",
  };

  it("respond with 200 created", function (done) {
    request(app)
      .post("/api/users")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it("Password is too short - should be 6 chars minimum.", function (done) {
    data = {
      ...data,
      password: "23",
      passwordConfirmation: "23",
    };
    request(app)
      .post("/api/users")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /(json|html)/)
      .expect(400)
      .end((err, res) => {
        console.log("error", err, res.body);
        if (err) {
          return done(err);
        }
        expect(res.body).toEqual(
          expect.arrayContaining([
            "Password is too short - should be 6 chars minimum.",
          ])
        );

        done();
      });
  });

  it("Password does not match", function (done) {
    data = {
      ...data,
      passwordConfirmation: "234",
    };
    request(app)
      .post("/api/users")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /(json|html)/)
      .expect(400)
      .end((err, res) => {
        console.log("error", err, res.body);
        if (err) {
          return done(err);
        }
        expect(res.body).toEqual(
          expect.arrayContaining(["Passwords must match"])
        );

        done();
      });
  });
  it("Should be valid Email", function (done) {
    data = {
      ...data,
      email: "abc",
    };
    request(app)
      .post("/api/users")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /(json|html)/)
      .expect(400)
      .end((err, res) => {
        console.log("error", err, res.body);
        if (err) {
          return done(err);
        }
        expect(res.body).toEqual(
          expect.arrayContaining(["Must be a valid email"])
        );

        done();
      });
  });
});

describe("Validate session and Invalidate", function () {
  let userData = {
    name: "abc",
    email: "abc@abc.com",
    password: "123456",
    passwordConfirmation: "123456",
  };

  let userLoginData = {
    email: "abc@abc.com",
    password: "123456",
  };

  beforeAll(async () => {
    let result = await request(app)
      .post("/api/users")
      .send(userData)
      .set("Accept", "application/json");
  });

  afterAll(async () => {
    let result = await User.findOneAndDelete({ email: userData.email });
  });

  let accessToken = "";
  let refreshToken = "";

  it("session Created", async function () {
    let result = await request(app)
      .post("/api/sessions")
      .send(userLoginData)
      .set("Accept", "application/json");

    // expect(result.headers["content-type"]).toMatch(/json/);
    expect(result.status).toEqual(200);

    expect(result.body).toHaveProperty("data");
    expect(result.body).toHaveProperty("message");

    expect(result.body.data).toBeDefined();
    const { data } = result.body;

    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("refreshToken");
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
  });

  it("validating session using token", async () => {
    let result = await request(app)
      .get("/api/sessions")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${accessToken}`)
      .set("x-refresh", refreshToken);

    // expect(result.headers["content-type"]).toMatch(/json/);
    expect(result.status).toEqual(200);
  });

  it("Invalidate Session", async () => {
    let result = await request(app)
      .delete("/api/sessions")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${accessToken}`)
      .set("x-refresh", refreshToken);

    // expect(result.headers["content-type"]).toMatch(/json/);
    expect(result.status).toEqual(200);
  });
});

//Testing Movie Routes
describe("Movies Routes", function () {
  let accessToken = "";
  let refreshToken = "";
  let userData = {
    name: "abc",
    email: "abc@abc.com",
    password: "123456",
    passwordConfirmation: "123456",
  };

  let userLoginData = {
    email: "abc@abc.com",
    password: "123456",
  };

  beforeAll(async () => {
    let result = await request(app)
      .post("/api/users")
      .send(userData)
      .set("Accept", "application/json");

    if (result) {
      result = await request(app)
        .post("/api/sessions")
        .send(userLoginData)
        .set("Accept", "application/json");

      accessToken = result.body.data.accessToken;
      refreshToken = result.body.data.refreshToken;
    }
  });

  afterAll(async () => {
    let result = await request(app)
      .get("/api/sessions/single")
      .set("authorization", `Bearer ${accessToken}`)
      .set("x-refresh", refreshToken);
    const { data } = result.body;
    const userId = data.user;
    const sessionId = data._id;
    await removeUserSessions({ _id: sessionId }, { valid: false });
    await User.findOneAndDelete({ email: userData.email });
  });

  let movieId: number;
  let movieTitle = "";
  it("Get All Movies", async function () {
    let result = await request(app)
      .get("/api/movies")
      .set("Accept", "application/json");

    expect(result.body).toHaveProperty("data");
    expect(result.body).toHaveProperty("message");

    expect(result.body.data).toBeDefined();
    expect(result.headers["content-type"]).toMatch(/json/);
    expect(result.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        message: expect.any(String),
        totalPages: expect.any(Number),
        totalResults: expect.any(Number),
      })
    );
    expect(result.body.data).not.toEqual([]);
    movieId = result.body.data[0]["id"];

    expect(movieId).not.toBeNaN();
  });

  it("Find Specific Movie based on Id", async function () {
    let result = await request(app)
      .get(`/api/movies/find/${movieId}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${accessToken}`)
      .set("x-refresh", refreshToken);

    expect(result.status).toEqual(200);

    expect(result.body).toHaveProperty("data");
    expect(result.body).toHaveProperty("message");

    expect(result.body.data).toBeDefined();

    expect(result.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        data: expect.any(Object),
      })
    );
    expect(result.headers["content-type"]).toMatch(/json/);
    expect(result.body.data.id).toBe(movieId);
    movieTitle = result.body.data.title;

    expect(movieTitle).toBeDefined();
  });

  it("Search Movies", async function () {
    let result = await request(app)
      .get(`/api/movies/search?searchText=${movieTitle}&page=1`)
      .set("Accept", "application/json");

    expect(result.status).toEqual(200);

    expect(result.body.data).toBeDefined();

    expect(result.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        message: expect.any(String),
        totalPages: expect.any(Number),
        totalResults: expect.any(Number),
      })
    );
    expect(result.headers["content-type"]).toMatch(/json/);
  });

  describe("Movies Genres", () => {
    it("Get Movies Genres", async function () {
      let result = await request(app)
        .get(`/api/movies/genres`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({ genres: expect.any(Array) }),
          message: expect.any(String),
        })
      );

      expect(result.body.data.genres[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        })
      ),
        expect(result.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Favourite Movies", function () {
    describe("Add Favourite Movie", () => {
      it("Access Token must be present", async function () {
        let result = await request(app)
          .post(`/api/movies/favourite/${movieId}`)
          .set("Accept", "application/json");

        expect(result.status).toEqual(403);

        expect(result.body.error).toBe("Forbidden");
        expect(result.body.data).toBeNull();
      });

      it("Add Favourite Movie", async function () {
        let result = await request(app)
          .post(`/api/movies/favourite/${movieId}`)
          .set("Accept", "application/json")
          .set("authorization", `Bearer ${accessToken}`)
          .set("x-refresh", refreshToken);

        expect(result.status).toEqual(200);

        expect(result.body.data).toBeDefined();

        expect(result.body).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            message: expect.any(String),
          })
        );
        expect(result.headers["content-type"]).toMatch(/json/);
      });
    });
    describe("Get All Favourite Movies", () => {
      it("Access Token must be present", async function () {
        let result = await request(app)
          .get(`/api/movies/favourite`)
          .set("Accept", "application/json");

        expect(result.status).toEqual(403);

        expect(result.body.error).toBe("Forbidden");
        expect(result.body.data).toBeNull();
      });

      it("All Favourite Movies", async function () {
        let result = await request(app)
          .get(`/api/movies/favourite`)
          .set("Accept", "application/json")
          .set("authorization", `Bearer ${accessToken}`)
          .set("x-refresh", refreshToken);

        expect(result.status).toEqual(200);

        expect(result.body.data).toBeDefined();

        expect(result.body).toEqual(
          expect.objectContaining({
            data: expect.any(Array),
            message: expect.any(String),
            totalPages: expect.any(Number),
            totalResults: expect.any(Number),
          })
        );
        expect(result.headers["content-type"]).toMatch(/json/);
      });
    });

    describe("Remove Favourite Movie", () => {
      beforeAll(async () => {
        let movies = await Movie.find();
        if (movies && movies.length) {
          movieId = movies[0].id;
        }
      });

      it("Access Token must be present", async function () {
        expect(movieId).not.toBeNaN();
        expect(movieId).toBeDefined();

        let result = await request(app)
          .delete(`/api/movies/favourite/${movieId}`)
          .set("Accept", "application/json");

        expect(result.status).toEqual(403);

        expect(result.body.error).toBe("Forbidden");
        expect(result.body.data).toBeNull();
      });

      it("Remove Movie", async function () {
        let result = await request(app)
          .delete(`/api/movies/favourite/${movieId}`)
          .set("Accept", "application/json")
          .set("authorization", `Bearer ${accessToken}`)
          .set("x-refresh", refreshToken);

        expect(result.status).toEqual(200);

        expect(result.body).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            message: expect.any(String),
          })
        );

        expect(result.body.data).toBeNull();
        expect(result.body.message).toEqual("Removed Successfully");

        expect(result.headers["content-type"]).toMatch(/json/);
      });
    });
  });

  describe("Movies Cast", function () {
    it("Access Token must be present", async function () {
      let result = await request(app)
        .get(`/api/movies/casts/${movieId}`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(403);

      expect(result.body.error).toBe("Forbidden");
      expect(result.body.data).toBeNull();
    });

    it("Get Movie Cast", async function () {
      let result = await request(app)
        .get(`/api/movies/casts/${movieId}`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${accessToken}`)
        .set("x-refresh", refreshToken);

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            cast: expect.any(Array),
            crew: expect.any(Array),
            id: movieId,
          }),
          message: expect.any(String),
        })
      );
      expect(result.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Movies Recommendations", function () {
    it("Access Token must be present", async function () {
      let result = await request(app)
        .get(`/api/movies/recommendations/${movieId}`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(403);

      expect(result.body.error).toBe("Forbidden");
      expect(result.body.data).toBeNull();
    });

    it("Get Recommended Movies", async function () {
      let result = await request(app)
        .get(`/api/movies/recommendations/${movieId}`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${accessToken}`)
        .set("x-refresh", refreshToken);

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          message: expect.any(String),
          totalPages: expect.any(Number),
          totalResults: expect.any(Number),
        })
      );
      expect(result.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Top Rated Movies", function () {
    it("Access Token must be present", async function () {
      let result = await request(app)
        .get(`/api/movies/toprated`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(403);

      expect(result.body.error).toBe("Forbidden");
      expect(result.body.data).toBeNull();
    });

    it("Get Top Rated Movies", async function () {
      let result = await request(app)
        .get(`/api/movies/toprated`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${accessToken}`)
        .set("x-refresh", refreshToken);

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          message: expect.any(String),
          totalPages: expect.any(Number),
          totalResults: expect.any(Number),
        })
      );
      expect(result.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Upcoming Movies", function () {
    it("Access Token must be present", async function () {
      let result = await request(app)
        .get(`/api/movies/upcoming`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(403);

      expect(result.body.error).toBe("Forbidden");
      expect(result.body.data).toBeNull();
    });

    it("Get Upcoming Movies", async function () {
      let result = await request(app)
        .get(`/api/movies/upcoming`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${accessToken}`)
        .set("x-refresh", refreshToken);

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          message: expect.any(String),
          totalPages: expect.any(Number),
          totalResults: expect.any(Number),
        })
      );
      expect(result.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Popular Movies", function () {
    it("Access Token must be present", async function () {
      let result = await request(app)
        .get(`/api/movies/popular`)
        .set("Accept", "application/json");

      expect(result.status).toEqual(403);

      expect(result.body.error).toBe("Forbidden");
      expect(result.body.data).toBeNull();
    });

    it("Get Popular Movies", async function () {
      let result = await request(app)
        .get(`/api/movies/popular`)
        .set("Accept", "application/json")
        .set("authorization", `Bearer ${accessToken}`)
        .set("x-refresh", refreshToken);

      expect(result.status).toEqual(200);

      expect(result.body.data).toBeDefined();

      expect(result.body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          message: expect.any(String),
          totalPages: expect.any(Number),
          totalResults: expect.any(Number),
        })
      );
      expect(result.headers["content-type"]).toMatch(/json/);
    });
  });
});
