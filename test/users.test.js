const request = require("supertest");
const app = "http://localhost:3000";

const user = {
  email: `test${Math.random(1000)}@example.com`,
  password: "Test1234!",
};

describe("Signup & Login Controller", () => {
  it("SIGNUP>> should return a successful response with status code 201", async () => {
    const response = await request(app).post("/api/users/signup").send(user);

    expect(response.statusCode).toBe(201);
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

    console.log(response.body.data.user);

    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
    expect(typeof response.body.data.user.email).toBe("string");
    expect(response.body.data.user.subscription).toBeDefined();
    expect(typeof response.body.data.user.subscription).toBe("string");
  });
});
