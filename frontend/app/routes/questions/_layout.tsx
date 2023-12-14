import { LoaderFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react'
import Footer from '~/components/Shared/Footer'
import Header from '~/components/Shared/Header'
import { PhWarningFill } from '~/components/icons/Warning'
import { getUser, getUserSession, validateUser } from '~/session.server'
import { IUser, Question } from '~/utils/interfaces'

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	try {
		const user: IUser | undefined = await getUser(request);
		const data = await fetch('http://localhost:8000/api/questions', {
			method: "GET"
		})
		const questions = await data.json() as Question[] | []
		console.log(questions);
		if (user)
			return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: true, user: { ...user }, questions: questions })

		return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: questions })
	} catch (err: any) {
		// if (err.message.includes('Unexpected token'))
		// 	throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		// if (err.errno === 'ECONNREFUSED')
		// 	throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		// return json({})
		if (err.message.includes('Unexpected token'))
			return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] })
	}
}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string }
	console.log(error.data);
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

function QuestionsLayout() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user

	return (
		<main>
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<Outlet />
			<Footer />
		</main>
	)
}

export default QuestionsLayout