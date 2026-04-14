import OpenAI from "openai";

const openai = new OpenAI({
  // Get your api Key. https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key?spm=a2c4g.11186623.help-menu-2400256.d_3_0.280c2066ype8kG&scm=20140722.H_2712195._.OR_help-T_cn~zh-V_1
  apiKey: "sk-xxx", // Replace your api Key
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

async function handleRequest(request) {
  const url = request.url;
  const search = new URL(url).searchParams.get("search");
  if (search && search.length > 0) {
    const stream = await openai.chat.completions.create({
      model: "deepseek-v3", // Use any model
      messages: [{ role: "user", content: search }],
      stream: true,
    });

    const readStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0].delta.content;
          controller.enqueue(new TextEncoder().encode(content));
        }
        controller.close();
      },
    });

    return new Response(readStream, {
      headers: {
        "Content-Type": "text/event-stream;charset=UTF-8",
      },
    });
  } else {
    return new Response(
      "Please enter your question in the search parameter of the requested URL. "
    );
  }
}

export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
