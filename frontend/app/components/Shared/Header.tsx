import { Link } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import IconCloseSharp from '../icons/CloseMenuIcon'
import IconMenuMotion from '../icons/MenuIcon'

function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
	const [showMobileNav, setMobileNav] = useState<boolean>(false)

	return (
		<header className="w-full z-[1] sticky top-0">
			<nav className="px-4 py-2 max-h-[60px] flex justify-between place-center border-b shadow bg-white">
				<div className="md:w-72 w-44 bg-gray-30 h-auto">
					<Link to="/">ALXOverflow</Link>
				</div>
				<div onClick={() => setMobileNav(!showMobileNav)} className={`flex items-center gap-1 cursor-pointer`}>
					{!showMobileNav ? <IconMenuMotion className="w-6 h-6" /> :
						<IconCloseSharp className="w-6 h-6" />
					}
				</div>
			</nav>
			<nav className={`w-full z-[2] p-4 bg-gray-100 flex flex-col justify-start overflow-hidden transition-all ease-out duration-[.4s] ${showMobileNav ? 'max-h-[300px] py-8' : 'max-h-0 py-0'}`}>
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
							<li><Link to='/dashboard'>Dashboard</Link></li>
							<form action="/sign-out" method="post">
								<button type="submit">Sign out</button>
							</form>
						</>
					}
				</ul>
			</nav>
		</header>
	)
}

export default Header