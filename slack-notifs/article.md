# Send Slack Message after Uploading an Image in Next

Sends a slack notification once the upload is finished

## Initial project setup

```bash
$ yarn create next-app --typescript
```

This command will prompt you for a project name. I've called this project `slack-notifs`, but feel free to name them whatever you like.

## Connect to Slack API

First, you'll need to create a Slack app so that you can generate a token for the Next app.

Then you'll need to make sure the token has the right scopes to post messages in a public channel.

```json
chat:write
chat:write.public
```

### Make the endpoint

## Build the front-end to upload images

### Trigger the Slack message with a successful upload

## Finished code

You can check out all of the code in the `slack-notifs` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/slack-notifs). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/withered-leaf-x6fp0h).

<CodeSandBox
  title="withered-leaf-x6fp0h"
  id="withered-leaf-x6fp0h"
/>

## Conclusion
