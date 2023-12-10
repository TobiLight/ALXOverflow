import React from 'react'

function AskQuestion() {
	return (
		<main className='min-h-screen'>
			<section className='px-4 my-6'>
				<h1 className='text-xl font-bold tracking-wide'>Ask a question</h1>
			</section>
			<section className='px-4'>
				<form method="post" className='grid gap-4'>
					<div className="grid gap-4">
						<label htmlFor="title" className='grid text-sm'>
							Title
							<input type="text" name="title" placeholder='How to update current branch with changes from master using TFS?' className='px-4 py-2 focus:outline-none border rounded' />
						</label>
						<label htmlFor="description" className='grid text-sm'>
							Description
							<textarea name="description" className='px-4 py-2 focus:outline-none border rounded' />
						</label>
						<label htmlFor="description" className='grid text-sm'>
							Tags
							{/* <div className="flex items-center gap-1">
								<input type="checkbox" name="" id="" className='w-auto' />
								python
							</div> */}
							<p>Coming soon...</p>
						</label>
					</div>
					<button className='bg-primary-color text-white font-semibold py-2 rounded'>Post question</button>
				</form>
			</section>
		</main>
	)
}

export default AskQuestion