import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TwitterApi } from 'twitter-api-v2';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "x-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_SECRET!,
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "post_tweet",
        description: "Post a new tweet to X (Twitter)",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The content of the tweet",
            },
          },
          required: ["text"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "post_tweet") {
    const text = request.params.arguments?.text as string;
    try {
      const tweet = await twitterClient.v2.tweet(text);
      return {
        content: [
          {
            type: "text",
            text: `Tweet posted successfully! ID: ${tweet.data.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error posting tweet: ${error.message}`,
          },
        ],
      };
    }
  }
  throw new Error("Tool not found");
});

export const handler = async (event: any) => {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const result = await server.handleRequest(body);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};