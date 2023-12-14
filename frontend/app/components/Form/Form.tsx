import { Form, useNavigation } from '@remix-run/react'
import React from 'react'

interface AuthProps {
	children: React.ReactNode
	formTitle?: string
	btnLabel: string
	btnDisabled?: boolean
	className?: string
}

export function ALXForm({ children, formTitle, btnLabel, btnDisabled, className }: AuthProps) {
	const nav = useNavigation()
	const submitting = nav.state === 'submitting'

	return (
		<>
			<div className={`${className ? className : 'grid mt-10 gap-1 w-full'}`}>
				<div className="grid gap-8">
					{formTitle && <h1 className="font-bold text-2xl text-center">{formTitle}</h1>}
					<div>
						<Form method="post" className='grid gap-4'>
							{children}
							<button disabled={submitting || btnDisabled} type='submit' className={`${submitting ? 'opacity-40' : ''} ${btnDisabled ? 'opacity-40' : ''} w-full rounded bg-primary-color py-3 text-white transition-all hover:-translate-y-1`}>{submitting ? "Please wait..." : btnLabel}</button>
						</Form>
					</div>
				</div>
			</div>
		</>
	)
}

// export default { ALXForm }