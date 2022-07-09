# Adding Subtitles to Video Content

Sometimes you just want to watch videos with the subtitles on. It might be because you want to mute the video and just read what's happening. Or maybe you're using subtitles to help teach yourself a different language.

These are a few reasons why it's important to know how to add subtitles to videos in your web apps. It's also important to include subtitles for accessibility purposes so that everyone can get the information from your videos. So we're going to build a Redwood app that uses Cloudinary to display video subtitles using `.srt` files.

## Setting up the project

To get started, will initialize a new Redwood project with the following command:

```bash
$ yarn create redwood-app --typescript video-subtitles
```

This command generates a functioning full-stack app. There are a number of files and folders, but we'll mainly work in the `api` and `web` directories. These contain the code for the front-end and back-end respectively. This project uses the `--typescript` flag so we'll be able to add types for everything from the beginning.

Let's start with the back-end and set up our database.

## Writing the database schema

Open the `schema.prisma` file in `api > db`. This is where we'll set up our database connection and the schema for all of the tables. The first thing we'll do is update the `provider` value from `sqlite` to `postgresql`. This is how we tell the app to connect to our Postgres instance.

Next, we need to update the `DATABASE_URL` environment variable in the `.env` file to your local Postgres. Your connection string might look similar to this:

```
DATABASE_URL=postgres://postgres:admin@localhost:5432/subtitles
```

Don't worry if you don't have a database called `subtitles`. When we run the migration, this will be created automatically.

Now we can define the model for the videos we'll upload. You can delete the `UserExample` model and replace it with the following code:

```javascript
model Video {
  id        Int     @id @default(autoincrement())
  url       String
  srtFile   String
}
```

This defines the table and the columns we'll need for the database to store the videos and their subtitle files. We're going to do one more thing before doing the database migration.

### Seeding the database with data

We'll seed the database with a subtitle file to have data to get started with. Check out the `scripts` folder and you'll see a file called `seed.ts`. This is where we'll add the data for the video. You can [download an example of a `.srt` file here](https://github.com/flippedcoder/media-projects/blob/main/video-subtitles/sample.srt) and save it to the root of your project.

If you don't have [a Cloudinary account](https://cloudinary.com/users/register/free), this is the perfect time to make one so that you can upload a video and the subtitle file. Once you have these two files uploaded to your Cloudinary account, then you can update the code in `seed.ts` to match the `Video` schema we have.

