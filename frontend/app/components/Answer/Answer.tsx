import { IAnswer, IUser } from "~/utils/interfaces"
import IconBxsDownvote from "../icons/DownvoteIcon"
import IconBxsUpvote from "../icons/UpvoteIcon"
import { useEffect, useState } from "react"
import { Link, useFetcher, useNavigation } from "@remix-run/react"

function Answer({ answers, user, question_id }: { answers: IAnswer[] | [], user: IUser | undefined, question_id: string }) {
	const [replyAnswer, setShowReplyAnswer] = useState<{ id: string, show: boolean }>({ id: '', show: false })
	const [error, setError] = useState<string>()
	const [addAnswer, showAddAnswer] = useState<boolean>(false)
	const fetcher = useFetcher()
	const [replyAns, setReplyAns] = useState<string>()
	const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
	const nav = useNavigation()
	const submitting = nav.state === 'submitting'



	useEffect(() => {
		console.log(fetcher);
	}, [fetcher])

	return (
		<>
			{answers.length > 0 && <section className="flex items-center justify-between pt-6">
				{answers.length > 0 && <h1 className="text-lg font-semibold pb-2">{answers.length} {answers.length > 1 ? 'Answers' : 'Answer'}</h1>}

				<div className="flex items-center">
					<p className="text-sm">Sorted by:</p>
					<select name="" id="" className="p-2 border rounded-md text-sm">
						<option value="">Highest Score</option>
						<option value="">Trending</option>
					</select>
				</div>
			</section>}
			<section className="answers my-5">
				<div className="grid gap-4 mt-4">
					{answers.length ? answers.map((answer, idx) => {
						return (
							<div key={idx} className="grid border-b pb-3">
								<div className="flex gap-2 items-start">
									<div className="flex flex-col gap-1 items-center">
										<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
											<IconBxsUpvote className="w-5 h-5 text-green-500" />
										</div>
										<div className="count">
											0
										</div>
										<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
											<IconBxsDownvote className="w-5 h-5 text-red-500" />
										</div>
									</div>
									<div className="grid">
										<p className="text-sm">
											{answer.content}
										</p>

										<div className="flex justify-end mt-4">
											<div className="">
												<div className="grid gap-1 bg-gray-100 rounded-md p-2">
													<p className="text-xs">answered on {new Date(answer.created_at).toLocaleString('default', { month: 'short' })} {new Date(answer.created_at).getDay()} at {new Date(answer.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
														.toLowerCase()}</p>
													<div className="flex gap-1">
														<div className="rounded-md bg-orange-300 w-[30px] h-[30px]"></div>
														<div className="grid">
															<p className="text-xs font-extrabold">{answer.author && answer.author?.username}</p>
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

									</div>

								</div>
								<div className="add-comment text-gray-500 text-sm mt-4 flex justify-end">
									<button type="button" id={answer.id} onClick={e => {
										setError(undefined)
										if (user) {
											showAddAnswer(true)
											if (answer.id === e.currentTarget.id)
												setShowReplyAnswer({ id: answer.id, show: true })
										}
										else {
											showAddAnswer(false)
											setShowReplyAnswer({ id: answer.id, show: false })
											setError("You are not logged in!")
										}

									}}>Reply answer</button>
								</div>


								{addAnswer && replyAnswer.show && replyAnswer.id === answer.id &&
									<fetcher.Form method="POST" action={`/question/${question_id}`} className="mt-3 pl-10">
										<input type="hidden" name="reply_answer" defaultValue={replyAns} />
										<input type="hidden" name="answerID" value={answer.id} />
										<label htmlFor="reply-answer">
											<textarea onChange={e => {
												if (e.currentTarget.value.length > 1) {
													setReplyAns(e.currentTarget.value)
													setBtnDisabled(false)
												}
												else
													setBtnDisabled(true)
											}} name="reply-answer" id="" cols={30} rows={3} className="w-full p-3 border-2 rounded-md bg-gray-100 focus:outline-none"></textarea>
										</label>
										<div className="flex mt-2 gap-2 justify-end">
											<button disabled={submitting || btnDisabled} className={`${submitting ? 'opacity-40' : ''} ${btnDisabled ? 'opacity-40' : ''} bg-primary-color rounded text-white px-3 py-1 rounde`}>{submitting ? 'Replying...' : 'Reply'}</button>
											<button onClick={e => {
												setShowReplyAnswer({ id: answer.id, show: false })
											}} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
										</div>
									</fetcher.Form>
								}
								{error && replyAnswer.id === answer.id &&
									<div className="w-full sm:w-fit sm:mx-auto flex flex-wrap gap-2 items-center justify-center bg-red-500 text-white rounded p-3 text-sm ">
										<p>{error}</p>
										<Link to={`/login?question/${question_id}`} className="font-bold">Login</Link>
									</div>
								}
							</div>
						)
					}) :
						<p className="text-center font-bold">Be the first to answer 😎</p>
					}
				</div>
			</section>
		</>
	)
}

export default Answer