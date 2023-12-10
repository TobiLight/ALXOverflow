import { Link } from "@remix-run/react"
import { RecentlyAnswered } from "../Question/UserAnswer"
import { RecentlyAsked } from "../Question/UserQuestion"
import IconQuestionCircle from "../icons/QuestionIcon"

export const ProfileOverview = () => {
	return (
		<div className="grid gap-8 px-3 py-6">
			<div className="recently-asked">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-1">
						<IconQuestionCircle className='w-4 h-4' />
						<h1 className='font-bold text-sm'>Recently asked questions</h1>
					</div>
					<Link to="#">See all</Link>
				</div>
				<div className="grid gap-4">
					<RecentlyAsked />
					<RecentlyAsked />
					<RecentlyAsked />
				</div>
			</div>
			<hr />
			<div className="recently-answered">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-1">
						<p>✔</p>
						<h1 className='font-bold text-sm'>Recently answered questions</h1>
					</div>
					<Link to="#">See all</Link>
				</div>
				<div className="grid gap-4">
					<RecentlyAnswered />
					<RecentlyAnswered />
					<RecentlyAnswered />
				</div>
			</div>
		</div>
	)
}