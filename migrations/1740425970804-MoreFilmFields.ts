import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreFilmFields1740425970804 implements MigrationInterface {
  name = 'MoreFilmFields1740425970804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "film" ADD "releaseYear" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "averageRating" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "runtime" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "genre" "public"."film_genre_enum" array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "themes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "watchedCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "fansCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "likesCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "reviewsCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "listsCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "tagline" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "film" ADD "fullSummary" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "fullSummary"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "tagline"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "listsCount"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "reviewsCount"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "likesCount"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "fansCount"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "watchedCount"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "themes"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "genre"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "runtime"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "averageRating"`);
    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "releaseYear"`);
  }
}
