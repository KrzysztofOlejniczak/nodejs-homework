const request = require("supertest");
const User = require("../service/schemas/user");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDb = process.env.DB_HOST;

// const app = "http://localhost:3000";
const app = require("../app");
const user = {
  email: `test${Math.random(1000)}@example.com`,
  password: "Test1234!",
};

describe("Signup & Login Controller", () => {
  beforeAll(async () => {
    mongoose.connect(uriDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`User for testing: ${user.email}`);
  });

  afterAll(async () => {
    await User.deleteOne({ email: user.email });
    console.log(`Tested user (${user.email}) deleted.`);
    await mongoose.disconnect();
  });

  it("SIGNUP>> should return a successful response with status code 201 and user object with email and subscription fields", async () => {
    const response = await request(app).post("/api/users/signup").send(user);

    expect(response.statusCode).toBe(201);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
    expect(typeof response.body.data.user.email).toBe("string");
    expect(response.body.data.user.subscription).toBeDefined();
    expect(typeof response.body.data.user.subscription).toBe("string");
  });

  it("LOGIN>> should return a successful response with status code 200", async () => {
    const response = await request(app).post("/api/users/login").send(user);

    expect(response.statusCode).toBe(200);
  });

  it("LOGIN>> should return a token in the response", async () => {
    const response = await request(app).post("/api/users/login").send(user);

    expect(response.body.data.token).toBeDefined();
  });

  it("LOGIN>> should return a user object with email and subscription fields", async () => {
    const response = await request(app).post("/api/users/login").send(user);

    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
    expect(typeof response.body.data.user.email).toBe("string");
    expect(response.body.data.user.subscription).toBeDefined();
    expect(typeof response.body.data.user.subscription).toBe("string");
  });
});
