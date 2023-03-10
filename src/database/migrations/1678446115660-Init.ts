import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1678446115660 implements MigrationInterface {
    name = 'Init1678446115660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_a5c218dfdf6ad6092fed2230a88" UNIQUE ("key"), CONSTRAINT "UQ_2a26d04373d1dcc04c7f7aee214" UNIQUE ("url"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "value" character varying(500) NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_bb7d685810f5cba57e9ff6756fb" UNIQUE ("value"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "title" character varying(25) NOT NULL, "private" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "banReason" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "last_activity" TIMESTAMP, "verified" boolean NOT NULL DEFAULT false, "isRegisteredWithGoogle" boolean NOT NULL DEFAULT false, "avatarId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_3e1f52ec904aed992472f2be14" UNIQUE ("avatarId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" SERIAL NOT NULL, "title" character varying(25) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageId" integer, "audioId" integer, "authorId" integer, CONSTRAINT "UQ_30f73369783dcb7e7bc57276503" UNIQUE ("title"), CONSTRAINT "REL_715e89ced9f4cd92822da5216b" UNIQUE ("imageId"), CONSTRAINT "REL_500c5387e45c2c9081d19cb5e3" UNIQUE ("audioId"), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" SERIAL NOT NULL, "title" character varying(25) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "UQ_2c85c318a6c245b0eecc2081952" UNIQUE ("title"), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist-tracks" ("playlistId" integer NOT NULL, "trackId" integer NOT NULL, CONSTRAINT "PK_4457557e1d650b3cc5da7034b94" PRIMARY KEY ("playlistId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6e5a3d99b588712f7e07257254" ON "playlist-tracks" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03352f7495dca0666baade1d01" ON "playlist-tracks" ("trackId") `);
        await queryRunner.query(`CREATE TABLE "playlist-likes" ("playlistsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_a641684e38a2191fe896a79f34f" PRIMARY KEY ("playlistsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5adc075fec9a5d2ed283ec9ebd" ON "playlist-likes" ("playlistsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5df7f4705facf6a97a8df694d" ON "playlist-likes" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "user-roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_bbd35da7ec03754f3c8854ebb44" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4fed4eca5f8c36d0152553f7be" ON "user-roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0fb673d5f2747ed1907d19d7d5" ON "user-roles" ("rolesId") `);
        await queryRunner.query(`CREATE TABLE "track-likes" ("usersId" integer NOT NULL, "tracksId" integer NOT NULL, CONSTRAINT "PK_3e9d00a7ac2bc70cfaa2112438b" PRIMARY KEY ("usersId", "tracksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7e31632d898bd5b3875a9f6614" ON "track-likes" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a0972f606237b10019de0e4d8" ON "track-likes" ("tracksId") `);
        await queryRunner.query(`CREATE TABLE "track-listenings" ("usersId" integer NOT NULL, "tracksId" integer NOT NULL, CONSTRAINT "PK_88f60140557517990eef74af021" PRIMARY KEY ("usersId", "tracksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb09df8e3ce6a4251ad43a37a5" ON "track-listenings" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31bbf064f5472b45924d39f366" ON "track-listenings" ("tracksId") `);
        await queryRunner.query(`CREATE TABLE "album-likes" ("usersId" integer NOT NULL, "albumsId" integer NOT NULL, CONSTRAINT "PK_89c1b17ccb8d838302068a013d3" PRIMARY KEY ("usersId", "albumsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b2b0024c3a4ead9a289c6c325e" ON "album-likes" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23cdfc6f568e273aafa4904a3" ON "album-likes" ("albumsId") `);
        await queryRunner.query(`CREATE TABLE "user-followers" ("userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "PK_2b58bf1fb6335dd45cdf8282c08" PRIMARY KEY ("userId", "followerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_66065c6978a92cfda83dca14ed" ON "user-followers" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_29c85f2ed7737a08b6da76b920" ON "user-followers" ("followerId") `);
        await queryRunner.query(`CREATE TABLE "album-tracks" ("albumId" integer NOT NULL, "trackId" integer NOT NULL, CONSTRAINT "PK_b9b20053eda328c94dac73d502e" PRIMARY KEY ("albumId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14251bcc74baa8ae34329f9e4f" ON "album-tracks" ("albumId") `);
        await queryRunner.query(`CREATE INDEX "IDX_186b0ab2d25d4b4f01f5ca31fb" ON "album-tracks" ("trackId") `);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_aa5d498a2f045be2fb71ef98d45" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_715e89ced9f4cd92822da5216b3" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_500c5387e45c2c9081d19cb5e33" FOREIGN KEY ("audioId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_0b185d02cf7187bf562a3b20361" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b22c53f35ef20c28c21637c85f4" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist-tracks" ADD CONSTRAINT "FK_6e5a3d99b588712f7e07257254a" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist-tracks" ADD CONSTRAINT "FK_03352f7495dca0666baade1d01d" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist-likes" ADD CONSTRAINT "FK_5adc075fec9a5d2ed283ec9ebdc" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist-likes" ADD CONSTRAINT "FK_c5df7f4705facf6a97a8df694d5" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user-roles" ADD CONSTRAINT "FK_4fed4eca5f8c36d0152553f7beb" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user-roles" ADD CONSTRAINT "FK_0fb673d5f2747ed1907d19d7d51" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "track-likes" ADD CONSTRAINT "FK_7e31632d898bd5b3875a9f6614f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "track-likes" ADD CONSTRAINT "FK_8a0972f606237b10019de0e4d8e" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "track-listenings" ADD CONSTRAINT "FK_cb09df8e3ce6a4251ad43a37a57" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "track-listenings" ADD CONSTRAINT "FK_31bbf064f5472b45924d39f366b" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "album-likes" ADD CONSTRAINT "FK_b2b0024c3a4ead9a289c6c325e6" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "album-likes" ADD CONSTRAINT "FK_b23cdfc6f568e273aafa4904a34" FOREIGN KEY ("albumsId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user-followers" ADD CONSTRAINT "FK_66065c6978a92cfda83dca14edf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user-followers" ADD CONSTRAINT "FK_29c85f2ed7737a08b6da76b9206" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "album-tracks" ADD CONSTRAINT "FK_14251bcc74baa8ae34329f9e4f5" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "album-tracks" ADD CONSTRAINT "FK_186b0ab2d25d4b4f01f5ca31fb2" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album-tracks" DROP CONSTRAINT "FK_186b0ab2d25d4b4f01f5ca31fb2"`);
        await queryRunner.query(`ALTER TABLE "album-tracks" DROP CONSTRAINT "FK_14251bcc74baa8ae34329f9e4f5"`);
        await queryRunner.query(`ALTER TABLE "user-followers" DROP CONSTRAINT "FK_29c85f2ed7737a08b6da76b9206"`);
        await queryRunner.query(`ALTER TABLE "user-followers" DROP CONSTRAINT "FK_66065c6978a92cfda83dca14edf"`);
        await queryRunner.query(`ALTER TABLE "album-likes" DROP CONSTRAINT "FK_b23cdfc6f568e273aafa4904a34"`);
        await queryRunner.query(`ALTER TABLE "album-likes" DROP CONSTRAINT "FK_b2b0024c3a4ead9a289c6c325e6"`);
        await queryRunner.query(`ALTER TABLE "track-listenings" DROP CONSTRAINT "FK_31bbf064f5472b45924d39f366b"`);
        await queryRunner.query(`ALTER TABLE "track-listenings" DROP CONSTRAINT "FK_cb09df8e3ce6a4251ad43a37a57"`);
        await queryRunner.query(`ALTER TABLE "track-likes" DROP CONSTRAINT "FK_8a0972f606237b10019de0e4d8e"`);
        await queryRunner.query(`ALTER TABLE "track-likes" DROP CONSTRAINT "FK_7e31632d898bd5b3875a9f6614f"`);
        await queryRunner.query(`ALTER TABLE "user-roles" DROP CONSTRAINT "FK_0fb673d5f2747ed1907d19d7d51"`);
        await queryRunner.query(`ALTER TABLE "user-roles" DROP CONSTRAINT "FK_4fed4eca5f8c36d0152553f7beb"`);
        await queryRunner.query(`ALTER TABLE "playlist-likes" DROP CONSTRAINT "FK_c5df7f4705facf6a97a8df694d5"`);
        await queryRunner.query(`ALTER TABLE "playlist-likes" DROP CONSTRAINT "FK_5adc075fec9a5d2ed283ec9ebdc"`);
        await queryRunner.query(`ALTER TABLE "playlist-tracks" DROP CONSTRAINT "FK_03352f7495dca0666baade1d01d"`);
        await queryRunner.query(`ALTER TABLE "playlist-tracks" DROP CONSTRAINT "FK_6e5a3d99b588712f7e07257254a"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b22c53f35ef20c28c21637c85f4"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_0b185d02cf7187bf562a3b20361"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_500c5387e45c2c9081d19cb5e33"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_715e89ced9f4cd92822da5216b3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_aa5d498a2f045be2fb71ef98d45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_186b0ab2d25d4b4f01f5ca31fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14251bcc74baa8ae34329f9e4f"`);
        await queryRunner.query(`DROP TABLE "album-tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29c85f2ed7737a08b6da76b920"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66065c6978a92cfda83dca14ed"`);
        await queryRunner.query(`DROP TABLE "user-followers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23cdfc6f568e273aafa4904a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2b0024c3a4ead9a289c6c325e"`);
        await queryRunner.query(`DROP TABLE "album-likes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31bbf064f5472b45924d39f366"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb09df8e3ce6a4251ad43a37a5"`);
        await queryRunner.query(`DROP TABLE "track-listenings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a0972f606237b10019de0e4d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e31632d898bd5b3875a9f6614"`);
        await queryRunner.query(`DROP TABLE "track-likes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0fb673d5f2747ed1907d19d7d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fed4eca5f8c36d0152553f7be"`);
        await queryRunner.query(`DROP TABLE "user-roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5df7f4705facf6a97a8df694d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5adc075fec9a5d2ed283ec9ebd"`);
        await queryRunner.query(`DROP TABLE "playlist-likes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03352f7495dca0666baade1d01"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e5a3d99b588712f7e07257254"`);
        await queryRunner.query(`DROP TABLE "playlist-tracks"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
