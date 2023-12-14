import { ActionFunctionArgs, LinksFunction, json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { getAccessToken, getUserId } from '~/session.server'
import toastStyles from "react-toastify/dist/ReactToastify.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

export async function action({ request }: ActionFunctionArgs) {
	const userId = await getUserId(request)
	const accessToken = await getAccessToken(request)
	console.log(userId, accessToken);
	try {
		const response = await fetch(`http://localhost:8000/api/user/profile/${userId}/delete`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			}
		})
		const data = await response.json()
		if (data.status === "Ok")
			return redirect('/')
		console.log(data);
		return json({
			detail: "An error occured!"
		}, { status: 400 })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			return json({ detail: 'An error has occured!' }, { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json({ detail: "An error has occured!" }, { status: 500 })
		return json({ detail: err.message }, { status: 400 })
	}

}

function DeleteAccount() {
	const actionData = useActionData<typeof action>()

	useEffect(() => {
		if (actionData?.detail)
			toast.error(actionData.detail, { autoClose: 1500 })
	}, [actionData])

	return (
		<main className='min-h-screen'>
			<ToastContainer />
			<div className="grid gap-5 mt-10 items-center text-center text-lg font-semibold bg-white rounded shadow-lg w-fit p-16 mx-auto">
				<h1>Are you sure you want to delete your account? This action is irreversible!</h1>
				<Form method="DELETE" className="flex justify-center">
					<button type="submit" className='bg-red-500 hover:bg-red-400 text-white rounded px-3 py-1 font-extrbold'>Yes, delete</button>
				</Form>
			</div>
		</main>
	)
}

export default DeleteAccount