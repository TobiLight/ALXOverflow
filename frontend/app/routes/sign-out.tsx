import { LoaderFunction, redirect, ActionFunction, ActionFunctionArgs } from "@remix-run/node"
import { destroySession, getSession, } from "~/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	return redirect('/sign-in')
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession()
	return redirect("/sign-in", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}
