import React from 'react'
import IconBxsComment from '../icons/CommentIcon'
import IconBxsDownvote from '../icons/DownvoteIcon'
import IconEye from '../icons/EyeIcon'
import IconBxsTag from '../icons/TagIcon'
import IconBxsUpvote from '../icons/UpvoteIcon'
import { Link } from '@remix-run/react'

function HomeQuestion() {
	return (
		<div className="grid gap-2 relative pt-[20px]">
			<div className="absolute text-xs font-semibold bg-[#FFA500] px-2 top-0 right-0 rounded">
				<p>posted 2 days ago</p>
			</div>
			<div className="grid gap-1">
				<Link to=""><h1 className="font-semibold hover:text-gray-500">How to update current branch with changes from master using TFS?</h1></Link>
				<p className="text-sm">I have a project code that uses Team Foundation Server (TFS) for revision control. I created a new branch named br-feature from main using Visual Stud ...</p>
			</div>
			<div className="flex flex-wrap items-center gap-2 text-xs border-y py-2">
				{/* <div className="flex items-center gap-1">
							<IconBxsTimeFive className="w-3 h-3" />
							<p>2023-06-07 23:40:57 </p>
						</div> */}
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
			</div>
		</div>
	)
}

export default HomeQuestion