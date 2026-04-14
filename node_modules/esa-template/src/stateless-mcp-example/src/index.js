import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPEdgeServerTransport } from "esa-sdk/mcp.js";

const server = new Server(
  {
    name: "example-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate_sum",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "calculate_sum") {
    const { a, b } = request.params.arguments;
    return {
      content: [
        {
          type: "text",
          text: String(a + b),
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

export default {
  async fetch(request, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/mcp") {
      const transport = new StreamableHTTPEdgeServerTransport();
      await server.connect(transport);
      return transport.handleRequest(request, ctx);
    } else {
      return new Response("Error pathname", { status: 404 });
    }
  },
};
