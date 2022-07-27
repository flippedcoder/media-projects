import type { NextApiRequest, NextApiResponse } from "next";
import { WebClient, LogLevel } from "@slack/web-api";

const client = new WebClient(process.env.SLACK_TOKEN);

type MessageData = {
  channelName: string;
  imageName: string;
  imageUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  await publishMessage({
    ...body,
    channelName: "zzz_test",
  });

  res.send("image uploaded successfully");
  res.status(200);
}

async function publishMessage(messageData: MessageData) {
  const channelId = await getChannelId(messageData.channelName);
  try {
    if (channelId) {
      await client.chat.postMessage({
        token: process.env.SLACK_TOKEN,
        channel: channelId,
        text: `The ${messageData.imageName} image upload is ready at ${messageData.imageUrl}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function getChannelId(name: string) {
  try {
    const result = await client.conversations.list({
      token: process.env.SLACK_TOKEN,
    });

    if (result.channels) {
      const channel = result.channels.find((channel) => {
        return channel.name?.includes(name);
      });

      return channel?.id;
    }
  } catch (error) {
    console.error(error);
  }
}
