import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import HomeQuestion from "~/components/HomePage/HomeQuestion";
import IconCloseSharp from "~/components/icons/CloseMenuIcon";
import IconMenuMotion from "~/components/icons/MenuIcon";
import IconQuestionCircle from "~/components/icons/QuestionIcon";
import IconBxsTag from "~/components/icons/TagIcon";

export const meta: MetaFunction = () => {
	return [
		{ title: "ALXOverflow | Where Questions Find Answers 🚀" },
		{
			name: "description", content: `ALX Overflow is a specialized online 
      platform designed to cater to the unique needs of students enrolled
      in the ALX Software Engineering Program.`
		},
	];
};

export default function Index() {
	const [showMobileNav, setMobileNav] = useState<boolean>(false)
	return (
		<main className="min-h-screen w-full">
			<header className="w-full z-[1] sticky top-0">
				<nav className="px-4 py-2 max-h-[60px] flex justify-between place-center border-b shadow bg-white">
					<div className="md:w-72 w-44 bg-gray-300 h-auto">

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
						<li><Link to="/sign-in">Sign In</Link></li>
						<li><Link to="/sign-up">Create an account</Link></li>
					</ul>
				</nav>
			</header>


			<section className="w-full">
				<form action="" className="w-full mt-8 flex items-center gap-1 px-4">
					<label htmlFor="search-qstn" className="w-full">
						<input type="text" placeholder="Search " name="search-qstn" className="w-full rounded border px-3 py-2 focus:outline-none" />
					</label>
					<button type="submit" className="w-auto flex bg-primary-color text-white px-3 py-2 rounded-sm">Search</button>
				</form>
			</section>

			<div className="px-4 mt-8 mb-3 flex gap-1 items-center">
				<IconQuestionCircle className="w-4 h-4" />
				<h1 className="text-xl font-semibold">Recent Questions</h1>
			</div>

			<section className="border-t pt-6 px-4 mb-5">
				<div className="grid gap-5">
					<HomeQuestion />
					<HomeQuestion />
					<HomeQuestion />
					<HomeQuestion />
					<HomeQuestion />
					<HomeQuestion />
				</div>
			</section>

			<div className="px-4 mt-8 flex gap-1 items-center">
				<IconBxsTag className="w-4 h-4" />
				<h1 className="text-xl font-semibold">Popular Tags</h1>
			</div>

			<section className="pt-6 px-4 mb-5">
				<div className="flex flex-wrap items-center gap-1 gap-y-2 border-t pt-6 px-4 mb-5 text-sm">
					<p className="rounded-full px-2 py-1 bg-gray-200">
						Javascript
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						DevOps
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						PostgreSQL
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						Python
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						Backend
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						TailwindCSS
					</p>
					<p className="rounded-full px-2 py-1 bg-gray-200">
						React
					</p>
				</div>
			</section>
			<footer className="text-center flex items-center justify-center py-2 border-t text-sm">
				<p>Made with love by <span className="font-semibold">0xTobii</span></p>
			</footer>
		</main>
	);
}
