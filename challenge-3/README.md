# Challenge 3

## Project setup

This project represents a project that was submitted by a user and contains a problem they ran into. To get the project into the right state for tackling the problem, do the following:

#### 1. Run Prisma's development mode

Start Prisma's development mode with the following command:

```
npx prisma2 dev
```

#### 2. Seed the database

You can seed the database using [`script.ts`](./script.ts):

```
npm run dev
```

You're now readt to start working on the problem below.

## Problem description

Hello! I want to update my database schema to split the `name` column of the `User` table into two parts: `firstName` and `lastName`. The problem is that I already have production data in my database and I'm not sure how I can achieve the migration. I don't think Prisma supports this kind of migration where the data needs to be migrated in addition to a schema change, is there a workaround to achieve the migration without losing data but actually splitting the existing `name` values into two and still use Prisma afterwards?

## Answer

Hey, a great question indeed! Currently Prisma's Lift engine doesn't support this kind of migration, so as a workaround you would need to implement the following steps.

1. Create two fields `firstName` and `lastName` of the `String` type in your `User` model. The `firstName` and `lastName` fields should be optional as we won't be adding any data right now to those fields. Your `schema.prisma` should look something like this.

```prisma
generator photon {
  provider = "photonjs"
}

datasource db {
  provider = "sqlite"
  url      = "file:dev.db"
}

model User {
  id        String  @default(cuid()) @id
  name      String
  firstName String?
  lastName  String?
}
```

2. Create a migration using `npx prisma2 lift save --name 'split_name'` and then apply the migration using `npx prisma2 lift up`. Lastly, run `npx prisma2 generate` to generate the Photon types for the two new fields added.

3. Create a file that runs this script that will add the values from `name` to `firstName` and `lastName` correctly. This needs to be done because if you remove the name field, lift will give you a warning that you will lose your data. Which is why we need to save the data to the `firstName` and `lastName` fields first. You can write a script that does something like this:

```ts
import { Photon } from '@prisma/photon'
const photon = new Photon()

async function main() {
  const users = await photon.users()
  for (let user of users) {
    const [firstName, lastName] = user.name.split(' ')
    await photon.users.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
      },
    })
  }
}

main().finally(async () => {
  await photon.disconnect()
})
```

4. Run the above script using `ts-node` like this: `npx ts-node the-above-script.ts`

5. After this successfully runs, you can inspect your database and find that the `firstName` and `lastName` fields have been updated.

6. Now you can safely delete the `name` field safely from your `schema.prisma` and remove the `firstName` field from being optional as all the data has been successfully migrated. Your final `schema.prisma` should look something like this:

```prisma
generator photon {
  provider = "photonjs"
}

datasource db {
  provider = "sqlite"
  url      = "file:dev.db"
}

model User {
  id        String  @default(cuid()) @id
  firstName String
  lastName  String?
}
```

7. As the last step, you can create a migration using `npx prisma2 lift save --name 'removed_name'` and then apply the migration using `npx prisma2 lift up`. As a final command, run `npx prisma2 generate` for Photon to generate types for your latest schema.

I hope this solves your query. Do let me know if you face any other issues.
