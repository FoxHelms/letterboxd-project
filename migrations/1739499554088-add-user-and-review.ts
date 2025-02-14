import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAndReview1739499554088 implements MigrationInterface {
    name = 'AddUserAndReview1739499554088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "star_rating" integer, "liked" boolean NOT NULL, "userId" uuid, "filmId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_films" ("user_id" uuid NOT NULL, "film_id" uuid NOT NULL, CONSTRAINT "PK_78cfab52482fa9a6d656e986b37" PRIMARY KEY ("user_id", "film_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46bde6d8f94ce976a90e8d130c" ON "user_films" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9638e19f3e19d882fe4a8657e5" ON "user_films" ("film_id") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_films" ADD CONSTRAINT "FK_46bde6d8f94ce976a90e8d130ce" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_films" ADD CONSTRAINT "FK_9638e19f3e19d882fe4a8657e56" FOREIGN KEY ("film_id") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_films" DROP CONSTRAINT "FK_9638e19f3e19d882fe4a8657e56"`);
        await queryRunner.query(`ALTER TABLE "user_films" DROP CONSTRAINT "FK_46bde6d8f94ce976a90e8d130ce"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9638e19f3e19d882fe4a8657e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46bde6d8f94ce976a90e8d130c"`);
        await queryRunner.query(`DROP TABLE "user_films"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
