import { Form, useFetcher } from '@remix-run/react'


function LoginForm() {
	const fetcher = useFetcher<{ detail: string }>()
	if (fetcher.state === 'submitting') {
		if (fetcher.data?.detail) {
			fetcher.data.detail = ''
		}
	}

	return (
		<>
			<div className="grid px-5 mt-20 gap-1">
				<div className="grid gap-8">
					<h1 className="font-bold tex-2xl text-center">Sign in</h1>
					<fetcher.Form method="post" className='grid gap-4 px-6'>
						<label htmlFor="email">
							Email
							<input type="email" name="email" id="email" placeholder='john@example.com' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						</label>
						<label htmlFor="password">
							Password
							<input type="password" name="password" id="password" placeholder='*********' className='w-full rounded border bg-gray-100 p-3 focus:outline-none' />
						</label>
						<button disabled={fetcher.state === 'submitting'} type='submit' className={`${fetcher.state === 'submitting' ? 'opacity-30' : ''} w-full rounded bg-primary-color py-3 text-white transition-all hover:-translate-y-1`}>{fetcher.state === 'submitting' ? "Please wait..." : "Sign in"}</button>
					</fetcher.Form>
				</div>
				<p className='px-6 text-red-500 font-semibold'>{fetcher.data?.detail}</p>
			</div>
		</>
	)
}

export default LoginForm