import { Link } from "@remix-run/react"
import IconEye from "../icons/EyeIcon"
import IconBxsUpvote from "../icons/UpvoteIcon"

export const RecentlyAnswered = () => {
	return (
		<div className="question-container border rounded p-2">
			<div className="question-title">
				<p className="text-sm">I have a project code that uses Team Foundation Server (TFS) for revision control. I created a new branch named br-feature from main using Visual Stud ...</p>
			</div>
			<div className="flex justify-end">
				<div className="flex items-center gap-1 text-sm">
					<IconBxsUpvote className="w-3 h-3" />
					<p>30 votes</p>
				</div>
			</div>
		</div>
	)
}