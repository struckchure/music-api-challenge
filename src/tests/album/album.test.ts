import request from "supertest";

import { app } from "../../app";
import { AlbumFactory } from "./album.factory";
import { ArtistFactory } from "../artist/artist.factory";

describe("AlbumController", () => {
  const artistPayload = ArtistFactory.load();
  let artistData: typeof artistPayload & { id: string };

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/artist/")
      .send(artistPayload);

    artistData = response.body;
  });

  test("POST /api/album/", async () => {
    const payload = { ...AlbumFactory.load(), artistId: artistData.id };
    const response = await request(app).post("/api/album/").send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();

    expect(response.body.title).toBe(payload.title);
    expect(response.body.cover).toBe(payload.cover);
    expect(response.body.artistId).toBe(payload.artistId);
  });

  test("GET /api/album/", async () => {
    await request(app).post("/api/album/").send(AlbumFactory.load());
    await request(app).post("/api/album/").send(AlbumFactory.load());

    const query = {
      page: 1,
      pageSize: 10,
    };

    const response = await request(app).get("/api/album/").query(query);

    expect(response.statusCode).toBe(200);

    expect(response.body.page).toBe(query.pageSize);
    expect(response.body.pageSize).toBe(query.pageSize);
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.data.length).toBe(2);
  });

  test("GET /api/album/:albumId/", async () => {
    const payload = AlbumFactory.load();

    const albumId = (await request(app).post("/api/album/").send(payload)).body
      .id;

    const response = await request(app).get(`/api/album/${albumId}/`);

    expect(response.statusCode).toBe(200);

    expect(response.body.id).toBe(albumId);
    expect(response.body.title).toBe(payload.title);
    expect(response.body.cover).toBe(payload.cover);
    expect(response.body.artist.id).toBe(payload.artistId);
    expect(response.body.artist.firstName).toBeDefined();
    expect(response.body.artist.lastName).toBeDefined();
    expect(response.body.artist.stageName).toBeDefined();
  });

  test("PATCH /api/album/:albumId/", async () => {
    const albumId = (
      await request(app).post("/api/album/").send(AlbumFactory.load())
    ).body.id;

    const payload = AlbumFactory.load();
    const response = await request(app).patch(`/api/album/${albumId}/`).send({
      title: payload.title,
    });

    expect(response.statusCode).toBe(202);

    expect(response.body.title).toBe(payload.title);
  });

  test("DELETE /api/album/:albumId/", async () => {
    const albumId = (
      await request(app).post("/api/album/").send(AlbumFactory.load())
    ).body.id;

    const response = await request(app).delete(`/api/album/${albumId}/`);

    expect(response.statusCode).toBe(204);
  });
});
