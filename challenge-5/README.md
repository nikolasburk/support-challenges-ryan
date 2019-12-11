# Challenge 5

## Project setup

This project represents a project that was submitted by a user and contains a problem they ran into. To get the project into the right state for tackling the problem, do the following:

#### 1. Set up a PostgreSQL database and import test data

You find the data to import in [`./db/mydb2.sql`](./db/mydb2.sql). If you're unsure about how to import it into your database, you can learn more about this [here](https://github.com/prisma/prisma2/blob/master/docs/import-and-export-data/postresql.md).

#### 2. Specify database credentials in Prisma schema

Go into [`./prisma/schema.prisma`](./prisma/schema.prisma) and replace the uppercase placeholders in the `url` of the `datasource` with the connection details of your database.

#### 3. Install project dependencies

Run the following command in this directory:

```
npm install
```

#### 4. Run the app

Start the app with this command:

```
npm run dev
```

This should now throw the error that's further described below.

## Problem description

The error occured after I upgraded my `prisma2` development dependency to version `preview017`. Whenever I'm trying to start my app, I'm getting this error:

```
$ yarn dev
yarn run v1.19.1
$ ts-node src/index.ts

/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:293
    return new TSError(diagnosticText, diagnosticCodes)
           ^
TSError: ⨯ Unable to compile TypeScript:
src/index.ts:1:24 - error TS2307: Cannot find module '@generated/photon'.

1 import { Photon } from '@generated/photon'
                         ~~~~~~~~~~~~~~~~~~~

    at createTSError (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:293:12)
    at reportTSError (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:297:19)
    at getOutput (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:399:34)
    at Object.compile (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:457:32)
    at Module.m._compile (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:530:43)
    at Module._extensions..js (internal/modules/cjs/loader.js:770:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/nikolasburk/Desktop/css-hiring-challenge/challenge-2/node_modules/ts-node/src/index.ts:533:12)
    at Module.load (internal/modules/cjs/loader.js:628:32)
    at Function.Module._load (internal/modules/cjs/loader.js:555:12)
    at Function.Module.runMain (internal/modules/cjs/loader.js:822:10)
error Command failed with exit code 1.
```

Help please!!!

## Answer

- Hi! This issue that you're facing is due to a breaking change introduced in `2.0.0-preview017`. Before this version, PhotonJS was generated in the `node_modules` in the `@generated/photon` folder. In this version and forward, PhotonJS will be generated in `node_modules` in the `@prisma/photon` folder. So to fix your issue, you just need to update your **1st** line in `index.ts` and replace `@generated/photon` with `@prisma/photon`. This should make it work!

- I also noted that in your project when you run `yarn` or `npm install`, you will get a warning that looks something like this
`@prisma/photon@2.0.0-preview018 is not compatible with prisma2@2.0.0-preview017.1. Their versions need to be equal.`

- To get rid of this warning, you need to either downgrade `@prisma/photon` to version `2.0.0-preview017.1` or upgrade `prisma2` to version `2.0.0-preview018`. 

- After you upgrade/downgrade any one of the following packages mentioned above, the warning should go away. You can read more about the changes made to Prisma2 in version `2.0.0-preview017` [here](https://github.com/prisma/prisma2/releases/tag/2.0.0-preview017)

#### My thought process

- The advantage to analyzing this problem is that I have already faced this as I regularly keep updating `Prisma` and `Nexus` along with their dependencies in my `prisma-nexus` project. Due to this, I found that I had faced the same issue and `@generated/photon` was throwing an error due to a breaking change in how PhotonJS is generated.
