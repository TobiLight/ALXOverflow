import { ActionFunction, ActionFunctionArgs, LinksFunction, json } from '@remix-run/node';
import { Link, useActionData, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { ALXForm as UpdateForm } from '~/components/Form/Form';
import IconBxsLeftArrow from '~/components/icons/LeftArrow'
import { useParentRouteData } from '~/hooks/useParentRouteData';
import { getAccessToken, getUserId } from '~/session.server';
import { IUser } from '~/utils/interfaces';
import toastStyles from "react-toastify/dist/ReactToastify.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];


export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await getUserId(request)
	const form = await request.formData()
	const firstname = form.get('firstname')
	const lastname = form.get('lastname')
	const bio = form.get('bio')
	const accessToken = await getAccessToken(request)

	try {
		const data = await fetch(`http://localhost:8000/api/user/profile/${userId}/edit`, {
			method: 'PUT',
			body: JSON.stringify({ "first_name": firstname, "last_name": lastname, "bio": bio }),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			}
		})

		const response = await data.json() as { status: string, data: IUser, detail?: string }

		if (!response.status)
			throw new Error(response.detail)
		return json({ detail: 'Profile updated!' })
	} catch (err: any) {
		return json({ detail: err.message }, { status: 400 })
	}
}

function UserProfileSettings() {
	const data = useParentRouteData<{ message: string, user: IUser }>("/dashboard");
	const user = data && data.user
	const [disableBtn, setDisableBtn] = useState<boolean>(true)
	const actionData = useActionData<typeof action>()

	useEffect(() => {
		if (actionData?.detail)
			toast.success(actionData?.detail, {
				position: 'top-right',
				autoClose: 3000
			})
	}, [actionData])

	return (
		<main className="relative px-3 sm:w-3/6 md:w-3/5 lg:w-3/6 mx-auto">
			<ToastContainer />
			<div className="mt-6 grid grid-cols-3 items-center justify-between">
				<Link to="/dashboard/profile" className="flex items-center gap-1">
					<IconBxsLeftArrow className='w-4 h-4' />
					<p>back</p>
				</Link>
				{/* <h1 className='text-2xl font-bold'>Settings</h1> */}
			</div>

			<section>
				<UpdateForm formTitle={'Settings'} btnLabel={'Update'} btnDisabled={disableBtn}>
					<div className="grid grid-cols-2 gap-3 mb-3">
						<label htmlFor="first_name" className='grid text-sm'>
							Firstname
							<input onChange={e => {
								if (e.currentTarget.value.length >= 1)
									setDisableBtn(false)
								else
									setDisableBtn(true)
							}} type="text" placeholder='First name' name="firstname" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.first_name} />
						</label>
						<label htmlFor="last_name" className='grid text-sm'>
							Lastname
							<input onChange={e => {
								if (e.currentTarget.value.length >= 1)
									setDisableBtn(false)
								else
									setDisableBtn(true)
							}} type="text" placeholder='Last name' name="lastname" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.last_name} />
						</label>
					</div>

					<label htmlFor="username" className='grid text-sm mb-5'>
						Username
						<input type="text" placeholder='Username' name="username" className='w-full border rounded px-3 py-2 focus:outline-none bg-gray-200' defaultValue={user && user.username} disabled={true} />
					</label>
					<label htmlFor="email" className='grid text-sm mb-5'>
						Email
						<input type="text" placeholder='Email' name="email" className='w-full border rounded px-3 py-2 focus:outline-none bg-gray-200' defaultValue={user && user.email} disabled={true} />
					</label>
					{/* <div className="flex items-center justify-between gap-3">
						<label htmlFor="password" className='grid text-sm mb-5 w-full'>
							New password
							<input type="password" name="password" placeholder='******' className='w-full border rounded px-3 py-2 focus:outline-none' />
						</label>
						<label htmlFor="password" className='grid text-sm mb-5 w-full'>
							Confirm new password
							<input type="password" name="password" placeholder='******' className='w-full border rounded px-3 py-2 focus:outline-none' />
						</label>
					</div> */}
					<label htmlFor="bio" className='grid text-sm mb-5'>
						Bio
						<textarea onChange={e => {
							if (e.currentTarget.value.length >= 1)
								setDisableBtn(false)
							else
								setDisableBtn(true)
						}} cols={30} rows={4} placeholder='Bio' name="bio" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.bio} />
					</label>
				</UpdateForm>
			</section>
			<section className='p-4 mt-16 w-full text-center'>
				<Link to="/dashboard/profile/delete" className="w-full text-red-500 text-center font-bold">Delete account</Link>
			</section>
		</main>
	)
}

export default UserProfileSettings