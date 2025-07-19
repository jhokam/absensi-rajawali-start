-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('Laki-Laki', 'Perempuan');

-- CreateEnum
CREATE TYPE "Jenjang" AS ENUM ('Paud', 'Caberawit', 'Pra Remaja', 'Remaja', 'Pra Nikah');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Super Admin', 'Admin', 'User');

-- CreateEnum
CREATE TYPE "Sambung" AS ENUM ('Aktif', 'Tidak Aktif');

-- CreateEnum
CREATE TYPE "PendidikanTerakhir" AS ENUM ('PAUD', 'TK', 'SD', 'SMP', 'SMA/SMK', 'D1-D3', 'S1/D4', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "Keterangan" AS ENUM ('Pendatang', 'Pribumi');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Hadir', 'Izin');

-- CreateTable
CREATE TABLE "Desa" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(50) NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelompok" (
    "id" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(50) NOT NULL,
    "desa_id" INTEGER NOT NULL,

    CONSTRAINT "Kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generus" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "tempat_lahir" VARCHAR(50) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "jenjang" "Jenjang" NOT NULL,
    "nomer_whatsapp" VARCHAR(15),
    "pendidikan_terakhir" "PendidikanTerakhir" NOT NULL,
    "nama_orang_tua" VARCHAR(255),
    "nomer_whatsapp_orang_tua" VARCHAR(15),
    "sambung" "Sambung" NOT NULL DEFAULT 'Tidak Aktif',
    "alamat_tempat_tinggal" VARCHAR(255) NOT NULL,
    "keterangan" "Keterangan" NOT NULL,
    "alamat_asal" VARCHAR(255),
    "kelompok_id" CHAR(3) NOT NULL,

    CONSTRAINT "Generus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presence" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "event_id" UUID NOT NULL,
    "generus_id" UUID NOT NULL,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Desa_nama_key" ON "Desa"("nama");

-- CreateIndex
CREATE INDEX "Desa_nama_idx" ON "Desa"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Kelompok_nama_key" ON "Kelompok"("nama");

-- CreateIndex
CREATE INDEX "Kelompok_nama_idx" ON "Kelompok"("nama");

-- CreateIndex
CREATE INDEX "Generus_nama_jenis_kelamin_jenjang_pendidikan_terakhir_samb_idx" ON "Generus"("nama", "jenis_kelamin", "jenjang", "pendidikan_terakhir", "sambung", "keterangan");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Event_title_key" ON "Event"("title");

-- CreateIndex
CREATE INDEX "Event_title_idx" ON "Event"("title");

-- AddForeignKey
ALTER TABLE "Kelompok" ADD CONSTRAINT "Kelompok_desa_id_fkey" FOREIGN KEY ("desa_id") REFERENCES "Desa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generus" ADD CONSTRAINT "Generus_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "Kelompok"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_generus_id_fkey" FOREIGN KEY ("generus_id") REFERENCES "Generus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
