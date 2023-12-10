import { LoaderFunctionArgs, redirect, json } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import Header from '~/components/Shared/Header'
import { getUserSession } from '~/session.server'

export async function loader({
	request
}: LoaderFunctionArgs) {
	const session = await getUserSession(request)

	if (session.has('user')) {
		return redirect('/')
	}
	return json({ message: "Ok" })
}

function AuthLayout() {
	return (
		<main className='min-h-screen'>
			<Header isLoggedIn={false} />
			<Outlet />
			<footer className="relative bottom-0 w-full text-center flex items-center justify-center py-2 border-t text-sm">
				<p>Made with love by <span className="font-semibold">0xTobii</span></p>
			</footer>
		</main>
	)
}

export default AuthLayout