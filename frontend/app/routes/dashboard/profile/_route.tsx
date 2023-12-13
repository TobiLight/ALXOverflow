import { Link } from '@remix-run/react'
import { useState } from 'react';
import { ProfileOverview } from '~/components/Dashboard/Overview';
import { useParentRouteData } from '~/hooks/useParentRouteData';
import { IUser } from '~/utils/interfaces';

function UserProfile() {
	const [showOverview, setShowOverview] = useState<boolean>(true)
	const data = useParentRouteData<{ message: string, user: IUser }>("/dashboard");
	const user = data && data.user

	return (
		<main className="min-h-screen">
			<div className="w-full h-[100px] bg-[#FFA500]">
				<div className="text-right font-semibold text-white px-8 pt-4">
					<Link to="/dashboard/settings" className='text-gray-700'>Edit</Link>
				</div>
			</div>
			<div className="profile-info border-b pb-4 grid justify-center items-center text-center relative -mt-12">
				<div className="rounded-md w-24
					 h-24 bg-gray-100 drop-shadow-lg mx-auto flex items-center justify-center">
					<p className='text-4xl font-bold'>{`${user && user.first_name && user.last_name ? user.first_name[0] + user.last_name[0] : user?.username && user.username[0]}`}</p>
				</div>
				<div className="name-info mt-3">
					<h1 className='text-lg font-bold'>{user && user.first_name} {user && user.last_name}</h1>
					<p className='font-semibold'>@{user && user.username}</p>
				</div>
				<div className="user-bio mt-5">
					<p>{user && user.bio}</p>
				</div>
				<div className="text-xs">
					<div className="w-auto mt-2">
						<div className="border rounded p-1 w-auto bg-gray-100">
							<p>Joined 23/09/2023</p>
						</div>
					</div>
				</div>
			</div>
			<section className="stats pb-8">
				<div className="flex border-b p-3 justify-between items-center text-center font-semibold">
					<div onClick={e => setShowOverview(true)} className="profile-overview cursor-pointer border-r w-full">
						<h1>Overview</h1>
					</div>
					<div onClick={() => setShowOverview(false)} className="profile-stats cursor-pointer w-full border-l">
						<h1>Profile Stats</h1>
					</div>
				</div>
				<div className='md:w-3/5 lg:w-3/6 mx-auto'>
					{showOverview ?
						<ProfileOverview /> :
						<div className="grid px-3 py-8">
							<div className="flex flex-col gap-4">
								<div className="w-full flex flex-col sm:flex-row justify-between gap-4">
									<div className="border rounded p-3 flex flex-col justify-center items-center w-full text-sm bg-gray-100">
										<h1 className='font-semibold'>Questions</h1>
										<p>4</p>
									</div>
									<div className="border rounded p-3 flex flex-col justify-center items-center w-full text-sm bg-gray-100">
										<h1 className='font-semibold'>Answers</h1>
										<p>40</p>
									</div>
								</div>
								<div className="w-full flex flex-col sm:flex-row justify-between gap-4">
									<div className="border rounded p-3 w-full flex flex-col justify-center items-center text-sm bg-gray-100">
										<h1 className='font-semibold'>Reputation score</h1>
										<p>987pts</p>
									</div>
									<div className="border rounded p-3 w-full flex flex-col justify-center items-center text-sm bg-gray-100">
										<h1 className='font-semibold'>Rank</h1>
										<p>N/A</p>
									</div>
								</div>
							</div>
						</div>
					}
				</div>
			</section>
		</main >
	)
}

export default UserProfile