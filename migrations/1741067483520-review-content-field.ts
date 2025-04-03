import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewContentField1741067483520 implements MigrationInterface {
    name = 'ReviewContentField1741067483520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "content" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "content"`);
    }

}
