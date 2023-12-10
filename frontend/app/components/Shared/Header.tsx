import { Link } from '@remix-run/react'
import { useState } from 'react'
import IconCloseSharp from '../icons/CloseMenuIcon'
import IconMenuMotion from '../icons/MenuIcon'
import { IUser } from '~/utils/interfaces'

function Header({ isLoggedIn, user }: { isLoggedIn: boolean, user: IUser }) {
	const [showMobileNav, setMobileNav] = useState<boolean>(false)

	return (
		<header className="w-full z-[1] sticky top-0">
			<div className="md:hidden">
				<div className="px-4 py-2 max-h-[60px] flex justify-between place-center border-b shadow bg-white">
					<div className="md:w-72 w-44 bg-gray-30 h-auto">
						<Link to="/">ALXOverflow</Link>
					</div>
					<div onClick={() => setMobileNav(!showMobileNav)} className={`flex items-center gap-1 cursor-pointer`}>
						{!showMobileNav ? <IconMenuMotion className="w-6 h-6" /> :
							<IconCloseSharp className="w-6 h-6" />
						}
					</div>
				</div>
				<nav className={`w-full z-[2] p-4 bg-gray-100 flex flex-col justify-start overflow-hidden transition-all ease-out duration-[.4s] ${showMobileNav ? 'max-h-[500px] py-8' : 'max-h-0 py-0'}`}>
					<ul className="text-center h-full grid gap-5 text-2xl">
						<li>
							<Link to="/">Home</Link>
						</li>
						<li><Link to='/questions'>Questions</Link></li>
						{!isLoggedIn &&
							<> <li><a href="/sign-in">Sign In</a></li>
								<li><a href="/sign-up">Create an account</a></li>
							</>
						}
						{
							isLoggedIn && <>
								<li><a href='/question/ask'>Ask</a></li>
								<li><a href='/dashboard/profile'>Dashboard</a></li>
								<li><a href='/dashboard/settings'>Settings</a></li>
								<form action="/sign-out" method="post">
									<button type="submit">Sign out</button>
								</form>
							</>
						}
					</ul>
				</nav>
			</div>

			<nav className="hidden md:flex items-center p-3 justify-between border-b shadow-md bg-white">
				<div className="md:w-72 w-44 bg-gray-30 h-auto">
					<Link to="/">ALXOverflow</Link>
				</div>
				<ul className="flex items-center gap-4">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li><Link to='/questions'>Questions</Link></li>

					{!isLoggedIn &&
						<> <li><a href="/sign-in">Sign In</a></li>
							<li><a href="/sign-up">Create an account</a></li>
						</>
					}
					{
						isLoggedIn && <>
							<li><a href='/question/ask'>Ask</a></li>
							<div className="cursor-pointer relative profile">
								<div className="profile-icon font-bold rounded-full bg-gray-100 flex items-center justify-center p-2 w-12 h-12">
									<p>{user && user.username && user.username[0]}</p>
								</div>
								<div className="absolute profile-icon-submenu right-0 gap-3 p-3 bg-white">
									<li><a href='/dashboard/profile'>Dashboard</a></li>
									<li><a href='/dashboard/settings'>Settings</a></li>
									<form action="/sign-out" method="post">
										<button type="submit">Sign out</button>
									</form>
								</div>
							</div>

							{/* <li><a href='/dashboard/profile'>Dashboard</a></li>
							<li><a href='/dashboard/settings'>Settings</a></li>
							<form action="/sign-out" method="post">
								<button type="submit">Sign out</button>
							</form> */}
						</>
					}
				</ul>
			</nav>
		</header>
	)
}

export default Header