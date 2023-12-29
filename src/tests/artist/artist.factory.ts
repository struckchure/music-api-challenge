import { faker } from "@faker-js/faker";

export class ArtistFactory {
  static load() {
    return {
      firstName: faker.word.words(1),
      lastName: faker.word.words(1),
      image: faker.image.url(),
      stageName: faker.word.words(2),
    };
  }

  static loadMany(count = 2) {
    return Array().fill(count).map(ArtistFactory.load);
  }
}
