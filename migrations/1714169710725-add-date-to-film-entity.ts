import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateToFilmEntity1714169710725 implements MigrationInterface {
    name = 'AddDateToFilmEntity1714169710725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "film" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "film" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "created"`);
    }

}
