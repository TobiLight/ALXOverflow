import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { Link, useActionData, useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { createUserSession, getUserSession, storage } from '../../session.server'
import AuthForm from '~/components/Form/AuthForm';

export const meta: MetaFunction = () => {
	return [
		{ title: "ALXOverflow | Sign In" },
	];
};

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
		if (!response.status) {
			throw new Error(response.detail)
		}
		if (response.status === "Ok")
			return await createUserSession({ accessToken: response.access_token, userId: response.data.id })
	} catch (err: any) {
		if (err.errno === 'ECONNREFUSED')
			return json({ detail: "An error has occured!" }, { status: 500 })
		return json({ detail: err.message })
	}
}

function SignIn() {
	const [disableBtn, setDisableBtn] = useState<boolean>(true)
	const actionData = useActionData<typeof action>()

	return (
		<main className="min-h-screen w-full px-3 sm:w-3/4 md:w-3/6 lg:w-2/5 mx-auto">
			<div className="grid gap-3">
				<AuthForm detail={actionData?.detail} formTitle='Sign in' btnLabel='Sign in' btnDisabled={disableBtn}>
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
					<Link to="/sign-up" className='font-semibold'>Create an account</Link>
				</div>
			</div>
		</main>
	)
}

export default SignIn