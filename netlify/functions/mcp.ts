import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TwitterApi } from 'twitter-api-v2';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "x-mcp-server",
    version: "1.1.0",
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
            text: { type: "string", description: "The content of the tweet" },
          },
          required: ["text"],
        },
      },
      {
        name: "get_home_timeline",
        description: "Fetch the home timeline for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            max_results: { type: "number", description: "Maximum number of tweets to return (10-100)" },
          },
        },
      },
      {
        name: "get_user_tweets",
        description: "Fetch tweets from a specific user by username",
        inputSchema: {
          type: "object",
          properties: {
            username: { type: "string", description: "The X username (handle) without @" },
            max_results: { type: "number", description: "Maximum number of tweets to return (5-100)" },
          },
          required: ["username"],
        },
      },
      {
        name: "like_tweet",
        description: "Like a specific tweet",
        inputSchema: {
          type: "object",
          properties: {
            tweet_id: { type: "string", description: "The ID of the tweet to like" },
          },
          required: ["tweet_id"],
        },
      },
      {
        name: "retweet_tweet",
        description: "Retweet a specific tweet",
        inputSchema: {
          type: "object",
          properties: {
            tweet_id: { type: "string", description: "The ID of the tweet to retweet" },
          },
          required: ["tweet_id"],
        },
      },
      {
        name: "search_tweets",
        description: "Search for tweets matching a query",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search query" },
            max_results: { type: "number", description: "Maximum number of results (10-100)" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_mentions",
        description: "Fetch recent mentions for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            max_results: { type: "number", description: "Maximum number of tweets to return (5-100)" },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments || {};
  try {
    switch (request.params.name) {
      case "post_tweet": {
        const tweet = await twitterClient.v2.tweet(args.text as string);
        return { content: [{ type: "text", text: `Tweet posted! ID: ${tweet.data.id}` }] };
      }
      case "get_home_timeline": {
        const timeline = await twitterClient.v2.homeTimeline({ max_results: (args.max_results as number) || 20 });
        return { content: [{ type: "text", text: JSON.stringify(timeline.data.data, null, 2) }] };
      }
      case "get_user_tweets": {
        const user = await twitterClient.v2.userByUsername(args.username as string);
        const tweets = await twitterClient.v2.userTimeline(user.data.id, { max_results: (args.max_results as number) || 10 });
        return { content: [{ type: "text", text: JSON.stringify(tweets.data.data, null, 2) }] };
      }
      case "like_tweet": {
        const me = await twitterClient.v2.me();
        await twitterClient.v2.like(me.data.id, args.tweet_id as string);
        return { content: [{ type: "text", text: `Liked tweet ${args.tweet_id}` }] };
      }
      case "retweet_tweet": {
        const me = await twitterClient.v2.me();
        await twitterClient.v2.retweet(me.data.id, args.tweet_id as string);
        return { content: [{ type: "text", text: `Retweeted tweet ${args.tweet_id}` }] };
      }
      case "search_tweets": {
        const search = await twitterClient.v2.search(args.query as string, { max_results: (args.max_results as number) || 10 });
        return { content: [{ type: "text", text: JSON.stringify(search.data.data, null, 2) }] };
      }
      case "get_mentions": {
        const me = await twitterClient.v2.me();
        const mentions = await twitterClient.v2.userMentionTimeline(me.data.id, { max_results: (args.max_results as number) || 10 });
        return { content: [{ type: "text", text: JSON.stringify(mentions.data.data, null, 2) }] };
      }
      default:
        throw new Error("Tool not found");
    }
  } catch (error: any) {
    return { isError: true, content: [{ type: "text", text: `Error: ${error.message}` }] };
  }
});

export const handler = async (event: any) => {
  if (event.httpMethod === 'POST') {
    const result = await server.handleRequest(JSON.parse(event.body));
    return { statusCode: 200, body: JSON.stringify(result) };
  }
  return { statusCode: 405, body: 'Method Not Allowed' };
};