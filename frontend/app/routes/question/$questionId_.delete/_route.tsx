import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node"
import { Link, useLoaderData, useRouteError } from "@remix-run/react";
import IconBxsDownvote from "~/components/icons/DownvoteIcon";
import IconReply from "~/components/icons/ReplyIcon";
import IconBxsUpvote from "~/components/icons/UpvoteIcon";
import { Question as IQuestion, IUser } from "~/utils/interfaces";
import NotFound from "~/../public/images/not-found.png"
import { getUser } from "~/session.server";
import { useState } from "react";
import Question from "~/components/Question/Question";
import Answer from "~/components/Answer/Answer";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const user: IUser | undefined = await getUser(request)

	// try {
	// 	const data = await fetch(`http://localhost:8000/api/question/123`, {
	// 		method: "GET",

	// 	})
	// 	const question = await data.json() as { detail?: string } & IQuestion
	// 	if (question?.detail)
	// 		throw new Response(question.detail)
	// 	return json({ detail: undefined, id: question.id })
	// } catch (err: any) {
	// 	if (err.message && err.message.includes('Unexpected token'))
	// 		return json({ detail: 'An error has occured!' }, { status: 500 })
	// 	if (err.errno === 'ECONNREFUSED')
	// 		return json({ detail: "An error has occured!" }, { status: 500 })
	// 	return json({ detail: err.message }, { status: 400 })
	// }
	const data = await fetch(`http://localhost:8000/api/question/${params.questionId}`, {
		method: "GET",

	})
	const question = await data.json() as { detail?: string } & IQuestion
	if (question?.detail)
		throw new Response(question.detail)
	if (!user)
		return json<{ detail?: string, question: IQuestion, user: IUser | undefined }>({ detail: undefined, question: { ...question }, user: undefined })
	return json<{ detail?: string, question: IQuestion, user: IUser }>({ detail: undefined, question: { ...question }, user: { ...user } })
}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string };
	// When NODE_ENV=production:
	// error.message = "Unexpected Server Error"
	// error.stack = undefined
	return (
		<main className="min-h-screen grid justify-center">
			<div className="mt-20 relative h-auto mx-auto flex flex-col justify-center gap-4 items-center">
				<h1 className="text-lg md:text-2xl font-bold">Not Found</h1>
				<img src={NotFound} alt="Not Found!" className="w-3/5 mx-auto bg-cover" />
				<Link to="/" className="hover:text-gray-500">Go back home</Link>
			</div>
		</main>
	)
}

export default function QuestionID() {
	const { question, user } = useLoaderData<typeof loader>()

	return (
		<main className="min-h-screen">
			<p>Delete question</p>
		</main>
	)
}