import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { Form, Link } from '@remix-run/react'
import React from 'react'
import IconBxsLeftArrow from '~/components/icons/LeftArrow'
import { useParentRouteData } from '~/hook/useParentRouteData';
import { IUser } from '~/utils/interfaces';

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData()
	const username = form.get('username')
	return json({ message: "Ok" })
}

function UserProfileSettings() {
	const data = useParentRouteData<{ message: string, user: IUser }>("/dashboard");
	const user = data && data.user
	return (
		<main className="relative px-3 sm:w-3/6 md:w-3/5 lg:w-3/6 mx-auto">
			<div className="mt-6 mb-10 grid grid-cols-3 items-center justify-between">
				<Link to="/dashboard/profile" className="flex items-center gap-1">
					<IconBxsLeftArrow className='w-4 h-4' />
					<p>back</p>
				</Link>
				<h1 className='text-2xl font-bold'>Settings</h1>
			</div>

			<section>
				<Form method="post" className='grid mt-6'>
					<div className="grid grid-cols-2 gap-3 mb-3">
						<label htmlFor="first_name" className='grid text-sm'>
							Firstname
							<input type="text" placeholder='First name' name="first_name" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.first_name} />
						</label>
						<label htmlFor="last_name" className='grid text-sm'>
							Lastname
							<input type="text" placeholder='Last name' name="last_name" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.last_name} />
						</label>
					</div>

					<label htmlFor="username" className='grid text-sm mb-5'>
						Username
						<input type="text" placeholder='Username' name="username" className='w-full border rounded px-3 py-2 focus:outline-none' defaultValue={user && user.username} />
					</label>
					<label htmlFor="email" className='grid text-sm mb-5'>
						Email
						<input type="text" placeholder='Email' name="email" className='w-full border rounded px-3 py-2 focus:outline-none' />
					</label>
					<label htmlFor="bio" className='grid text-sm mb-5'>
						Bio
						<textarea placeholder='Bio' name="bio" className='w-full border rounded px-3 py-2 focus:outline-none' />
					</label>

					<button type="submit" className='w-full text-white bg-primary-color py-2 rounded-sm' type='submit'>Update</button>
				</Form>
			</section>
			<section className='p-4 mt-16 w-full text-center'>
				<Link to="/dashboard/profile/delete" className="w-full text-red-500 text-center font-bold">Delete account</Link>
			</section>
		</main>
	)
}

export default UserProfileSettings