import { Form, Link, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Question as IQuestion, IUser } from "~/utils/interfaces";

function Question({ user, question }: { user: IUser | undefined, question: IQuestion }) {
	const month = new Date(question.created_at).toLocaleString('default', { month: 'short' })
	const day = new Date(question.created_at).getDay()
	const timeCreated = new Date(question.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
		.toLowerCase();
	const [addAnswer, showAddAnswer] = useState<boolean>(false)
	const [error, setError] = useState<string>()
	const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
	const nav = useNavigation()
	const submitting = nav.state === 'submitting'
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		formRef.current?.reset()
	}, [nav.state === 'loading'])

	return (
		<>
			{/* <ToastContainer /> */}
			{question.author_id === user?.id && <div className="flex jusitfy-end items-center w-full">
				<div className="w-full flex  justify-end mt-4 gap-3">
					<Link to={`/question/${question.id}/edit`} className="bg-blue-500 text-white rounded px-3 py-1">Edit</Link>
					<Link to={`/question/${question.id}/delete`} className="bg-red-500 text-white rounded px-3 py-1">Delete</Link>
				</div>
			</div>}
			<section className="mt-4 question-title">
				<h1 className="font-bold text-xl">{question.title}</h1>
			</section>
			<section className="question-description mt-5 border-b pb-4">
				<p>
					{question.content}
				</p>

				<div className="tags flex gap-2 mt-4 text-xs">
					<p className="p-1 rounded-md bg-blue-100 text-blue-600">python</p>
					<p className="p-1 rounded-md bg-blue-100 text-blue-600">javascript</p>
				</div>

				<div className="flex justify-end">
					<div className="bg-blue-100 rounded p-2">
						<div className="grid gap-1">
							<p className="text-xs">asked {month} {day} at {timeCreated}</p>
							<div className="flex gap-1">
								<div className="rounded-md bg-orange-300 w-[30px] h-[30px]"></div>
								<div className="grid">
									<p className="text-xs form-extrabold">{question.author?.username}</p>
									<div className="flex gap-2 text-xs">
										{/* <p className="font-bold reputation">0</p> */}
										<div className="flex items-center gap-1">
											<div className="rounded-full w-2 h-2 bg-orange-400 gap-1"></div>
											<p>1</p>
										</div>
										<div className="flex items-center gap-1">
											<div className="rounded-full w-2 h-2 bg-gray-400 gap-1"></div>
											<p>24</p>
										</div>
										<div className="flex items-center gap-1">
											<div className="rounded-full w-2 h-2 bg-orange-600 gap-1"></div>
											<p>7</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="py-4 text-gray-500">
					<button type="button" onClick={e => {
						setError(undefined)
						if (user)
							showAddAnswer(!addAnswer)
						else {
							showAddAnswer(false)
							setError("You are not logged in!")
						}
					}}>Add a comment</button>
				</div>

				{addAnswer && user &&
					<Form ref={formRef} method="POST" action={`/question/${question.id}`} className="grid gap-1" >
						<label htmlFor="reply-question">
							<textarea onChange={e => {
								if (e.currentTarget.value.length > 1)
									setBtnDisabled(false)
								else
									setBtnDisabled(true)
							}} name="reply-question" id="reply-question" cols={30} rows={4} className="border-2 bg-gray-100 rounded focus:outline-none w-full p-3" placeholder="Write something..."></textarea>
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button disabled={submitting || btnDisabled} type='submit' className={`${submitting ? 'opacity-40' : ''} ${btnDisabled ? 'opacity-40' : ''} w-full rounded bg-primary-color py-3 text-white`}>{submitting ? "Posting..." : 'Post answer'}</button>
							<button type="button" onClick={e => showAddAnswer(false)} className="bg-gray-500 text-white rounded">Cancel</button>
						</div>
					</Form>}
				{error &&
					<div className="w-full sm:w-fit sm:mx-auto flex flex-wrap gap-2 items-center justify-center bg-red-500 text-white rounded-md p-3 text-sm ">
						<p>{error}</p>
						<Link to={`/login?question/${question.id}`} className="font-bold">Login</Link>
					</div>
				}
			</section>
		</>
	)
}

export default Question;