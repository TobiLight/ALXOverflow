import { cssBundleHref } from "@remix-run/css-bundle";
import stylesheet from "~/main.css";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";


export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [{ rel: "stylesheet", href: stylesheet }]),
];

export const meta: MetaFunction = () => {
  return [
    { title: "ALXOverflow | Where Questions Find Answers 🚀" },
    {
      name: "description", content: `ALX Overflow is a specialized online 
      platform designed to cater to the unique needs of students enrolled
      in the ALX Software Engineering Program.`
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
