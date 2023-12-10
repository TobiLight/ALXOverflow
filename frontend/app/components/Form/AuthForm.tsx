import { Form, useFetcher, useNavigation } from '@remix-run/react'
import React from 'react'

interface Props {
	children: React.ReactNode
	formTitle: string
	btnLabel: string
	btnDisabled?: boolean
	detail?: string
}

function AuthForm({ children, formTitle, btnLabel, btnDisabled, detail }: Props) {
	const fetcher = useFetcher<{ detail: string, message: string, errors: { email: string } }>()
	if (fetcher.state === 'submitting') {
		if (fetcher.data) {
			fetcher.data.detail = ''
			fetcher.data.message = ''
		}
	}
	const nav = useNavigation()
	const loading = nav.state === 'submitting' || nav.state === 'loading'

	return (
		<>
			<div className="grid mt-10 gap-1 w-full">
				<div className="grid gap-8">
					<h1 className="font-bold tex-2xl text-center">{formTitle}</h1>
					<div>
						<Form method="post" className='grid gap-4'>
							{children}
							<button disabled={fetcher.state === 'submitting' || btnDisabled} type='submit' className={`${loading ? 'opacity-40' : ''} ${btnDisabled ? 'opacity-40' : ''} w-full rounded bg-primary-color py-3 text-white transition-all hover:-translate-y-1`}>{fetcher.state === 'submitting' ? "Please wait..." : btnLabel}</button>
						</Form>
						{!loading && detail ? <p className='text-red-500 text-sm italic font-semibold'>{detail}</p> : null}
					</div>
				</div>
			</div>
		</>
	)
}

export default AuthForm