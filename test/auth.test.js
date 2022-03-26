const request = require("supertest");
const helper = require("./helper");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const baseUrl = process.env.TEST_URL;
const adminAccount = {
  email: "admin@encygamedia.space",
  password: "admin",
  token: "",
  wrongEmail: `${helper.randomizer(5)}@${helper.randomizer(5)}.com`,
  wrongPassword: helper.randomizer(5),
  wrongToken: jwt.sign(helper.randomizer(5), process.env.TOKEN_SECRET),
};

describe("Perform Test for - Auth : Login", () => {
  it("( + ) Admin successfuly logged in", async () => {
    await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
      adminAccount.token = r.accessToken;
    });
  });

  it("( - ) Admin failed to logged in - wrong password", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`email=${adminAccount.email}`)
      .send(`password=${adminAccount.wrongPassword}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual(
          "Login failed, please check your email and password again"
        );
      });
  });

  it("( - ) Admin failed to logged in - wrong email", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`email=${adminAccount.wrongEmail}`)
      .send(`password=${adminAccount.password}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual(
          "Login failed, please check your email and password again"
        );
      });
  });

  it("( - ) Admin failed to logged in - empty email", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`email=`)
      .send(`password=${adminAccount.password}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual("User email is mandatory");
      });
  });

  it("( - ) Admin failed to logged in - no email", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`password=${adminAccount.password}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual("User email is mandatory");
      });
  });

  it("( - ) Admin failed to logged in - empty password", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`email=${adminAccount.email}`)
      .send(`password=`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual("User password is mandatory");
      });
  });

  it("( - ) Admin failed to logged in - no password", async () => {
    await request(baseUrl)
      .post("/login")
      .set("Accept", "application/json")
      .send(`email=${adminAccount.email}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual("User password is mandatory");
      });
  });
});

describe("Perform Test for - Auth : Logout", () => {
  it("(   ) Get Admin Token", async () => {
    await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
      adminAccount.token = r.accessToken;
    });
  });

  it("( + ) Admin success to logged out", async () => {
    await request(baseUrl)
      .post("/logout")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAccount.token}`)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(adminAccount.email);
        expect(res.body.status).toEqual("Success");
      });
  });

  it("( - ) Admin failed to logged out - wrong token", async () => {
    await request(baseUrl)
      .post("/logout")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAccount.wrongToken}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual("Logout failed");
      });
  });

  it("( - ) Admin failed to logged out - no auth", async () => {
    await request(baseUrl)
      .post("/logout")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body.errorMessages).toEqual("Logout failed");
      });
  });
});
