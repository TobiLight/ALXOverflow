import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Link, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react'
import { commitSession, createUserSession, getSession, getUser, validateUser } from '../../session.server'
import { ALXForm as AuthForm } from '~/components/Form/Form';
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';


export const meta: MetaFunction = () => {
	return [
		{ title: "ALXOverflow | Sign In" },
	];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'))
	let flashMessage = session.get('createAccount') || null

	if (flashMessage)
		session.unset('createAccount')
	return json({ flashMessage: flashMessage }, {
		status: 200, headers: {
			"Set-Cookie": await commitSession(session)
		}
	})
}

export async function action({
	request
}: ActionFunctionArgs) {
	const body = await request.formData()
	const email = body.get("email")
	const password = body.get("password")

	try {
		const data = await fetch("http://localhost:8000/api/auth/login", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ "email": email, "password": password })
		})
		let response = await data.json() as { status: string, data: { id: string }, access_token: string, detail?: string }

		if (!response.status)
			throw new Error(response.detail)

		const redirectUrl = request.headers.get('referer')?.split('?')
		let redirectTo: string | undefined = undefined
		if (redirectUrl && redirectUrl?.length > 1)
			redirectTo = '/' + redirectUrl[1]

		if (response.status === "Ok")
			return await createUserSession({ redirectTo: redirectTo || undefined, accessToken: response.access_token, userId: response.data.id })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			return json({ detail: 'An error has occured!' }, { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json({ detail: "An error has occured!" }, { status: 500 })
		return json({ detail: err.message }, { status: 400 })
	}
}

function SignIn() {
	const [disableBtn, setDisableBtn] = useState<boolean>(true)
	const actionData = useActionData<typeof action>()
	const loaderData = useLoaderData<typeof loader>()


	useEffect(() => {
		if (actionData?.detail)
			toast.error(actionData?.detail, {
				position: 'top-right',
				autoClose: 3000
			})
	}, [actionData])

	return (
		<main className="min-h-screen w-full px-3 sm:w-3/4 md:w-3/6 lg:w-2/5 mx-auto">
			<div className="grid gap-3">
				<ToastContainer />
				<AuthForm formTitle='Sign in' btnLabel='Sign in' btnDisabled={disableBtn}>
					{loaderData.flashMessage && <div className="bg-green-300 p-3 rounded text-sm">{loaderData.flashMessage} Login to continue</div>}
					<label htmlFor="email">
						Email
						<input type="email" name="email" id="email" placeholder='john@example.com' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />

					</label>
					<label htmlFor="password">
						Password
						<input onChange={e => {
							if (e.currentTarget.value.length > 5)
								setDisableBtn(false)
							else
								setDisableBtn(true)
						}} type="password" name="password" id="password" placeholder='*********' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
					</label>
				</AuthForm>
				<div className="flex justify-between items-center text-gray-600">
					<Link to="/forgot-password" className='font-semibold'>Forgot Password</Link>
					<Link to="/register" className='font-semibold'>Create an account</Link>
				</div>
			</div>
		</main>
	)
}

export default SignIn