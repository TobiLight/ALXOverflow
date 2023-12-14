import { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import IconBxsDownvote from "~/components/icons/DownvoteIcon";
import IconReply from "~/components/icons/ReplyIcon";
import IconBxsUpvote from "~/components/icons/UpvoteIcon";
import { Question as IQuestion, IUser } from "~/utils/interfaces";
import NotFound from "~/../public/images/not-found.png"
import { getAccessToken, getUser } from "~/session.server";
import { useState } from "react";
import Question from "~/components/Question/Question";
import Answer from "~/components/Answer/Answer";
import { useParentRouteData } from "~/hooks/useParentRouteData";
import { PhWarningFill } from "~/components/icons/Warning";

export async function loader({ request, params }: LoaderFunctionArgs) {

	try {
		const user = await getUser(request)
		if (!user)
			throw new Response('Your session has expired!', { status: 400 })
		const data = await fetch(`http://localhost:8000/api/question/${params.questionId}/edit`, {
			method: "POST",
		})
		const question = await data.json() as { detail?: string } & IQuestion
		if (question?.detail)
			throw new Response(question.detail)
		console.log(question);
	} catch (err: any) {

	}


	// return redirect('/login', { status: 301 })

	return null
}

export async function action({ request, params }: ActionFunctionArgs) {
	const accessToken = await getAccessToken(request)

	try {
		const data = await fetch(`http://localhost:8000/api/question/${params.questionId}/answer`, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				"title": "Hello answer",
				"content": "Answer contenttttttt",
				"question_id": "12345",
				"author_id": "sdfgh"
			})
		})
		const answer = await data.json() as { detail?: string, status: string, question_id: string, answer_id: string }
		if (answer?.detail && data.status === 404)
			throw new Response(answer.detail, { status: data.status })
		return json<{ detail?: string, status: string, question_id: string, answer_id: string }>({ status: answer.status, answer_id: answer.answer_id, question_id: answer.question_id }, { status: data.status })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			return json<{ detail?: string, status?: string, question_id?: string, answer_id?: string }>({ detail: 'An error has occured!' }, { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json<{ detail?: string, status?: string, question_id?: string, answer_id?: string }>({ detail: "An error has occured!" }, { status: 500 })
		console.log('err', err.message);
		return json<{ detail?: string, status?: string, question_id?: string, answer_id?: string }>({ detail: err.message, status: undefined }, { status: 404 })
	}
}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string, status: number }
	// When NODE_ENV=production:
	// error.message = "Unexpected Server Error"
	// error.stack = undefined
	if (error.status === 400) {
		return (
			<main className="min-h-screen grid justify-center items-center">
				<div className="relative h-auto mx-auto flex flex-col justify-center gap-4 items-center p-4">
					<div className="flex flex-col items-center justify-center">
						<PhWarningFill className='w-8 h-8 text-yellow-500' />
						<h1 className="font-bold text-sm">
							{error.data}
						</h1>
					</div>
					<Link to="/login" className="hover:text-gray-500">Login</Link>
				</div>
			</main>
		)
	}
	return (
		<main className="min-h-screen grid justify-center items-center">
			<div className="relative h-auto mx-auto flex flex-col justify-center gap-4 items-center p-4">
				<h1 className="text-lg md:text-2xl font-bold text-center">Not Found</h1>
				<img src={NotFound} alt="Not Found!" className="w-3/5 mx-auto bg-cover" />
				<Link to="/" className="hover:text-gray-500">Go back home</Link>
			</div>
		</main>
	)
}

export default function QuestionID() {
	const actionData = useActionData<typeof action>()
	console.log(actionData)

	return (
		<main className="min-h-screen">
			<p>Edit question</p>
			<Form method="POST">
				<button type="submit">Submit</button>
			</Form>
		</main>
	)
}