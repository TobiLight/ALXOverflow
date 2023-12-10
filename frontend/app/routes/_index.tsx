import { json, type LoaderFunction, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import HomeQuestion from "~/components/HomePage/HomeQuestion";
import Header from "~/components/Shared/Header";
import IconQuestionCircle from "~/components/icons/QuestionIcon";
import IconBxsTag from "~/components/icons/TagIcon";
import { getUser, getUserSession, storage } from "~/session.server";

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

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	const user = await getUser(request);
	if (user)
		return json({ message: "Ok", isLoggedIn: true, user: { ...user } })

	return json({ message: "Ok", isLoggedIn: false, user: undefined })
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user

	return (
		<main className="min-h-screen w-full">
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<div className="md:w-3/5 lg:w-1/2 mx-auto">
				<section className="w-full">
					<form action="" className="w-full mt-8 flex items-center gap-1 px-4">
						<label htmlFor="search-qstn" className="w-full">
							<input type="text" placeholder="Search " name="search-qstn" className="w-full rounded border px-3 py-2 focus:outline-none" />
						</label>
						<button type="submit" className="w-auto flex bg-primary-color text-white px-3 py-2 rounded-sm">Search</button>
					</form>
				</section>



				<section className="borde-t pt-6 px-4 mb-5">
					<div className="mt-8 mb-3 flex items-center justify-between">
						<div className="flex gap-1 items-center">
							<IconQuestionCircle className="w-4 h-4" />
							<h1 className="text-xl font-semibold">Recently Asked Questions</h1>
						</div>
						<div className="see-more flex justify-center">
							<Link to="#" className="w-auto  text-gray-500 hover:text-gray-700">See more</Link>
						</div>
					</div>
					<div className="grid gap-5">
						<HomeQuestion />
						<HomeQuestion />
						<HomeQuestion />
					</div>
				</section>

				<section className="pt-6 px-4 mb-5">
					<div className="mt-8 mb-3 flex items-center justify-between">
						<div className="flex gap-1 items-center">
							<IconQuestionCircle className="w-4 h-4" />
							<h1 className="text-xl font-semibold">Most Asked Questions</h1>
						</div>
						<div className="see-more flex justify-center">
							<Link to="#" className="w-auto  text-gray-500 hover:text-gray-700">See more</Link>
						</div>
					</div>
					<div className="grid gap-5">
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
			</div>

			<footer className="absolute bottom-auto w-full text-center flex items-center justify-center py-2 border-t text-sm">
				<p>Made with love by <span className="font-semibold">0xTobii</span></p>
			</footer>
		</main>
	);
}
