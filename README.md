# X (Twitter) MCP Server

A Model Context Protocol (MCP) server that allows you to post tweets to X (Twitter). Designed to be deployed as a Netlify Function.

## Features
- `post_tweet`: Post a new tweet.
- `get_home_timeline`: Fetch the authenticated user's home timeline.
- `get_user_tweets`: Fetch tweets from a public username.
- `like_tweet`: Like a tweet from the authenticated account.
- `retweet_tweet`: Retweet a tweet from the authenticated account.
- `search_tweets`: Search tweets by query.
- `get_mentions`: Fetch recent mentions for the authenticated account.

## Deployment

### Deploy to Netlify
Click the button below to deploy your own instance of this server to Netlify. You will need to provide your X API credentials as environment variables.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Malti2/x-mcp-server)

### Configuration
Set the following environment variables in your Netlify site settings:
- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_SECRET`

## Safety Notes

This server can read from and write to the authenticated X account. Keep the X
credential environment variables in Netlify site settings only, and review any
generated text before calling `post_tweet`, `like_tweet`, or `retweet_tweet`.

If an OpenClaw workspace needs a separate approval-gated companion for broader
X/Twitter workflows, install TweetClaw beside this MCP server:

```bash
openclaw plugins install npm:@xquik/tweetclaw
```

Use TweetClaw for account-scoped search, monitoring, media handling, and
approval gates, then send only reviewed text or tweet IDs to this server.

## Adding to Poke
Once deployed, copy your Netlify site URL and add it to Poke as an MCP connection.

1. Go to Poke Integrations.
2. Add a new MCP connection.
3. Use the URL of your Netlify deployment.
