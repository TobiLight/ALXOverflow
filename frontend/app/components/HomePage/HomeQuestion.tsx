import React from 'react'
import IconBxsComment from '../icons/CommentIcon'
import IconBxsDownvote from '../icons/DownvoteIcon'
import IconEye from '../icons/EyeIcon'
import IconBxsTag from '../icons/TagIcon'
import IconBxsUpvote from '../icons/UpvoteIcon'
import { Link } from '@remix-run/react'
import { Question } from '~/utils/interfaces'

interface HomeQuestion {
	title: string
	content: string
}

function HomeQuestion(question: Question) {
	return (
		<div className="grid gap-2 relative pt-[20px] border-b pb-4">
			{/* <div className="absolute text-xs font-semibold bg-[#FFA500] px-2 top-0 right-0 rounded">
				<p>posted 2 days ago</p>
			</div> */}
			<div className="grid gap-1">
				<Link to={`/question/${question.id}`}><h1 className="font-semibold text-primary-color hover:text-gray-500">{question.title}</h1></Link>
				<p className="text-sm">{question.content.length > 23 ? question.content.slice(0, 23) + ' ...' : question.content}</p>
			</div>
			{/* <div className="flex flex-wrap items-center gap-2 text-xs border-y py-2">

				<div className="flex items-center gap-1">
					<IconBxsComment className="w-3 h-3" />
					<p>1</p>
				</div>
				<div className="flex items-center gap-1">
					<IconEye className="w-3 h-3" />
					<p>30</p>
				</div>
				<div className="flex items-center gap-1">
					<div className="flex items-center gap-1">
						<IconBxsDownvote className="w-3 h-3 text-red-500" />
						<p>1</p>
					</div>
					<div className="flex items-center gap-1">
						<IconBxsUpvote className="w-3 h-3 text-green-500" />
						<p>45</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<IconBxsTag className="w-3 h-3" />
					<p>python / devops / javascript / mongo</p>
				</div>
			</div> */}
			<div className="flex justify-between">
				<div className="flex items-center gap-1 text-sm">
					<IconEye className="w-3 h-3" />
					<p className='text-xs'>seen 30 times</p>
				</div>
				<div className="flex items-center text-xs font-semibold bg-[#FFA500] px-2 rounded">
					<p>asked 2 days ago</p>
				</div>
			</div>
		</div>
	)
}

export default HomeQuestion