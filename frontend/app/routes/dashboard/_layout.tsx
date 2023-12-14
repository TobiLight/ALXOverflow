import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Header from '~/components/Shared/Header'
import { getUser } from '~/session.server'

export async function loader<LoaderFunction>({ request }: LoaderFunctionArgs) {
	const user = await getUser(request)
	if (!user)
		throw redirect("/login")

	return json({ message: "Ok", isLoggedIn: true, user: { ...user } })
}

function DashboardLayout() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user
	return (
		<>
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<Outlet />
			<footer className='text-center p-3 border-t text-sm font-semibold'>ALXOverflow &copy; {new Date().getFullYear()}</footer>
		</>
	)
}

export default DashboardLayout