import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";

const app = createApp();

describe("GET /api/questions", () => {
  it("returns all 310 questions", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(310);
  });

  it("filters by day", async () => {
    const res = await request(app).get("/api/questions?day=1");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(33);
  });
});

describe("GET /api/questions/:id", () => {
  it("returns a single question", async () => {
    const res = await request(app).get("/api/questions/1");
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.options).toHaveLength(4);
  });

  it("returns 404 for missing question", async () => {
    const res = await request(app).get("/api/questions/9999");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/questions", () => {
  let createdId: number;

  it("creates a new question", async () => {
    const res = await request(app)
      .post("/api/questions")
      .send({ question: "Test?", options: ["A", "B", "C", "D"], answer: 0 });
    expect(res.status).toBe(201);
    expect(res.body.data.question).toBe("Test?");
    createdId = res.body.data.id;
  });

  it("returns 400 for invalid input", async () => {
    const res = await request(app)
      .post("/api/questions")
      .send({ question: "", options: ["A", "B"], answer: 5 });
    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    if (createdId) {
      await request(app).delete(`/api/questions/${createdId}`);
    }
  });
});

describe("PUT /api/questions/:id", () => {
  it("updates an existing question", async () => {
    const createRes = await request(app)
      .post("/api/questions")
      .send({ question: "Before", options: ["A", "B", "C", "D"], answer: 0 });
    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/questions/${id}`)
      .send({ question: "After", options: ["A", "B", "C", "D"], answer: 1 });
    expect(res.status).toBe(200);
    expect(res.body.data.question).toBe("After");

    await request(app).delete(`/api/questions/${id}`);
  });

  it("returns 404 for missing question", async () => {
    const res = await request(app)
      .put("/api/questions/9999")
      .send({ question: "X", options: ["A", "B", "C", "D"], answer: 0 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/questions/:id", () => {
  it("deletes a question and returns 204", async () => {
    const createRes = await request(app)
      .post("/api/questions")
      .send({ question: "Delete me", options: ["A", "B", "C", "D"], answer: 0 });
    const id = createRes.body.data.id;

    const res = await request(app).delete(`/api/questions/${id}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 for missing question", async () => {
    const res = await request(app).delete("/api/questions/9999");
    expect(res.status).toBe(404);
  });
});