```ts
import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.VideoCreateInput['data'][] = [
      { url: `https://res.cloudinary.com/${cloudName}/video/upload/v1606580790/elephant_herd.mp4`, srtFile: `https://res.cloudinary.com/${cloudName}/raw/upload/v1643650731/sample_nyiy7a.srt` }
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    Promise.all(
      data.map(async (data: Prisma.VideoCreateInput['data']) => {
        const record = await db.video.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
```

An important thing to note in this code is that you need to update the `url` and `srtFile` values to use the links from your Cloudinary account. Since this is the only data we're going to seed in the database, we can go ahead and run the migration with the following command:

```bash
$ yarn redwood prisma migrate dev
```

This command creates the `subtitles` database if it doesn't exist, creates the `Video` table schema, and adds the seed data to the table. If you check your local Postgres instance, you should see a record in the `Video` table already.

Now that we've done everything we need to with the database setup, let's move on to the GraphQL server.

## Making the GraphQL types and queries

One of my favorite things about Redwood is that once you have all of your database schema defined, there are a few commands that make it super easy to generate all of the types, queries, and mutations to handle all of the CRUD operations in GraphQL. So let's run the following command to generate all the things we need on the back-end.

```bash
$ yarn redwood generate sdl video --crud
```

This one command has just generated all of the files and code we need in order to work with our data on the front-end. Take a look in `api > src > graphql` and you'll see the `video.sdl.ts` file. This has all of the types we need in GraphQL for the video data based on how we defined the database schema. Now look over in `api > src > services > videos`. This has the file with all of the queries and mutations we need execute actions on the database.

That's all of the GraphQL requirements met with a single command. Now we can turn our attention over to the front-end where most of the interesting work is happening because we'll be using Cloudinary's video uploader and their upload API.

## Creating the video page

Moving over to the front-end, take a look in the `web > src` directory. This is where the rest of our work will take place. We'll start by adding the package we need to use the Cloudinary widget. Go to the `web` directory in your terminal and run the following command:

```bash
$ yarn add react-cloudinary-upload-widget
```

Then we'll make a new page that will handle the uploads for both our videos and subtitle files and it will also display the videos we've uploaded before with the subtitles enabled. To make this new page, run the following command:

```bash
$ yarn redwood generate page video
```

This will create a new page component in `web > src > pages > VideoPage` and it will update the `Routes.tsx` file to include this new page. We're going to start by adding the video upload functionality to this page.

### Uploading the videos to Cloudinary

So open the `VideoPage.tsx` file and take a look at the boilerplate code. We'll use the Cloudinary upload widget to handle our videos and we'll keep a record of the URL for display later. You can delete the code below the `<h1>` element inside the component. That will leave your file looking like this.

```tsx
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const VideoPage = () => {
  return (
    <>
      <MetaTags title="Video" description="Video page" />

      <h1>VideoPage</h1>
    </>
  )
}

export default VideoPage
```

We'll replace the unused import with the following import. This will give us access to that widget and all of its functionality.

```tsx
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
```

Before we jump into using this widget component, let's define a couple more environment variables. Open the `.env` file and add the following values below your `DATABASE_URL`. These will protect your sensitive information from being visible directly in the code. You can find the values for these variables in your Cloudinary dashboard.

```
CLOUD_NAME=your_cloud_name
UPLOAD_PRESET=the_preset_name
```

Now we can turn back to the `VideoPage` component. Let's add an empty upload function that we'll update later and the upload widget itself.

```tsx

import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import { MetaTags } from '@redwoodjs/web'

const VideoPage = () => {
  function uploadVideoFn() {

  }

  return (
    <>
      <MetaTags title="Video" description="Video page" />

      <h1>VideoPage</h1>

      <WidgetLoader />
      <Widget
        sources={['local', 'camera']}
        cloudName={process.env.CLOUD_NAME}
        uploadPreset={process.env.UPLOAD_PRESET}
        buttonText={'Add Video'}
        style={{
          color: 'white',
          border: 'none',
          width: '120px',
          backgroundColor: 'green',
          borderRadius: '4px',
          height: '25px',
        }}
        folder={'subtitled_videos'}
        onSuccess={uploadVideoFn}
      />
    </>
  )
}

export default VideoPage
```

If you run the app now, you'll be able to see the uploader button and clicking it will open the widget. You can run the app with the following command. Make sure you're in the root of the project in your terminal.

```bash
$ yarn redwood dev
```

Going to the `video` route will show you views similar to these.

![uploader button on the page]()

![uploader opened to the main card after button click]()

Now we need to update that `uploadVideoFn`. This is where we'll save the uploaded video's URL until we have the subtitle file as well. Add this code to the placeholder function.

```tsx
function uploadVideoFn(results: CloudinaryResult) {
  const imageInfo = results.info

  setUrl(imageInfo.url)
}
```

There are a couple things we need to do before you can use this function. First, let's add a new import to use the state hook in React. So add this to the top of the import list.

```tsx
import { useState } from 'react'
```

Next, add the type definition for the data we'll be using from the Cloudinary response below the import statements.

```tsx
interface CloudinaryResult {
  info: {
    url: string
  }
}
```

Then right inside of the component, above the `uploadVideoFn`, add the following states. We'll only use one for now, but we'll need the other really soon.

```tsx
const [url, setUrl] = useState<string>("")
const [srtFile, setSrtFile] = useState<string>("")
```

The video uploader is finished now! You can test it out by uploading a video in the browser and checking the state of the app in the developer tools. Now we can move on to the subtitle uploader.

### Uploading the subtitles file

We'll need a way for users to upload new subtitle files along with their videos so we'll add a button with this functionality and it'll make a call to the Cloudinary API. This time, let's start by defining the `uploadSubtitleFn` before we create the file upload input. So let's add this function below `uploadVideoFn`.

```tsx
async function uploadSubtitleFn(e) {
  const uploadApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/raw/upload`

  const formData = new FormData()
  formData.append('file', e.currentTarget.value)
  formData.append('upload_preset', process.env.CLOUD_NAME)

  const cloudinaryRes = await fetch(uploadApi, {
    method: 'POST',
    body: formData,
  })

  setSrtFile(cloudinaryRes.url)
}
```

Then we can add the file input element that will trigger this function whenever a new `.srt` file gets uploaded. This element will go just below the `<Widget>`.

```tsx
<input type="file" onChange={uploadSubtitleFn} />
```

That's all for the upload functionality. The last thing we need to do is add a button that will handle the creation of a database record with the URLs for the video and subtitles.

### Saving the record

We need to update one of the import statements we have. Add the two new objects to this import.

```tsx
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
```

Next, let's define the mutation we need to create a new video record. This will go right below the import statements.

```tsx
const CREATE_VIDEO_MUTATION = gql`
  mutation CreateVideoMutation($input: CreateVideoInput!) {
    createVideo(input: $input) {
      id
      url
      srtFile
    }
  }
`
```

Then we'll define the method we'll use when we're ready to submit the video. This will go inside the component, right above the `useState` declarations.

```tsx
const [createVideo] = useMutation(CREATE_VIDEO_MUTATION)
```

Now we can add one more function that will let us handle video record submissions. This will go just below the `uploadSubtitleFn`.

```tsx
function createVideoRecord() {
  const input = {
    url: url,
    srtFile: srtFile,
  }

  createVideo({ variables: { input } })
}
```

This calls the GraphQL mutation we created on the back-end earlier and adds the new info to the table. All that's left is adding the button. We'll put that below the file input.

```tsx
<button style={{ display: 'block' }} onClick={createVideoRecord}>Make this video record</button>
```

Whenever this button is clicked, it will attempt to create a new video record so make sure that your states have valid values. This is a great place to practice implementing input validation and error handling. If you run your app at this point with `yarn rw dev`, then you should see something like this.

![app with all of the upload and create buttons]()

All that's left is the query and displaying of the videos we upload with their subtitles!

### Displaying the video with subtitles

There's a GraphQL query that we need to define to get all of the video data. We'll do that right above the mutation definition.

```tsx
const GET_VIDEOS = gql`
  query {
    videos {
      url
      srtFile
    }
  }
`
```

Then we'll add a few objects from the `useQuery` hook we use to get the data back. Add this line right above the mutation method inside the component.

```tsx
...
const { data, loading } = useQuery(GET_VIDEOS)
const [createVideo] = useMutation(CREATE_VIDEO_MUTATION)
const [url, setUrl] = useState<string>("")
...
```

Any time we're working with loading data on the front-end, it's a great practice to have something display while the data is loading to prevent the app from crashing. That's where the `loading` value comes in. It tells us if the video data is still being fetched. We'll add a simple loading element above the return statement.

```tsx
if (loading) {
  return <div>Loading...</div>
}
```

Lastly, we need to display the videos with their subtitles. To do that, we'll need to add some `<video>` elements for every video returned from the query. This will go below the video record creation button.

```tsx
<div style={{ display: 'block' }}>
  {data?.videos &&
    data?.videos.map(image => (
      <video
        controls
        key={image.name}
        style={{ height: '500px', width: '500px' }}
      >
        <source src={`https://res.cloudinary.com/demo/video/upload/l_subtitles:sample_heeir8.srt/elephant_herd.mp4`}></source>
      </video>
    ))
  }
</div>
```

We're using a custom Cloudinary URL with the names of the video and subtitle files we uploaded together. When you reload the page with your app running, you should see something like this.

![all the upload buttons and the videos with subtitles]()

Now we're done!

## Finished code

You might want to take a look at the complete code over here in [the `video-subtitles` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/video-subtitles).

Or you can check out some of the front-end functionality in [this Code Sandbox](https://codesandbox.io/s/kind-paper-mkefy).

<CodeSandBox
  title="kind-paper-mkefy"
  id="kind-paper-mkefy"
/>

## Conclusion

Having subtitles on videos is a crucial step for keeping content online accessible to everyone. The `.srt` are well worth the time to learn how to write. It's just a specific format you have to follow in a text file. So hopefully this made everything look easy to you and now you can add subtitles to all the videos!
