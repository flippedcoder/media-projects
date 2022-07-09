# Building a Yoga Pose App in Redwood

One of the best exercises you can do is yoga because it helps you work on both strength and flexibility while you practice. You don't have to be great at it to get the benefits, but having the correct posture for your poses at every level is important. Also, finding poses that you like and can ease into can lead you all over the place.

That's why we're going to build an app that lets us upload our favorite yoga poses to Cloudinary so we can compare ourselves to the proper form. I know that it sounds cringy to compare yourself to the correct form, but it's a really good way to see where you need to improve quickly.

## Set up the tools

We need to get a few tools in place before we start on the code. First up is the local Postgres instance we'll work with. You can [download it here](https://www.postgresql.org/download/). This is a SQL database that's commonly used in production apps so it'll help to have a little experience with it.

Next, you'll need to [create a Cloudinary account](https://cloudinary.com/users/register/free) to store the yoga pose images and use them in your app. You _could_ use something like S3 buckets to host your images, but it's not as straightforward.

Now we're at the fun part. We can finally make the Redwood app and start writing some code. To bootstrap the app, open a terminal and run the following command.

```bash
$ yarn create redwood-app --typescript yoga-pose-recommender
```

This creates a completely functional, full-stack app with TypeScript and [Prisma](https://www.prisma.io/) as its database ORM. You'll find the front-end React code in the `web` directory and the back-end GraphQL server in the `api` directory. If you start up the app with the following command, you'll be able to see the front-end and back-end of the app running.

```bash
$ yarn redwood dev
```

Since you've seen that the app is running, all we need to do is add the code for our pose purposes. We'll start by connecting the app to our local Postgres instance.

## Connecting to the database

The Redwood app needs the connection string to Postgres so it knows where to send the data we're working with. Look in the root of your project and open the `.env` file. This is where environment variables are stored and these typically change across the different environments you deploy your apps to.

Go ahead and uncomment the `DATABASE_URL` line and update the value to your connection string. An important thing to note is that you don't have to create the table we're going to use. When we do the database migration, the table will be automatically created. So that string could look like this, where `yoga_poses` is the table name.

```
DATABASE_URL=postgres://admin:postgres@localhost:5432/yoga_poses
```

With this value in place, we can turn our attention to the other folders and files in this app.

### Updating the database schema

Go to `api > db` and open the `schema.prisma` file. This is where we define the schema we want to migrate to the database. The first line of code we need to update is the `provider`. Change that value from `sqlite` to `postgresql`. You can see where that environment variable wiht our connection string is being used here.

Next, go ahead and delete the example model and replace it with this.

```jsx
model Pose {
  id        Int     @id @default(autoincrement())
  name      String
  url       String
  you_url   String
  category  String
}
```

This defines the table schema that the app will use. The URL values will come from Cloudinary uploads and the category will come from a dropdown on the front-end. We're finished with this file so let's actually seed our database with one initial row.

### Seeding the database

Go out to the root of the project and look in the `scripts` folder. Open the `seed.ts` file. This is where we'll define the data for that one row. Upload a yoga pose you like and then a picture of your attempt to Cloudinary. We'll need those URLs for the seed data.

There's a lot to sift through in this boilerplate code, so just delete everything out and paste this in.

```ts
import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.PoseCreateInput['data'][] = [
      { name: 'tree-pose', url: 'link_to_tree_pose_png', you_url: 'link_to_your_tree_pose_png', category: 'upright'},
    ]

    Promise.all(
      data.map(async (data: Prisma.PoseCreateInput['data']) => {
        const record = await db.pose.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
```

Note that you'll need to update the values for `url` and `you_url` in the `data` array. That's all you'll need to do in order to create the initial record. This `data` array is then passed into a promise that executes the create transaction on the database.

This is a good place to run a database migration to get all of the schema changes in place and to seed the table. Redwood has a command that lets us run migrations quickly. Open your terminal and run the following command.

```bash
$ yarn redwood prisma migrate dev
```

You'll be prompted to enter a name for the migration and then it will run. Check out your local Postgres database to see that seeded data! That's all for the database side of things. Now let's see how fast we can spin up the back-end with Redwood.

## Creating the GraphQL server

There are a lot of commands that do some heavy lifting for us. We're going to create the CRUD for our back-end with just one command. Run this in your terminal in the root of the project.

```bash
$ yarn redwood generate sdl --crud pose
```

Now take a look in `api > src > graphql` and you'll see a new `sdl` file. This has all of the types for the queries and mutations we need for our GraphQL server. Now head over to `api > src > services > poses` and you see several files. The main one is `poses.ts` and it has all of the queries and mutations that we need to get started.

While we have a great base to build on, there's still one more mutation we need to add. We need the ability to recommend similar poses based on the category a user selects.

### Building recommender query

We need to define the type for this new query so let start there. Go to `api > src > graphql` and open the `poses.sdl.ts` file. You'll see an object named `type Query` and this is where we'll add the following code below the existing queries.

```ts
getPosesByCategory(category: String!): [Pose!]! @requireAuth
```

This lets the server and the client know that a `category` value is expected in the request and an array of pose data can be expected in the response. Now we need to write the actual mutation that retrieves the data and passes it to the front-end.

Open that `poses.ts` file we mentioned above. This is where we'll add our category recommender query. You can drop the following code right below the `pose` query.

```ts
export const getPosesByCategory = ({ category }) => {
  return db.pose.findMany({
    where: { category },
  })
}
```

That's all for our extra resolver! Now we can turn our attention to the front-end and build the user interface.

## Moving to the client-side

We'll be making a relatively barebones front-end in regards to styles, so if you want to play with your CSS skills this will give you a good project to expand on.

First, let's install the Cloudinary upload widget package to handle image inputs. So open your terminal and go to the `web` directory and add these packages with the following command.

```bash
$ yarn add react-cloudinary-upload-widget axios
```

This is a good time for us to use some of the Redwood functionality we have available. Open your terminal and go to the root of the project and run the following command.

```bash
$ yarn redwood generate page pose
```

This will create a new page and route for the how we upload and display the yoga poses we have to work with. Take a look in `web > src > pages > PosePage`. You'll see three files, one of them is for test and the other is a Storybook document. Then there's the main one we'll be working with, `PosePage.tsx`. So open up this file and modify it to look like this.

```tsx
import { MetaTags } from '@redwoodjs/web'

const PosePage = () => {
  return (
    <>
      <MetaTags title="Pose" description="Pose page" />
    </>
  )
}

export default PosePage
```

We'll add onto this component as we build out the functionality. Let's start with the image uploader.

### Adding the definitions for the GraphQL server

Now we can get to some of the fun stuff. Let's start by adding a few imports. This will cover all of the imports that we need for the rest of the app.

```tsx
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { useState } from 'react'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
```

We need a definition for creating a new pose record so that we can access the GraphQL mutation. We'll add this right below our import statements.

```tsx
const CREATE_POSE_MUTATION = gql`
  mutation CreatePoseMutation($input: CreatePoseInput!) {
    createPose(input: $input) {
      name
    }
  }
`
```

This uses the GraphQL query language so that we can specify what we send to the server and the data we expect back. With some slight modification, you could also run this mutation in the GraphQL playground. We'll also need a definition to query the poses by category. Add this right below the previous definition.

```tsx
const GET_POSES_BY_CATEGORY = gql`
  query GetPosesByCategory($category: String!) {
    getPosesByCategory(category: $category) {
      category
      name
      url
      you_url
    }
  }
`
```

This query will pass the category to the server and then return all of the info for all of the matching pose records. Then we need to add a few variables and methods just inside of the `PosePage` component.

```tsx
const [category, setCategory] = useState<string>("upright")
const [name, setName] = useState<string>("tree")
const { data, loading } = useQuery(GET_POSES_BY_CATEGORY, {
  variables: { category }
})
const [createPose] = useMutation(CREATE_POSE_MUTATION)
```

We set a few states to some default values and we use a couple of hooks to get the data from our pose query and to make the method we'll use to upload new pose records. Now we can start adding some stuff to the page that users can interact with.

### Uploading new images and creating new records

Let's add the upload widget along with a couple of input fields to the return statement. So your code should look like this.

```tsx
return (
  <>
    <MetaTags title="Pose" description="Pose page" />
    <div>
      <label htmlFor="name">Name of the pose:</label>
      <input name="name" type="text" onChange={e => setName(e.currentTarget.value)} />
    </div>
    <div>
      <label htmlFor="category">Category of the pose:</label>
      <select name="category" onChange={e => setCategory(e.currentTarget.value)}>
        <option value="upright">Upright</option>
        <option value="laying">Laying</option>
        <option value="side">Side</option>
        <option value="back">Back</option>
        <option value="arms">Arms</option>
      </select>
    </div>
    <WidgetLoader />
    <Widget
      sources={['local', 'camera']}
      cloudName={`${cloudName}`}
      uploadPreset={`${uploadPreset}`}
      buttonText={'Add Pose Images'}
      multiple={true}
      cropping={false}
      folder={'yoga_poses'}
      style={{
        color: 'white',
        border: 'none',
        width: '120px',
        backgroundColor: 'green',
        borderRadius: '4px',
        height: '25px',
      }}
      onSuccess={uploadImagesFn}
    />
  </>
)
```

Even though there is a decent amount of code here, nothing too crazy is happening. We have a couple of `<div>` elements that hold the name and category inputs. These inputs update their respective state whenever there is a change in their value. The `<select>` gives users a set number of categories they can choose from.

The `<Widget>` element has some props on it that let us interact with Cloudinary. You'll need to insert your account values for the `cloudName` and `uploadPreset` values. One interesting thing to note is that in order to upload multiple images, we have to disable the cropping feature. Then the `onSuccess` prop has function we need to make so that when we're done adding our images, it saves the record to the database.

We'll add the `uploadImageFn` just below the `createPose` method we created earlier.

```tsx
function uploadImagesFn(res: CloudinaryResult) {
  const input = {
    category: category,
    name: name,
    url: res.info?.url,
    you_url: res.info?.url
  }

  createPose({ variables: { input } })
}
```

This function creates an `input` variable that collects all of the values we need and then it calls the `createPose` method to add the record to the table.

### Displaying the images

Now we can finish up by displaying the images on the page by the category a user selects. In the query where we get our `data`, there's also the `loading` value. This tells us whether the data is still loading from the database or not. We'll use this to render a loading element to prevent the app from crashing when the data isn't available yet. Add this code right after the `uploadImagesFn` function.

```tsx
if (loading) {
  <div>loading...</div>
}
```

Now all that's left is rendering the images! Add the following code below the `<Widget>` component.

```tsx
<div style={{ display: 'block' }}>
  {data?.getPosesByCategory &&
    data.getPosesByCategory.map(image => (
      <>
        <h2>{image.name}</h2>
        <h3>{image.category}</h3>
        <img
          key={`${image.name}_orig`}
          style={{ height: '500px', marginRight: '25px', width: '500px' }}
          src={`${image.url}`}
        />
        <img
          key={image.name}
          style={{ height: '500px', width: '500px' }}
          src={`${image.you_url}`}
        />
      </>
    ))
  }
</div>
```

This does a quick check to make sure we have data and then it iterates through each pose record and renders the images on the page. When you run your app with `yarn redwood dev`, you should see something like this.

![upload widget, name and category inputs, and image displayed]()

That's it! Now whenever you're in the mood to work on some yoga poses, you can check out the correct posture, compare it to your own, and start slowly improving.

## Finished code

You can check out the complete code in [the `yoga-pose-recommender` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/yoga-pose-recommender). You can also check out the front-end in [this Code Sandbox](https://codesandbox.io/s/musing-jang-y8u53).

<CodeSandBox
  title="musing-jang-y8u53"
  id="musing-jang-y8u53"
/>

## Conclusion

Sometimes there aren't apps out there that you really like or you just don't want them to have your data. It's ok to make a quick little app that focuses on exactly what you need. That way you get to practice your coding _and_ you get to exercise!
