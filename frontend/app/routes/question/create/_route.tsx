import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { getAccessToken, getUser } from '~/session.server'
import toastStyles from "react-toastify/dist/ReactToastify.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

// export async function loader({ request }: LoaderFunctionArgs) {
// 	const user = await getUser()

// 	if (!user)
// 		redirect("/")
// 	retu
// }

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData()
	const title = form.get('title')
	const content = form.get('content')
	const accessToken = await getAccessToken(request)

	try {
		const newQuestion = await fetch("http://localhost:8000/api/question/create", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify({ "title": title, "content": content })
		})
		const response = await newQuestion.json() as { detail?: string, status: string, title: string, question_id: string }

		return json({ ...response })
	} catch (err: any) {
		return json<{ detail?: string, status?: string, title?: string, question_id?: string }>({ detail: "An error has occured", status: undefined, title: undefined }, { status: 400 })
	}

	console.log(title, content)
	return null
}


function AskQuestion() {
	const actionData = useActionData<typeof action>()

	useEffect(() => {
		if (actionData?.detail)
			toast.error(actionData.detail, { autoClose: 2000 })
		console.log(actionData);
		if (actionData?.status)
			toast.success(actionData.status, { autoClose: 1200 })

		// console.log(object);
	}, [actionData])
	return (
		<main className='min-h-screen'>
			<ToastContainer />
			<section className='px-4 my-6'>
				<h1 className='text-xl font-bold tracking-wide'>Ask a question</h1>
			</section>
			<section className='px-4'>
				<Form method="post" className='grid gap-4'>
					<div className="grid gap-4">
						<label htmlFor="title" className='grid text-sm'>
							Title
							<input type="text" name="title" placeholder='How to update current branch with changes from master using TFS?' className='px-4 py-2 focus:outline-none border rounded' />
						</label>
						<label htmlFor="content" className='grid text-sm'>
							Description
							<textarea name="content" className='px-4 py-2 focus:outline-none border rounded' />
						</label>
						<label htmlFor="description" className='grid text-sm'>
							Tags
							{/* <div className="flex items-center gap-1">
								<input type="checkbox" name="" id="" className='w-auto' />
								python
							</div> */}
							<p>Coming soon...</p>
						</label>
					</div>
					<button className='bg-primary-color text-white font-semibold py-2 rounded'>Post question</button>
				</Form>
			</section>
		</main>
	)
}

export default AskQuestion