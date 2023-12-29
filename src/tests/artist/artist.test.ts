import request from "supertest";

import { app } from "../../app";
import { ArtistFactory } from "./artist.factory";

describe("ArtistController", () => {
  test("POST /api/artist/", async () => {
    const payload = ArtistFactory.load();
    const response = await request(app).post("/api/artist/").send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();

    expect(response.body.firstName).toBe(payload.firstName);
    expect(response.body.lastName).toBe(payload.lastName);
    expect(response.body.stageName).toBe(payload.stageName);
  });

  test("GET /api/artist/", async () => {
    await request(app).post("/api/artist/").send(ArtistFactory.load());
    await request(app).post("/api/artist/").send(ArtistFactory.load());

    const query = {
      page: 1,
      pageSize: 10,
    };

    const response = await request(app).get("/api/artist/").query(query);

    expect(response.statusCode).toBe(200);

    expect(response.body.page).toBe(query.pageSize);
    expect(response.body.pageSize).toBe(query.pageSize);
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.data.length).toBe(2);
  });

  test("GET /api/artist/:artistId/", async () => {
    const payload = ArtistFactory.load();

    const artistId = (await request(app).post("/api/artist/").send(payload))
      .body.id;

    const response = await request(app).get(`/api/artist/${artistId}/`);

    expect(response.statusCode).toBe(200);

    expect(response.body.id).toBe(artistId);
    expect(response.body.artist.firstName).toBe(payload.firstName);
    expect(response.body.artist.lastName).toBe(payload.lastName);
    expect(response.body.artist.stageName).toBe(payload.stageName);
  });

  test("PATCH /api/artist/:artistId/", async () => {
    const artistId = (
      await request(app).post("/api/artist/").send(ArtistFactory.load())
    ).body.id;

    const payload = ArtistFactory.load();
    const response = await request(app).patch(`/api/artist/${artistId}/`).send({
      stageName: payload.stageName,
    });

    expect(response.statusCode).toBe(202);

    expect(response.body.stageName).toBe(payload.stageName);
  });

  test("DELETE /api/artist/:artistId/", async () => {
    const artistId = (
      await request(app).post("/api/artist/").send(ArtistFactory.load())
    ).body.id;

    const response = await request(app).delete(`/api/artist/${artistId}/`);

    expect(response.statusCode).toBe(204);
  });
});
