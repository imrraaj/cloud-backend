import { z } from "zod";

const PostData = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  tag: z.string().trim(),
});

const SharedPostData = z.object({
  postId: z.string().trim(),
  username: z.string().trim(),
});

function parsePostData(body) {
  return PostData.safeParse(body);
}
function parseSharedPostData(body) {
  return SharedPostData.safeParse(body);
}

export { parsePostData, parseSharedPostData };
