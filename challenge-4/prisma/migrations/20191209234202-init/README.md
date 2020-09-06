# Migration `20191209234202-init`

This migration has been generated by Ryan Dsouza at 12/9/2019, 11:42:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."User" (
  "email" TEXT NOT NULL DEFAULT ''  ,
  "id" TEXT NOT NULL   ,
  "name" TEXT NOT NULL DEFAULT ''  ,
  PRIMARY KEY ("id")
);

CREATE TABLE "lift"."Post" (
  "author" TEXT    REFERENCES "User"(id) ON DELETE SET NULL,
  "content" TEXT    ,
  "createdAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,
  "id" TEXT NOT NULL   ,
  "published" BOOLEAN NOT NULL DEFAULT true  ,
  "title" TEXT NOT NULL DEFAULT ''  ,
  "updatedAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lift"."User.email" ON "User"("email")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20191209234202-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,25 @@
+generator photon {
+  provider = "photonjs"
+}
+
+datasource db {
+  provider = "sqlite"
+  url      = "file:dev.db"
+}
+
+model User {
+  id    String @default(cuid()) @id
+  email String @unique
+  name  String
+  posts Post[]
+}
+
+model Post {
+  id        String   @default(cuid()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  published Boolean  @default(true)
+  title     String
+  content   String?
+  author    User?
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20191209234202-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20191209234202-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```