# Make an Internal Docs System

Many companies face the issue of how to maintain internal documentation that connects all of the departments or products. Notion or other SaaS tools are the common answer to try and address this problem, but they usually miss some of the things you might want to customize internally.

That's why we're going to make a Next.js app that will let us build our own internal docs system. We'll be able to upload screenshots or other images to Cloudinary and render Markdown on the page. You'll be able to expand this system to meet your own needs.

## Setting up a few things

Before we jump into writing code, there are a few tools we need to have in place. First, we'll be using Cloudinary as the host for any images we need in our docs. So go [make a free account here](https://cloudinary.com/users/register/free).

We'll be working with a PostgreSQL database to save the Markdown and any other data associated with a document. If you don't have a local instance, you can [download it for free here](https://www.postgresql.org/download/). Make sure you note your username and password. You'll need that for the connection string to let your app interact with the database.

## Generating the Next app

Now that we have the tools ready to use, let's create a new Next app by running the following command in your terminal.

```bash
$ yarn create next-app --typescript
```

You will be prompted for a project name in the terminal. I've creatively called this app `internal-docs`, but feel free to name it anything. This will generate a fully functional project that we can modify.

There's one file we can go ahead and edit now. We know that we'll be working with Cloudinary for images and the Next app needs to know that it's ok to reference Cloudinary in the image sources. In the root of your project, open the `next.config.js` file and add the following code.

```js
// next.config.js
...
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com']
  }
...
```

Now let's go ahead and install the packages that we'll be using with the following command.

```bash
$ yarn add autoprefixer postcss tailwindcss axios prisma @prisma/client @heroicons/react
```

We'll be using Tailwind CSS to handle our styles so there's a little bit of setup we need to do for this package.

### Initializing Tailwind CSS

With the packages installed, we can run the following CLI command to intialize Tailwind in our project.

```bash
$ npx tailwindcss init -p
```

This will generate a couple of files that let our project use Tailwind. We need to edit the `tailwind.config.js` file so that it applies the styles to the files in our project. Open this file and add the following code.

```js
// tailwind.config.js

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
...
```

Now we need to update the stylesheet in the project to use the Tailwind directives. Go to the `styles` directory and open the `global.css` file. You can delete all of the code out of this file and add the following.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

These directives let us use all of the Tailwind functionality throughout the project because it's imported in the `_app.tsx` file, which is the top level component in the project. That's all for our styles. Now we can setup the database schema.

## Using Prisma for database operations

Most apps use some type of ORM that make it easier to interact with the database and we're going to use Prisma. This package was part of the ones we installed towards the beginning. Now we can initialize it in the project with this command:

```bash
$ npx prisma init
```

This will generate a `.env` file at the root of your project and a new `prisma` directory that has a `schema.prisma` file. The schema file connects the whole app to Postgres and is also where we will define the database schema. Let's start by editing the `.env` file and update the connection string with your local Postgres username, password and database name. So that file should look similar to this.

```env
# .env

DATABASE_URL="postgresql://username:password@localhost:5432/product_inventory"
```

Now we can dig into the `schema.prisma` file and start defining the schema that we'll eventually migrate to the database. So open that file and add the following code.

```ts
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Document {
  id      String @id @default(uuid())
  title   String
  content String
}
```

The `Document` model includes all of the fields we need in the database. The `content` field is going to store all of our Markdown which will contain any images that are uploaded to Cloudinary. This is the only model we'll have to get this started, but feel free to add on to this as you see fit.

### Running the database migration

Now that the model is in place, we can run a migration to get this table schema into our database. In your terminal, run the following command.

```bash
$ npx prisma migrate dev --name init
```

This will create a new database for you if you don't have it already and it will connect to the database and create a table called `Document` with the fields we defined. Now we can dive into the core functionality of the app and finally write some code.

## Building CRUD functionality for documents

The base functionality we need for this system is the ability to look at all of the documents we have available, some way to add and edit docs, and a way to delete them. We'll start by creating the API routes that will handle all of this. Go to the `pages > api` directory and delete the placeholder `hello.ts` file and add a new file called `new-doc.ts`.

### Creating a new document

This will be the route we call to create a new document. Open this new file and add the following code.

```ts
// new-doc.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export type Document = {
  title: string;
  content: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docData = req.body;
  const newDoc = await prisma.document.create({
    data: {
      title: docData.title,
      content: docData.content,
    },
  });

  res.status(200).json(newDoc);

  await prisma.$disconnect();
}
```

This code allows us to connect to Postgres using Prisma and then it creates a new record for the document. It takes the body from the request and uses that data to define the document. If you were working on a production-level app, you'd need to include some validation around these user inputs to avoid potential security vulnerabilities.

### Looking at existing documents

Let's add a new file called `docs.ts` in the `pages > api` directory. This is how we will fetch all of the existing documents or a specific document by its ID. Now open your `docs.ts` file and add the following code.

```ts
// docs.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document | Document[] | null>
) {
  const { id } = req.query;

  if (id) {
    const document = await prisma.document.findUnique({
      where: {
        id: id as string,
      },
    });

    res.status(200).json(document);

    await prisma.$disconnect();
  } else {
    const documents = await prisma.document.findMany();

    res.status(200).json(documents);

    await prisma.$disconnect();
  }
}
```

This code checks if there is an `id` query in the request URL. If there is one, this will query the database for a specific document. Without the `id` query, we return all of the documents from the database. Another thing for production to note is that you still need validation for the `id` value and possibly some paganation for returning all the docs.

### Editing documents

Sometimes internal processes will change or big features will need a lot of research before work starts, so being able to update docs with new information is crucial. In the `pages > api` directory, add a new file called `edit-doc.ts` and add the following code.

```ts
// edit-doc.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docData = req.body;

  const updatedDoc = await prisma.document.update({
    where: { id: docData.id },
    data: {
      title: docData.title,
      content: docData.content,
    },
  });

  res.status(200).json(updatedDoc);

  await prisma.$disconnect();
}
```

Here, the document ID is sent as part of the request body and we use it along with the updated data to the database to change the record. More production notes, you'd want to record when these changes happened and who did them as well and of course you can't forget the validation. You'd also want some error handling just in case you run into issues updating a document.

### Deleting a document

This can be a fun part of documentation maintenance. When you can go through and delete documentation, it usually means that things are moving forward and changing. So let's add one more file to the `pages > api` called `delete-doc.ts` and add the following code to it.

```ts
// delete-doc.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docId = req.body;

  const deleteProduct = await prisma.document.delete({
    where: { id: docId },
  });

  res.status(200).json(deleteProduct);

  await prisma.$disconnect();
}
```

This gets the document ID from the request body and runs the delete query in our database. An important thing to note is how we keep disconnecting from Prisma at the end of all of the responses. This makes sure we don't accidentally end up with 10 open Prisma clients.

We just finished making all of the back-end CRUD functionality for this app, so it's time to build out the front-end that employees can interact with.

## Displaying the documents

All of the docs will be displayed in a table and employees will be able to click on buttons in the rows to view, edit, or update an individual document. There will also be a button to allow employees to add new docs. Let's start by building the functionality for that button.

### The new document button

Go to the `pages` directory and open the `index.tsx` file. Delete everything inside the `<main>` element. The first element we're going to add is the button to create a new document. Update your file to the following code.

```tsx
// index.tsx

import type { NextPage } from "next";
import Head from "next/head";
import { PlusCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Internal Docs</title>
        <meta name="description" content="This is our internal docs system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/doc" passHref>
          <div className="flex gap-2 bg-gray-700 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-full m-6">
            <PlusCircleIcon className="h-6 w-6 text-green-500" />
            Add new document
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Home;
```

This button links to the new document page that will have the form you add your content to. It'll look like this in the browser if you run the app with `yarn dev`.

![add document button](https://res.cloudinary.com/mediadevs/image/upload/v1649949108/e-603fc55d218a650069f5228b/h5cztjwssz9pklhyfokz.png)

### New document page

Since we have the button linking to a page called `doc`, let's add some new things to our project directory. Create a new folder in the `pages` directory called `docs`. Inside this folder, add a new file called `index.tsx` and add the following code.

```tsx
// docs > index.tsx

import axios from "axios";
import Link from "next/link";

export default function NewDoc() {
  const submitDoc = async (e) => {
    e.preventDefault();

    const document = {
      title: e.target.title.value,
      content: e.target.content.value,
    };

    await axios.post("/api/new-doc", document);
  };

  return (
    <div className="mt-4 ml-4">
      <h2 className="text-3xl mb-12">New Document</h2>
      <form className="w-full mb-12" onSubmit={submitDoc}>
        <div className="mb-6">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="title"
          >
            Title
          </label>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="product-name"
              name="title"
              type="text"
            />
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label
              className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
              htmlFor="content"
            >
              Content
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded block w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              rows={50}
              id="content"
              name="content"
            ></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center gap-6">
          <div className="md:w-1/3"></div>
          <div>
            <div className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              <Link href="/" passHref>
                Back
              </Link>
            </div>
          </div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Save Document
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
```

On this page, we created a form that takes the title and content values for the new document and it calls the `new-doc` endpoint when an employee submits the form and it goes back to the main page when they cancel. A few more notes on production improvements, it would be great to have some kind of message show when an employee submits the form and have form validation on this page. Here's what the new document page looks like.

![new document form, buttons are below the content area](https://res.cloudinary.com/mediadevs/image/upload/v1649948595/e-603fc55d218a650069f5228b/rauopj5ayqwkuwvvatte.png)

Now that we've added a document, let's make the table for the main page to display all of the documents we have.

### Displaying all the documents

To get all of the documents we have available, we're going to add some new functionality to the `pages > index.tsx` file. Open this file and update the existing code to match the following code.

```tsx
// pages > index.tsx

import Head from "next/head";
import {
  PencilAltIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { Document } from "./api/new-doc";
import axios from "axios";

const Home = ({ documents }: { documents: Document[] }) => {
  return (
    <div>
      <Head>
        <title>Internal Docs</title>
        <meta name="description" content="This is our internal docs system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/doc" passHref>
          <div className="flex gap-2 bg-gray-700 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-full m-6">
            <PlusCircleIcon className="h-6 w-6 text-green-500" />
            Add new document
          </div>
        </Link>
        <div className="flex flex-col gap-2">
          {documents.length > 0 ? (
            documents.map((doc: Document) => (
              <div key={doc.id} className="flex gap-6 border-b-2 w-full p-4">
                <div>{doc.title}</div>
                <Link passHref href={`/doc/${doc.id}`}>
                  <PencilAltIcon className="h-6 w-6 text-teal-500" />
                </Link>
                <TrashIcon className="h-6 w-6 text-rose-400" />
              </div>
            ))
          ) : (
            <div>Add some new products</div>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const docsRes = await axios.get("http://localhost:3000/api/docs");

  const documents = await docsRes.data;

  return {
    props: {
      documents,
    },
  };
}

export default Home;
```

We've added a few more imports to get new icons and the `axios` package. There's also a new called to the `getServerSideProps` method and that's where we call the back-end to get all of the documents we have in our database table. It returns the `documents` array as a prop to the `Home` component.

After the new document button, we check the length of the array and show a list of documents or a message inviting users to make a new document. This is what the app will look like with the document we added earlier.

![one document record in the table](https://res.cloudinary.com/mediadevs/image/upload/v1649963512/e-603fc55d218a650069f5228b/c1l3vygamsdv1hgq5laj.png)

Now we can add the deletion functionality since we have that button on the document record and it'll be fast to implement.

### Deleting a document

We need to add a function that calls the back-end with the correct document ID to delete. Add the `deleteDoc` function at the beginning of the `Home` component like below.

```tsx
// pages > index.tsx

...
const Home = ({ documents }: { documents: Document[] }) => {
  const deleteDoc = async (docId: string) => {
    await axios.delete("/api/delete-doc", { data: docId });
  };

  return (
    <div>
      <Head>
        <title>Internal Docs</title>
        <meta name="description" content="This is our internal docs system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
...
```

Then we'll call this function when someone clicks the trash icon on the row with the following code change.

```tsx
// pages > index.tsx

...
<Link passHref href={`/doc/${doc.id}`}>
  <PencilAltIcon className="h-6 w-6 text-teal-500" />
</Link>
<TrashIcon
  className="h-6 w-6 text-rose-400"
  onClick={() => deleteDoc(doc.id)}
/>
...
```

That's all we needed for the delete functionality! Let's finish up with the edit functionality.

### Edit document page

We'll need to add a new page to the `pages > doc` directory called `[id].tsx`. This page will show a form with the current document title and content and let employees edit the fields save the changes. Add the following code to this new file.

```tsx
// pages > doc > [id].tsx

import axios from "axios";
import Link from "next/link";
import { Document } from "../api/new-doc";

export default function EditDoc({ doc }: { doc: Document }) {
  const submitDoc = async (e) => {
    e.preventDefault();

    const modifiedDoc = {
      id: doc.id,
      title: e.target.title.value,
      content: e.target.content.value,
    };

    await axios.patch("/api/edit-doc", modifiedDoc);
  };

  return (
    <div className="mt-4 ml-4">
      <h2 className="text-3xl mb-12">Edit {doc?.title || "Document"}</h2>
      <form className="w-full mb-12" onSubmit={submitDoc}>
        <div className="mb-6">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="title"
          >
            Title
          </label>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="product-name"
              name="title"
              type="text"
              defaultValue={doc ? doc.title : ""}
            />
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label
              className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
              htmlFor="content"
            >
              Content
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded block w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              rows={50}
              id="content"
              name="content"
              defaultValue={doc ? doc.content : ""}
            ></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center gap-6">
          <div className="md:w-1/3"></div>
          <div>
            <div className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              <Link href="/" passHref>
                Back
              </Link>
            </div>
          </div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Save Document
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const docId = context.params.id;

  const docRes = await axios.get("http://localhost:3000/api/docs", {
    params: {
      id: docId,
    },
  });

  const doc = await docRes.data;

  return {
    props: {
      doc,
    },
  };
}
```

This page starts off by calling the `getServerSideProps` method to fetch the data for the selected document based on the document ID passed in the URL and returns this as a prop to the `EditDoc` component.

Then we render a form that uses the document data as the default values for the fields so that an employee can start making direct edits. There's also a function that will save any changes to the fields via a call to the back-end once the form is submitted.

Just to keep up with the other sections, there are a few things you can do to improve this for production. Having some kind of authorization around who can make edits to certain documents could be useful. Adding a way to handle real-time team editing or locking a document until someone is finished editing it can help prevent conflicts. Of course form validation will always help with some security vulnerabilities.

That's all! You now have an internal docs system template that you can expand in a number of directions.

## Finished code

You can check out the complete code in the [`internal-docs` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/internal-docs). You can also check it out in [this Code Sandbox](https://codesandbox.io/s/restless-water-nyh02q).

<CodeSandBox
  title="restless-water-nyh02q"
  id="restless-water-nyh02q"
/>

## Conclusion

There are a lot of different needs that your company or team might need for documentation and this gives you a simple starting point. You can make this as complex as you want or you can keep it as simple as you like. Either way, it'll be a fun way to start looking at documentation management.
