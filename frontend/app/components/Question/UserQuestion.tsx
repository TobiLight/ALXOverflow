import { Link } from "@remix-run/react"
import IconEye from "../icons/EyeIcon"

export const RecentlyAsked = () => {
	return (
		<div className="question-container border rounded p-2">
			<div className="question-title">
				<Link to="/questions/123"><h1 className="font-semibold text-primary-color hover:text-gray-500">How to update current branch with changes from master using TFS?</h1></Link>
				<p className="text-sm">I have a project code that uses Team Foundation Server (TFS) for revision control. I created a new branch named br-feature from main using Visual Stud ...</p>
			</div>
			<div className="flex justify-end">
				<div className="flex items-center gap-1 text-sm">
					<IconEye className="w-3 h-3" />
					<p>30 views</p>
				</div>
			</div>
		</div>
	)
}