# Challenge 1

## Project setup

This project represents a project that was submitted by a user and contains a problem they ran into. To get the project into the right state for tackling the problem, do the following:

#### 1. Set up a PostgreSQL database and import data

You find the data to import in [`./db/mydb1.sql`](./db/mydb1.sql). If you're unsure about how to import it into your database, you can learn more about this [here](https://github.com/prisma/prisma2/blob/master/docs/import-and-export-data/postresql.md).

#### 2. Specify database credentials in Prisma schema

Go into [`./prisma/schema.prisma`](./prisma/schema.prisma) and replace the uppercase placeholders in the `url` of the `datasource` with the connection details of your database.

#### 3. Install project dependencies

Run the following command in this directory:

```
npm install
```

#### 4. Run Prisma's development mode

Start Prisma's development mode with the following command:

```
npx prisma2 dev
```

This should now throw the error that's further described below. 

## Problem description

Help! My application broke after I upgraded it to the `preview016` release. I didn't touch anything in my project, just upgraded and now I can't run `prisma2 dev` any more, it always gives me this error:

```
$ npx prisma2 dev
Error in migration engine: [2019-11-25T10:23:33Z INFO  quaint::pool] Starting a PostgreSQL pool with 9 connections.
thread 'tokio-runtime-worker-0' panicked at 'Error parsing the migration steps: Error("unknown field `name`, expected `model`", line: 1, column: 59)', src/libcore/result.rs:1165:5
stack backtrace:
   0: <std::sys_common::backtrace::_print::DisplayBacktrace as core::fmt::Display>::fmt
   1: core::fmt::write
   2: std::io::Write::write_fmt
   3: std::panicking::default_hook::{{closure}}
   4: std::panicking::default_hook
```

How can I fix this problem?

- Hey! As you have upgraded to the `preview016` release, there is a breaking change introduced in Lift's migration engine. Due to this, you need to manually delete the `migrations` folder from your system and drop the `_Migration` table from your database using the `DROP TABLE IF EXISTS _Migration` command.

- After following the above steps, you can run `npx prisma2 dev` and your migrations will be applied successfully!

- You can read more on the breaking changes introduced in the `2.0.0-preview016` version [here](https://github.com/prisma/prisma2/releases/tag/2.0.0-preview016)

- If the above steps still don't work, please feel free to ask for any more help.

#### My thought process

- The way I addressed the problem was finding out that the cause of this issue was due to the version upgrade as the user has mentioned. Then I went through Prisma's changelogs and there was indeed a breaking change in Lift's Migration engine in this specific version.
