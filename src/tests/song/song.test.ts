import request from "supertest";

import { app } from "../../app";
import { SongFactory } from "./song.factory";
import { ArtistFactory } from "../artist/artist.factory";
import { AlbumFactory } from "../album/album.factory";

describe("SongController", () => {
  let artistId: string = "";
  let albumId: string = "";

  beforeAll(async () => {
    const artistResponse = await request(app)
      .post("/api/artist/")
      .send(ArtistFactory.load());
    const albumResponse = await request(app)
      .post("/api/album/")
      .send(AlbumFactory.load());

    artistId = artistResponse.body.id;
    albumId = albumResponse.body.id;
  });

  test("POST /api/song/", async () => {
    const payload = { ...SongFactory.load(), artistId, albumId };
    const response = await request(app).post("/api/song/").send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();

    expect(response.body.albumId).toBe(payload.albumId);
    expect(response.body.artistId).toBe(payload.artistId);
    expect(response.body.image).toBe(payload.image);
    expect(response.body.title).toBe(payload.title);
  });

  test("GET /api/song/", async () => {
    await request(app).post("/api/song/").send(SongFactory.load());
    await request(app).post("/api/song/").send(SongFactory.load());

    const query = {
      page: 1,
      pageSize: 10,
    };

    const response = await request(app).get("/api/song/").query(query);

    expect(response.statusCode).toBe(200);

    expect(response.body.page).toBe(query.pageSize);
    expect(response.body.pageSize).toBe(query.pageSize);
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.data.length).toBe(2);
  });

  test("GET /api/song/:songId/", async () => {
    const payload = SongFactory.load();

    const songId = (await request(app).post("/api/song/").send(payload)).body
      .id;

    const response = await request(app).get(`/api/song/${songId}/`);

    expect(response.statusCode).toBe(200);

    expect(response.body.id).toBe(songId);
    expect(response.body.artist.title).toBe(payload.title);
  });

  test("PATCH /api/song/:songId/", async () => {
    const songId = (
      await request(app).post("/api/song/").send(SongFactory.load())
    ).body.id;

    const payload = SongFactory.load();
    const response = await request(app).patch(`/api/song/${songId}/`).send({
      title: payload.title,
    });

    expect(response.statusCode).toBe(202);

    expect(response.body.title).toBe(payload.title);
  });

  test("DELETE /api/song/:songId/", async () => {
    const songId = (
      await request(app).post("/api/song/").send(SongFactory.load())
    ).body.id;

    const response = await request(app).delete(`/api/song/${songId}/`);

    expect(response.statusCode).toBe(204);
  });
});
