import { faker } from "@faker-js/faker";

export class AlbumFactory {
  static load() {
    return {
      title: faker.word.words(4),
      cover: faker.image.url(),
      artistId: faker.string.nanoid(),
    };
  }

  static loadMany(count = 2) {
    return Array().fill(count).map(AlbumFactory.load);
  }
}
