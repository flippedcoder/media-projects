
import type { NextApiRequest, NextApiResponse } from 'next'
import { WebClient, LogLevel } from "@slack/web-api"

const client = new WebClient(process.env.SLACK_TOKEN);

type MessageData = {
  channelName: string
  imageName: string
  imageUrl: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageData>
) {
  const body = JSON.parse(req.body)
  const message = publishMessage({
    ...body,
    channelName: 'Milecia McGregor'
  })
  res.status(200)
}

async function publishMessage(messageData: MessageData) {
  const channelId = findConversation(messageData.channelName)

  try {
    const result = await client.chat.postMessage({
      token: process.env.SLACK_TOKEN,
      channel: channelId,
      text: `The ${messageData.imageName} is ready at ${messageData.imageUrl}`
    });
  }
  catch (error) {
    console.error(error);
  }
}

async function findConversation(name: string) {
  try {
    const result = await client.conversations.list({
      token: process.env.SLACK_TOKEN
    });

    if (result.channels) {
      const channel = result.channels.find(channel => channel.name === name)
      return channel?.id
    }
  }
  catch (error) {
    console.error(error);
  }
}