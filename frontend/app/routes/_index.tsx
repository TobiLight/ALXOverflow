import { json, LinksFunction, type LoaderFunction, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useRouteError } from "@remix-run/react";
import HomeQuestion from "~/components/HomePage/HomeQuestion";
import Header from "~/components/Shared/Header";
import IconQuestionCircle from "~/components/icons/QuestionIcon";
import IconBxsTag from "~/components/icons/TagIcon";
import { getAccessToken, getUser } from "~/session.server";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { IUser, Question } from "~/utils/interfaces";
import { PhWarningFill } from "~/components/icons/Warning";
import Footer from "~/components/Shared/Footer";

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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const user: IUser | undefined = await getUser(request);
		const data = await fetch('http://localhost:8000/api/questions', {
			method: "GET"
		})
		const questions = await data.json() as Question[] | []

		if (user)
			return json<{ isLoggedIn: boolean, user: IUser, questions: Question[] | [] }>({ isLoggedIn: true, user: { ...user }, questions: questions })

		return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: questions })
	} catch (err: any) {
		if (err.message.includes('Unexpected token'))
			return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] }, { status: 500 })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		if (err.errno === 'ECONNREFUSED')
			return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] }, { status: 500 })
		// throw new Response('Server is temporarily unavailable! :(', { status: 500 })
		return json<{ isLoggedIn: boolean, user?: IUser, questions: Question[] | [] }>({ isLoggedIn: false, user: undefined, questions: [] }, { status: 400 })
	}

}

export function ErrorBoundary() {
	const error = useRouteError() as { data: string }
	// When NODE_ENV=production:
	// error.message = "Unexpected Server Error"
	// error.stack = undefined
	return (
		<main className="min-h-screen grid justify-center items-center">
			<div className="relative h-auto mx-auto flex flex-col justify-center gap-4 items-center p-4">
				<div className="flex flex-col items-center justify-center">
					<PhWarningFill className='w-8 h-8 text-yellow-500' />
					<h1 className="font-bold text-sm">
						{error.data}
					</h1>
				</div>
				<Link to="/" className="hover:text-gray-500">Go back home</Link>
			</div>
		</main>
	)
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const user = data && data.user
	const questions = data && data.questions as Question[] | []
	console.log(data)

	return (
		<div className="min-h-screen w-full h-full">
			<Header isLoggedIn={data.isLoggedIn} user={user} />
			<main className="min-h-screen md:w-3/5 lg:w-1/2 mx-auto">
				<section className="w-full">
					<form action="" className="w-full mt-8 flex items-center gap-1 px-4">
						<label htmlFor="search-qstn" className="w-full">
							<input type="text" placeholder="Search " name="search-qstn" className="w-full rounded border px-3 py-2 focus:outline-none" />
						</label>
						<button type="submit" className="w-auto flex bg-primary-color text-white px-3 py-2 rounded-sm">Search</button>
					</form>
				</section>



				<section className="borde-t pt-6 px-4 mb-5">
					<div className="mt-8 mb-3 flex gap-4 items-end sm:items-center justify-between">
						<div className="grid gap-1 sm:flex items-center flex-grow">
							<IconQuestionCircle className="w-4 h-4" />
							<h1 className="text-sm sm:text-xl md:text-2xl font-semibold w-full">Recently Asked Questions</h1>
						</div>
						<div className="see-more flex justify-center">
							<Link to="/questions" className="w-auto  text-gray-500 hover:text-gray-700">See more</Link>
						</div>
					</div>
					<div className="grid gap-5">
						{!questions.length ?
							<p className="text-center text-sm">No questions at the moment</p>
							:
							questions.slice(0, 10).map((question, idx) => {
								return (
									<div key={idx}>
										<HomeQuestion id={question.id} title={question.title} content={question.content} created_at={question.created_at} updated_at={question.updated_at} answers={question.answers} author_id={question.author_id} />
									</div>
								)
							})
						}
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
			</main >
			<Footer />
		</div>
	);
}
