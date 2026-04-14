import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./client/App.jsx";

// 可以将客户端打包结果命名为 xx.client.js，就会当作字符串导入，插入到html模板的script标签中，方便本地开发
// 上线后可以改为src导入
import client from "./client/dist/test.client.js"; // 这是字符串，不可调用！

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  const htmlContent = ReactDOMServer.renderToString(
    React.createElement(
      StaticRouter,
      {
        location: pathname,
        context: {},
      },
      React.createElement(App)
    )
  );
  const final = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>React SSR Example</title>
    </head>
    <body>
      <div id="root">${htmlContent}</div>
      <!-- <script src="https://g.alicdn.com/visage/react-esr-test/0.0.1/client.js"></script> -->
      <script>${client}</script>
    </body>
    </html>
    `;
  return new Response(final, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}

export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
