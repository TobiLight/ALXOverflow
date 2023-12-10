import { LoaderFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Header from '~/components/Shared/Header'
import { getUser, getUserSession, validateUser } from '~/session.server'

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	const user = await getUser(request)
	if (user)
		return json({ message: "Ok", isLoggedIn: true, user: { ...user } })

	// throw redirect("/sign-in")
	return json({ message: "Ok", isLoggedIn: false, user: undefined })
}

function QuestionLayout() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user

	return (
		<main>
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<Outlet />
		</main>
	)
}

export default QuestionLayout