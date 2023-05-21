import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@/lib/session";

// this middleware is to handle a basic form of authorization
export const middleware = async (req) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  const { user } = session;

  if (user == undefined) {
    return NextResponse.redirect(new URL('/', req.url)) // redirect to home page
  }
  
  if(req.nextUrl.pathname.startsWith('/auth/routing')) {
    if(user.worker) {
      return NextResponse.redirect(new URL('/queue', req.url)) // redirect to worker page
    } else {
      return NextResponse.redirect(new URL('/menu', req.url)) // redirect to customer page
    }
  }

  return res;
};

// users that are not logged in will be unable to access these pages
export const config = {
  matcher: ['/menu', '/cart', '/orderHistory', '/queue', '/auth/routing'],
};