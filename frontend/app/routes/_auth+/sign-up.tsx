import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, useActionData, useFetcher, useNavigation } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import AuthForm from '~/components/Form/AuthForm'
import { storage } from '~/session.server';

function validateEmail(email: string) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePassword(password: string, cpassword: string): boolean {
	if (password.length < 6)
		return false
	if (cpassword !== password)
		return false
	return true
}

export async function action({
	request
}: ActionFunctionArgs) {
	const body = await request.formData()
	const firstname = body.get("firstname") as string
	const lastname = body.get("lastname") as string
	const email = body.get("email") as string
	const password = body.get("password") as string
	const cpassword = body.get("cpassword") as string
	const username = body.get("username") as string
	const errors = {} as { email: string, password: string, username: string }
	const session = storage

	if (!validateEmail(email))
		errors.email = "Invalid e-mail address"

	if (!validatePassword(password, cpassword))
		errors.password = "Password does not match"

	if (!username || username.length < 2)
		errors.username = "Username must be more than 2 characters"

	if (Object.keys(errors).length > 0)
		return json({ detail: "Please fill in the required fields correctly", errors });


	try {
		const data = await fetch("http://localhost:8000/api/auth/signup", {
			method: "POST", headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, body: JSON.stringify({ "email": email, "username": username, "password": password, "cpassword": cpassword })
		})
		const response = await data.json()
		if (Object.keys(response).includes('detail'))
			throw new Error(response.detail)

		if (response.status === "Ok") {
			// session.flash('')
			return redirect("/sign-in")
		}
	} catch (err: any) {
		if (err.errno === 'ECONNREFUSED')
			return json({ detail: "An error has occured!" }, { status: 500 })
		return json({ detail: err.message })
	}

	// return json({ detail: "Ok", errors: { ...errors } })
}


function SignUp() {
	const [disableBtn, setDisableBtn] = useState<boolean>(true)
	const [password, setPassword] = useState<string>()
	const [cpassword, setcPassword] = useState<string>()
	const [errors, setError] = useState<{ email: string, password?: string }>()
	const passwordMatch = cpassword && cpassword.length > 5 && password && password.length > 5 && password !== cpassword
	const actionData = useActionData<typeof action>()
	const nav = useNavigation()
	const loading = nav.state === "loading" || nav.state === "submitting"

	useEffect(() => {
		if (password?.length && cpassword === password)
			setDisableBtn(false)
		else
			setDisableBtn(true)
	}, [password, cpassword])

	return (
		<main className="min-h-screen w-full px-3 sm:w-3/4 md:w-3/6 lg:w-2/5 mx-auto pb-8">
			<div className="grid gap-3">
				<AuthForm detail={actionData?.detail} formTitle='Sign up' btnLabel='Sign up' btnDisabled={disableBtn}>
					<label htmlFor="firstname">
						Firstname
						<input type="text" name="firstname" id="firstname" placeholder='John' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
					</label>
					<label htmlFor="lastname">
						Lastname
						<input type="text" name="lastname" id="lastname" placeholder='Doe' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
					</label>
					<label htmlFor="email">
						Email <span className='text-red-500 font-bold text-lg'>*</span>
						<input onChange={(e) => {
							if (!validateEmail(e.currentTarget.value))
								setError({ email: "Invalid email address" })
							else
								setError({ email: "" })
						}} type="email" name="email" id="email" placeholder='john@example.com' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						{!loading && actionData?.errors ? (
							<em className='text-sm text-red-500'>{actionData?.errors.email}</em>
						) : null}
					</label>
					<label htmlFor="username">
						Username <span className='text-red-500 font-bold text-lg'>*</span>
						<input type="text" name="username" id="username" placeholder='johndoe' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						{!loading && actionData?.errors ? (
							<em className='text-sm text-red-500'>{actionData?.errors.username}</em>
						) : null}
					</label>
					<label htmlFor="password">
						Password <span className='text-red-500 font-bold text-lg'>*</span>
						<input onChange={e => {
							setPassword(e.currentTarget.value)
						}} type="password" name="password" id="password" placeholder='*********' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						{!loading && errors ? (
							<em className='text-sm text-red-500'>{errors.password}</em>
						) : null}
					</label>
					<label htmlFor="cpassword">
						Confirm Password <span className='text-red-500 font-bold text-lg'>*</span>
						<input onChange={e => setcPassword(e.currentTarget.value)} type="password" name="cpassword" id="cpassword" placeholder='*********' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						<p className='text-red-500 text-sm'>{passwordMatch ? 'Password does not match!' : ''}</p>
					</label>
				</AuthForm>
				<div className="flex justify-between items-center text-gray-600">
					<p>Have an account already? <Link to="/sign-in" className='font-semibold'>Sign in</Link></p>
				</div>
			</div>

		</main>
	)
}

export default SignUp