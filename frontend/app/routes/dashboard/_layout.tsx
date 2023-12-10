import { LoaderFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Header from '~/components/Shared/Header'
import { getUser, getUserSession, validateUser } from '~/session.server'

export async function loader<LoaderFunction>({ request }: LoaderFunctionArgs) {
	const user = await getUser(request)
	if (!user)
		throw redirect("/sign-in")
	// throw redirect("/sign-in")
	return json({ message: "Ok", isLoggedIn: true, user: { ...user } })
}

function DashboardLayout() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user
	return (
		<main>
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<Outlet />
			<footer className='text-center p-3 border-t font-semibold'>ALXOverflow &copy; {new Date().getFullYear()}</footer>
		</main>
	)
}

export default DashboardLayout