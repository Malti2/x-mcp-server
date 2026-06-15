# X (Twitter) MCP Server

A Model Context Protocol (MCP) server that allows you to post tweets to X (Twitter). Designed to be deployed as a Netlify Function.

## Features
- `post_tweet`: Post a new tweet.

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

## Adding to Poke
Once deployed, copy your Netlify site URL and add it to Poke as an MCP connection.

1. Go to Poke Integrations.
2. Add a new MCP connection.
3. Use the URL of your Netlify deployment.