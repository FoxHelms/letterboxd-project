import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFilm1713128147689 implements MigrationInterface {
    name = 'InitFilm1713128147689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "film" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "film" ADD "letterboxdId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "letterboxdId"`);
        await queryRunner.query(`DROP TABLE "film"`);
    }

}
