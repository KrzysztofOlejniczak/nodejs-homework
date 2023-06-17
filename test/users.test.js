const request = require("supertest");
const app = require("../server");

describe("Login Controller", () => {
  it("should return a successful response with status code 200", async () => {
    const response = await request(app).post("/login").send({
      email: "example@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
  });

  it("should return a token in the response", async () => {
    const response = await request(app).post("/login").send({
      email: "example@example.com",
      password: "password123",
    });

    expect(response.body.token).toBeDefined();
  });

  it("should return a user object with email and subscription fields", async () => {
    const response = await request(app).post("/login").send({
      email: "example@example.com",
      password: "password123",
    });

    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(typeof response.body.user.email).toBe("string");
    expect(response.body.user.subscription).toBeDefined();
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
