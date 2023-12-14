import { LoaderFunction, LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData, useRouteError } from '@remix-run/react'
import React from 'react'
import HomeQuestion from '~/components/HomePage/HomeQuestion'
import { PhWarningFill } from '~/components/icons/Warning'
import { useParentRouteData } from '~/hooks/useParentRouteData'
import { IUser, Question } from '~/utils/interfaces'

export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const data = await fetch('http://localhost:8000/api/questions', {
			method: "GET"
		})
		const questions = await data.json() as Question[] | []
		console.log(questions);
		return json<{ questions: Question[] | [] }>({ questions: questions })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ questions: Question[] | [] }>({ questions: [] })
		if (err.message.includes('Unexpected token'))
			return json<{ questions: Question[] | [] }>({ questions: [] })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json<{ questions: Question[] | [] }>({ questions: [] })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ questions: Question[] | [] }>({ questions: [] })
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

function Questions() {
	const loaderData = useLoaderData<typeof loader>()
	const questions = loaderData.questions as Question[] | []

	return (
		<div>
			<main className='min-h-screen sm:w-3/5 md:w-3/6 lg:w-3/6 mx-auto px-3'>
				<div className="grid gap-5">
					{questions.length ? questions.slice(0, 15).map((question, idx) => {
						return (
							<div key={idx}>
								<HomeQuestion id={question.id} title={question.title} content={question.content} created_at={question.created_at} updated_at={question.updated_at} answers={question.answers} author_id={question.author_id} />
							</div>
						)
					}) :
						<div className='grid h-full items-center justify-center mt-20'>
							<p className='font-bold text-sm'>No questions at the moment</p>
						</div>
					}
				</div>
			</main>
		</div>
	)
}

export default Questions