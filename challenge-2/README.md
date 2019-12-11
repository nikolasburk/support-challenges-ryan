# Challenge 2

## Problem description

Hello! I am starting a new project where I want to build a REST API that's connected to a MySQL database. I have looked into different ways of talking to a database in Node.js and found three main options:

- knex.js
- Sequelize
- Photon.js

I'm not a SQL expert so I'd like to avoid working too low level. Any idea which of these options might be the most appropriate for me and why?


## Answer

Hi! A great question indeed! From your options, **Photon** is the most appropriate solution for you for the following reasons.

- You mentioned that you do not want to work at a very low level. Photon provides you the methods to do just that. You just need to create your models and Photon will automatically generate the required methods for you to fetch data from your database. Knex being a query builder, you would have to write more code to achieve the same result that Photon provides you with minimal effort.

- For any developer, the DX (developer experience) is important. So when you're accessing data from your database, you would love to know what type of methods you can access. Here Photon shines from the rest. Photon provides you with built-in types and whenver you want to query your DB, Photon will give you suggestions based on the types it creates from your models in TypeScript. You as the developer do not need to second guess what you will be typing next. Photon gives you intellisense and code-completion for all of your queries to the models that you have created for your DB which Sequelize and Knex don't. This will give you more confidence in the code you write and will be bug-free as well.

Here is a comparision chart for your reference [Prisma & Sequelize](https://www.prisma.io/docs/understand-prisma/prisma-vs-traditional-orms/prisma-vs-sequelize-c4fk/)

You can go ahead and choose Photon with confidence! Let me know if you have any more questions regarding the above.
