# Challenge 4

## Project setup

This project represents a project that was submitted by a user and contains a problem they ran into. To get the project into the right state for tackling the problem, do the following:

#### 1. Specify database and database credentials in Prisma schema

For this challenge, you can use whatever database you prefer (and is supported by Prisma). Just configure the database connection in [`./prisma/schema.prisma`](./prisma/schema.prisma).

#### 2. Install project dependencies

Run the following command in this directory:

```
npm install
```

#### 3. Run Prisma's development mode

Start Prisma's development mode with the following command:

```
npx prisma2 dev
```

This performs the initial migration of your database and generates Photon.js.

#### 4. Seed the database

You can seed the database with the data in [`./prisma/seed.ts`](./prisma/seed.ts):

```
npm run seed
```

#### 5. Start the GraphQL server

You can start the GraphQL server using this command:

```
npm run dev
```

This should now throw the error that's further described below. 

## Problem description

I want to add a new feature to my GraphQL API where posts can have "views" (i.e. a sort of score that indicates how often a post has been viewed and therefore gives a sense of the popularity of the post). I also want to be able to query the top 3 posts of any user with a query similar to this:

```graphql
query {
  users {
    id
    name
    topThreePosts {
      id
      title
    }
  }
}
```

What are the necessary steps to achieve this? Also, would there be a way to make the "number" of top posts configurable in the API somewhow?

## Answer

Hi! Thanks for asking this question. Prisma already supports this functionality and you can easily add this by implementing the following steps.

1. In the `schema.prisma` file, create a new field in your Post model named `views` and give it a default value of `0`. Your `Post` model should look something like this.

```prisma
model Post {
  id        String   @default(cuid()) @id
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(true)
  views     Int      @default(0)
  title     String
  content   String?
  author    User?
}
```

2. The next step is to save and apply the migration. Run the commands `npx prisma2 lift save --name 'add_views'` and then run `npx prisma2 lift up` to apply the migration. If you inspect your DB, you will be able to see the `views` field in the Post table with a default value of 0.

3. The next step is to update the `User` object in the `schema.ts` file as follows:

```ts
const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.name()
    t.model.posts({
      pagination: { first: true },
      order: { views: true }
    })
  },
})
```

This will make sure that the posts are ordered by the **popularity** (i.e. `views`) and also a limit that would give you the ability to configure the number of posts that you want to fetch.

4. The final step is to create a query for the `users` so that we can call the query in the same way that you have mentioned above. So you would need to add a new field in the `Query` object that would fetch your users with the posts.

```ts
t.list.field('users', {
  type: 'User',
  resolve: (_parent, _args_, ctx) => {
    return ctx.photon.users()
  },
})
```

5. Your final `schema.ts` should look something like this

```ts
import { nexusPrismaPlugin } from 'nexus-prisma'
import { idArg, makeSchema, objectType, stringArg } from 'nexus'
import { Photon } from '@prisma/photon'

const photon = new Photon()
const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.name()
    // to get top viewed posts
    t.model.posts({
      pagination: { first: true },
      order: { views: true }
    })
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.title()
    t.model.content()
    t.model.published()
    t.model.author()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.post({
      alias: 'post',
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return ctx.photon.posts.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return ctx.photon.posts.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })

    // the users query
    t.list.field('users', {
      type: 'User',
      resolve: (_parent, _args_, ctx) => {
        return ctx.photon.users()
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOneUser({ alias: 'signupUser' })
    t.crud.deleteOnePost()

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return ctx.photon.posts.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: {
        id: idArg(),
      },
      resolve: (_, { id }, ctx) => {
        return ctx.photon.posts.update({
          where: { id },
          data: { published: true },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Post, User],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: __dirname + '/generated/nexus.ts',
    schema: __dirname + '/generated/schema.graphql'
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/photon',
        alias: 'photon',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
```

6. And you're done! Now you can run `npm run dev` or `yarn dev` to view your query in the playground. The query that you would need to make would be something like this.

```graphql
query {
  users {
    id
    name
    posts(orderBy: { views: desc }, first: 3) {
      id
      title
    }
  }
}
```

This will give you the top 3 posts of the users! Let me know if this solves it for you or if you have any other query.
