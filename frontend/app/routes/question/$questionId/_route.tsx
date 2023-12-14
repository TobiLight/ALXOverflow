import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node"
import { Link, isRouteErrorResponse, useActionData, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { Question as IQuestion, IUser } from "~/utils/interfaces";
import NotFound from "~/../public/images/not-found.png"
import { getAccessToken, getUser, getUserId } from "~/session.server";
import { useEffect } from "react";
import Question from "~/components/Question/Question";
import Answer from "~/components/Answer/Answer";
import { PhWarningFill } from "~/components/icons/Warning";
import { ToastContainer, toast } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";


export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

export async function loader({ request, params }: LoaderFunctionArgs) {
	try {
		const user: IUser | undefined = await getUser(request)
		const data = await fetch(`http://localhost:8000/api/question/${params.questionId}`, {
			method: "GET",

		})
		const question = await data.json() as { detail?: string } & IQuestion
		if (question?.detail)
			throw new Response(question.detail)
		if (!user)
			return json<{ detail?: string, question: IQuestion, user: IUser | undefined }>({ detail: undefined, question: { ...question }, user: undefined })
		return json<{ detail?: string, question: IQuestion, user: IUser }>({ detail: undefined, question: { ...question }, user: { ...user } })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ detail?: string, question: IQuestion, user: IUser | undefined }>({
			detail: err.detail, question: {
				id: '', title: '', content: '',
				created_at: new Date(),
				updated_at: new Date(),
				answers: [],
				author_id: ""
			}, user: undefined
		})
	}

}

export async function action({ request, params }: ActionFunctionArgs) {
	const accessToken = await getAccessToken(request)
	const userId = await getUserId(request)
	const form = await request.formData()
	const content = form.get('reply-question') as string
	const replyAnswer = form.get('reply_answer') as string
	const answerID = form.get('answerID') as string

	if (replyAnswer.length > 0) {
		console.log("Replying answer...")
		const data = await fetch(`http://localhost:8000/api/question/${params.questionId}/answer/${answerID}/reply`, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				"content": replyAnswer,
				"question_id": params.questionId,
				"answer_id": answerID,
				"author_id": userId
			})
		})

		const resp = await data.json()
		console.log(resp);

		return null
	}

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
				"content": content,
				"question_id": params.questionId,
				"author_id": userId
			})
		})
		const answer = await data.json() as { detail?: string, status: string, question_id: string, answer_id: string }
		if (answer?.detail && data.status === 404)
			throw new Response(answer.detail, { status: data.status })

		if (answer?.detail && data.status === 400)
			throw new Error(answer.detail)

		if (answer?.detail && data.status === 401)
			throw new Error("Your session has expired!")

		return json<{ detail?: string, status: string, question_id: string, answer_id: string }>({ status: answer.status, answer_id: answer.answer_id, question_id: answer.question_id }, { status: data.status })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			return json<{ detail: string, status?: string, question_id?: string, answer_id?: string }>({ detail: 'An error has occured!' }, { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json<{ detail: string, status?: string, question_id?: string, answer_id?: string }>({ detail: "An error has occured!" }, { status: 500 })
		return json<{ detail: string, status?: string, question_id?: string, answer_id?: string }>({ detail: err.message })
	}
}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string, status: number };
	// When NODE_ENV=production:
	// error.message = "Unexpected Server Error"
	// error.stack = undefined

	if (isRouteErrorResponse(error) && error.status === 500)
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
			</main>)
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
	const actionData = useActionData<typeof action>()

	useEffect(() => {
		if (actionData?.detail)
			toast.error(actionData.detail, { autoClose: 1600 })
		if (actionData?.status)
			toast.success(actionData.status, { autoClose: 2000 })
	}, [actionData])

	return (
		<main className="min-h-screen">
			<ToastContainer />
			<div className="px-4 lg:w-3/6 mx-auto">
				<Question user={user} question={{ author: question.author, id: question.id, title: question.title, content: question.content, created_at: question.created_at, updated_at: question.updated_at, author_id: question.author_id }} />

				<Answer user={user} answers={question.answers ? question.answers : []} question_id={question.id} />
			</div>

		</main>
	)
}