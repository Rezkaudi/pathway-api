import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1757178527288 implements MigrationInterface {
    name = 'Migrations1757178527288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pathways" DROP CONSTRAINT "PK_b40c6cfe51f12dd437294d0a09b"`);
        await queryRunner.query(`ALTER TABLE "pathways" ADD CONSTRAINT "PK_b602565a77609615246a6147847" PRIMARY KEY ("_id", "userId")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "links" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "tissue" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "diseaseInput" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "reactions" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "pubMeds" SET DEFAULT '[]'::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "pubMeds" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "reactions" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "diseaseInput" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "pathways" ALTER COLUMN "tissue" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "links" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "pathways" DROP CONSTRAINT "PK_b602565a77609615246a6147847"`);
        await queryRunner.query(`ALTER TABLE "pathways" ADD CONSTRAINT "PK_b40c6cfe51f12dd437294d0a09b" PRIMARY KEY ("_id")`);
    }

}
