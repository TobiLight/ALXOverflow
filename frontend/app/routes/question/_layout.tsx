import { LoaderFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react'
import Footer from '~/components/Shared/Footer'
import Header from '~/components/Shared/Header'
import { PhWarningFill } from '~/components/icons/Warning'
import { getUser, getUserSession, validateUser } from '~/session.server'
import { IUser } from '~/utils/interfaces'

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {

	try {
		const user = await getUser(request)
		if (user)
			return json<{ isLoggedIn: boolean, user: IUser }>({ isLoggedIn: true, user: { ...user } })

		// throw redirect("/sign-in")
		return json<{ isLoggedIn: boolean, user: IUser | undefined }>({ isLoggedIn: false, user: undefined })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ isLoggedIn: boolean, user: IUser | undefined }>({ isLoggedIn: false, user: undefined })
	}
}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string }
	// When NODE_ENV=production:
	// error.message = "Unexpected Server Error"
	// error.stack = undefined
	return (
		<main className="min-h-screen grid justify-center items-center">
			<div className="relative h-auto mx-auto flex flex-col justify-center gap-4 items-center p-4">
				<div className="flex flex-col items-center justify-center">
					<PhWarningFill className='w-8 h-8 text-yellow-500' />
					<h1 className="font-bold text-sm">
						{error.data}
					</h1>
				</div>
				<Link to="/" className="hover:text-gray-500">Go back home</Link>
			</div>
		</main>
	)
}

function QuestionLayout() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user

	return (
		<>
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<Outlet />
			<Footer />
		</>
	)
}

export default QuestionLayout