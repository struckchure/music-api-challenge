import { faker } from "@faker-js/faker";

export class SongFactory {
  static load() {
    return {
      artistId: faker.string.nanoid(),
      albumId: faker.string.nanoid(),
      image: faker.image.url(),
      title: faker.word.words(2),
    };
  }

  static loadMany(count = 2) {
    return Array().fill(count).map(SongFactory.load);
  }
}
