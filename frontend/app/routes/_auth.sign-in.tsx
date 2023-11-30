import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { useActionData, useFetcher } from '@remix-run/react';
import React from 'react'
import LoginForm from '~/components/Form/LoginForm'
import { createUserSession, getUserSession, storage } from '../session.server'

export const meta: MetaFunction = () => {
	return [
		{ title: "ALXOverflow | Sign In" },
	];
};

export async function loader({
	request
}: LoaderFunctionArgs) {
	const session = await getUserSession(request)
	if (session.has('user')) {
		return redirect('/')
	}
	return json({ message: "Ok" })
}

export async function action({
	request
}: ActionFunctionArgs) {
	const body = await request.formData()
	const email = body.get("email")
	const password = body.get("password")

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
		return json({
			detail: response.detail
		})
	}
	if (response.status === "Ok") {
		return await createUserSession({ accessToken: response.access_token, userId: response.data.id })
	}
}

function SignIn() {
	return (
		<main className="min-h-screen w-full">
			<LoginForm />
		</main>
	)
}

export default SignIn