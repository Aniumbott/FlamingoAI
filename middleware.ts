import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  // publicRoutes: ["/blog", "/pricing", "", "/", "/api/webhooks/(.*)"],
  // ignoredRoutes: ["/blog"]
  publicRoutes: (req: any) => {

    const path = req.nextUrl.pathname;
    const protectedRoutes = ['/workspace', '/onboarding', '/login', '/signup'];
    console.log('path', path);
    // If the path is not in protectedRoutes, it's public
    return !protectedRoutes.some(route => path.startsWith(route));
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
