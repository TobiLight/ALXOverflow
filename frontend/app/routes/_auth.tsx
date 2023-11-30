import { Outlet } from '@remix-run/react'
import Header from '~/components/Shared/Header'

function AuthLayout() {
	return (
		<main>
			<Header />
			<Outlet />
			<footer className="absolute bottom-0 w-full text-center flex items-center justify-center py-2 border-t text-sm">
				<p>Made with love by <span className="font-semibold">0xTobii</span></p>
			</footer>
		</main>
	)
}

export default AuthLayout