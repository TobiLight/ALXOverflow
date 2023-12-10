import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import IconBxsDownvote from "~/components/icons/DownvoteIcon";
import IconReply from "~/components/icons/ReplyIcon";
import IconBxsUpvote from "~/components/icons/UpvoteIcon";

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
	console.log(params);
	return json({ message: "Ok", id: params.questionId })
}

export default function Question() {
	const loaderData = useLoaderData<typeof loader>()
	return (
		<main className="min-h-screen">
			<div className="px-4 lg:w-3/6 mx-auto">
				<section className="mt-6 question-title">
					<h1 className="font-bold text-xl">How to update current branch with changes from master using TFS?</h1>
					{/* <div className="mt-2 border-y py-2">
						<p className="text-xs">Posted on: <span className="font-semibold">
							24/3/2023</span></p>
						<p className="text-xs">Posted by: <span className="font-semibold">0xTobi</span></p>
						<p className="text-xs">Tags: <span className="font-semibold">python, javascript</span></p>
					</div> */}
				</section>
				<section className="question-description mt-5 border-b pb-4">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>

					<div className="tags flex gap-2 mt-4 text-xs">
						<p className="p-1 rounded-md bg-blue-100 text-blue-600">python</p>
						<p className="p-1 rounded-md bg-blue-100 text-blue-600">javascript</p>
					</div>

					<div className="flex justify-end">
						<div className="bg-blue-100 rounded p-2">
							<div className="grid gap-1">
								<p className="text-xs">asked Nov 18 at 13:12</p>
								<div className="flex gap-1">
									<div className="rounded-md bg-orange-300 w-[30px] h-[30px]"></div>
									<div className="grid">
										<p className="text-xs">John Doe</p>
										<div className="flex gap-2 text-xs">
											<p className="font-bold">0</p>
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
						<button>Add a comment</button>
					</div>
					<form action="" method="POST" className="grid gap-1">
						<label htmlFor="">
							<textarea name="reply-question" id="reply-question" cols={30} rows={4} className="border rounded focus:outline-none w-full p-3" placeholder="Write something..."></textarea>
						</label>
						<div className="flex justify-end">
							<button className="text-white bg-primary-color rounded px-3 py-1">Post comment</button>
						</div>
					</form>
				</section>
				{/* <section className="px-4">
				<form method="post">
					<label htmlFor="answer-question">
						<textarea name="answer-question" id="answer-question" className="w-full" rows={4}></textarea>
					</label>
				</form>
			</section> */}
				<section className="flex items-center justify-between pt-6">
					<h1 className="text-lg font-semibold pb-2">6 Answers</h1>

					{/* <form method="post">
					<label htmlFor="answer-question">
						<textarea name="answer-question" id="answer-question" className="w-full shadow-inner bg-gray-100 focus:outline-none border rounded p-4" rows={4}></textarea>
					</label>
					<div className="flex w-fit ml-auto transform translate-x-0">
						<button type="submit" className="text-white bg-primary-color py-2 rounded">Post answer</button>
					</div>
				</form> */}
					<div className="flex items-center">
						<p className="text-sm">Sorted by:</p>
						<select name="" id="" className="p-2 border rounded-md text-sm">
							<option value="">Highest Score</option>
							<option value="">Trending</option>
						</select>
					</div>
				</section>
				<section className="answers my-5">
					<div className="grid gap-4 mt-4">
						<div className="grid border-b pb-3">
							<div className="flex gap-2 items-start">
								<div className="flex flex-col gap-1 items-center">
									<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
										<IconBxsUpvote className="w-5 h-5 text-green-500" />
									</div>
									<div className="count">
										10
									</div>
									<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
										<IconBxsDownvote className="w-5 h-5 text-red-500" />
									</div>
								</div>
								<div className="grid">
									<p className="text-sm">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									</p>

									<div className="flex justify-end mt-4">
										<div className="">
											<div className="grid gap-1">
												<p className="text-xs">asked Nov 18 at 13:12</p>
												<div className="flex gap-1">
													<div className="rounded-md bg-orange-300 w-[30px] h-[30px]"></div>
													<div className="grid">
														<p className="text-xs">John Doe</p>
														<div className="flex gap-2 text-xs">
															<p className="font-bold">0</p>
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

									<div className="add-comment text-gray-500 text-sm mt-4">
										<button>Reply comment</button>
									</div>

								</div>
							</div>



							<div className="mt-3 pl-10">
								<textarea name="" id="" cols={30} rows={3} className="w-full p-3 border rounded-md"></textarea>
								<div className="flex justify-end">
									<button className="bg-primary-color text-white px-3 py-1 rounded">Reply</button>
								</div>
							</div>
						</div>

						<div className="grid border-b pb-3">
							<div className="flex gap-2 items-start">
								<div className="flex flex-col gap-1 items-center">
									<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
										<IconBxsUpvote className="w-5 h-5 text-green-500" />
									</div>
									<div className="count">
										10
									</div>
									<div className="upvote flex items-center rounded-full bg-gray-200 p-2">
										<IconBxsDownvote className="w-5 h-5 text-red-500" />
									</div>
								</div>
								<div className="grid">
									<p className="text-sm">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									</p>

									<div className="flex justify-end mt-4">
										<div className="">
											<div className="grid gap-1">
												<p className="text-xs">asked Nov 18 at 13:12</p>
												<div className="flex gap-1">
													<div className="rounded-md bg-orange-300 w-[30px] h-[30px]"></div>
													<div className="grid">
														<p className="text-xs">John Doe</p>
														<div className="flex gap-2 text-xs">
															<p className="font-bold">0</p>
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

									<div className="add-comment text-gray-500 text-sm mt-4">
										<button>Reply comment</button>
									</div>

								</div>
							</div>



							<div className="mt-3 pl-10">
								<textarea name="" id="" cols={30} rows={3} className="w-full p-3 border rounded-md"></textarea>
								<div className="flex justify-end">
									<button className="bg-primary-color text-white px-3 py-1 rounded">Reply</button>
								</div>
							</div>
						</div>
					</div>

				</section>
			</div>

		</main>
	)
}