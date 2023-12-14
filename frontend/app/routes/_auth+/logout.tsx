import { LoaderFunction, redirect, ActionFunction, ActionFunctionArgs } from "@remix-run/node"
import { destroySession, getSession, } from "~/session.server"

// export const loader: LoaderFunction = async ({ request }) => {
// 	console.log('loader');
// 	return redirect('/login')
// }

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession()
	return redirect(request.headers.get('referer') || '/login', {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}
