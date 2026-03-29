import { auth } from "@clerk/tanstack-react-start/server";
import { createMiddleware } from "@tanstack/react-start";

const authMiddleware = createMiddleware().server(async ({next})=> {
  const {userId} = await auth()

    if (!userId) {
    throw new Error("Not authenticated")
  }

  const result = await next({
    context: {
      userId: userId
    }
  })
  return result
})

export default authMiddleware