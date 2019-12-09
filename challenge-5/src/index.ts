import { Photon } from '@prisma/photon'
import * as bodyParser from 'body-parser'
import * as express from 'express'

const photon = new Photon()
const app = express()

app.use(bodyParser.json())

app.post(`/user`, async (req, res) => {
  const result = await photon.users.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
})

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await photon.posts.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})

app.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await photon.posts.update({
    where: { id },
    data: { published: true },
  })
  res.json(post)
})

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await photon.posts.delete({
    where: {
      id,
    },
  })
  res.json(post)
})

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await photon.posts.findOne({
    where: {
      id,
    },
  })
  res.json(post)
})

app.get('/feed', async (req, res) => {
  const posts = await photon.posts.findMany({ where: { published: true } })
  res.json(posts)
})

app.get('/filterPosts', async (req, res) => {
  const { searchString } = req.query
  const draftPosts = await photon.posts.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString,
          },
        },
        {
          content: {
            contains: searchString,
          },
        },
      ],
    },
  })
  res.json(draftPosts)
})

const server = app.listen(3000, () =>
  console.log(
    '🚀 Server ready at: http://localhost:3000\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#5-using-the-rest-api',
  ),
)
