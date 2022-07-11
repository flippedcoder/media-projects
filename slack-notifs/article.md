# Send Slack Message after Uploading an Image in Next

Sends a slack notification once the upload is finished

## Initial project setup

```bash
$ yarn create next-app --typescript
```

This command will prompt you for a project name. I've called this project `slack-notifs`, but feel free to name it whatever you like. We'll need to install the [Slack package](npmjs.com/package/@slack/web-api) and the Cloudinary upload widget with the following command.

```bash
$ yarn add @slack/web-api react-cloudinary-upload-widget
```

If you don't already have a free Cloudinary account, [sign up for one here](https://cloudinary.com/users/register/free). In the dashboard, get the `cloud name` for your account and the `upload preset` value from your settings. We'll use these a bit later to upload the images.

## Setup the Slack app in your Slack workspace

First, you'll need to create a Slack app so that you can generate a token for the Next app. Login to Slack in the browser and create a new app. Make sure you choose the right workspace and name the app `Image Upload`.

![new app in Slack API]()

You'll get redirected to a page with all of the app setting we need to setup to interact with this through out Next API. Let's start by enabling `Incoming Webhooks`. This is how we'll be able to post messages from the Next API. You'll be taken to another page where you'll need to add a new webhook to your workspace.

![incoming webhook setup]()

Pay extra attention to the workspace permission screen so that you know you're posting in the right channel. I have mine set to post to my direct messages. After you choose the channel in your workspace, you'll be redirected back to the `Incoming Webhooks` page. You should test out that the app is working like you expect by using the example cURL method generated on the page.

![webhook channel permissions url setup]()

Now you need to go to the `OAuth & Permissions` page in the left sidebar. This where we set the scopes for the access token we'll use to post messages to our channel. You'll need the `channels:read`, `chat:write`, and `incoming-webhook` scopes on the `Bot Token Scopes`.

![what the scopes will look like in the Slack dashboard]()

With all of this in place, we can move in the Next app and start writing some code.

## Write the back-end

Let's start by creating a `.env` file at the root of the project to hold the credentials we need to use Slack and Cloudinary. The file should look something like this.

```env
SLACK_TOKEN=xoxb-your-token
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Build the front-end to upload images

### Trigger the Slack message with a successful upload

## Finished code

You can check out all of the code in the `slack-notifs` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/slack-notifs). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/withered-leaf-x6fp0h).

<CodeSandBox
  title="withered-leaf-x6fp0h"
  id="withered-leaf-x6fp0h"
/>

## Conclusion
