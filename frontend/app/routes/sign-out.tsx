import { LoaderFunction, redirect, ActionFunction, json, ActionFunctionArgs } from "@remix-run/node"
import { requireUserSession, storage } from "~/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	return redirect('/sign-in')
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
	const session = await storage.getSession()
	return redirect("/sign-in", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}
