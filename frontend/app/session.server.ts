import { createCookieSessionStorage, redirect } from "@remix-run/node";

// let sessionSecret = process.env.SESSION_SECRET;
// if (!sessionSecret) {
// 	throw new Error("SESSION_SECRET must be set");
// }

const sessionStore = createCookieSessionStorage({
	cookie: {
		name: '__session',
		secrets: ['super-secret-secret'],
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		// maxAge: 60 * 60 * 24 * 30, // 30 days
		maxAge: 60 * 30
	},
});

/**
 * Create a cookie that stores the provided `accessToken`
 * @param accessToken The user's JWT, stored in the user's session
 * @returns Response that sets cookie
 */
export const createUserSession = async ({ accessToken, userId }: { accessToken: string, userId: string }) => {
	const session = await sessionStore.getSession()

	session.set('user', { userId, accessToken })
	return redirect('/', {
		headers: {
			"Set-Cookie": await sessionStore.commitSession(session),
		},
		status: 301
	});
}

/**
 * Gets a session cookie from the passed in request
 * @param request Request object
 * @returns Current session store in the cookie
 */
export async function getUserSession(request: Request) {
	return await sessionStore.getSession(request.headers.get("Cookie"));
}


export async function requireUserSession(request: Request): Promise<{ userId: string, accessToken: string } | undefined> {
	let session = await getUserSession(request);
	if (!session.has("user")) {
		return undefined
	}
	let user = session.get("user") as { userId: string, accessToken: string, };
	console.log(user.accessToken)
	if (!user || (!user.accessToken && !user.userId) || typeof user !== "object") return undefined
	return user;
}

export async function validateUser({ request, redirectTo }: { request: Request, redirectTo?: string }) {
	let loggedInUser = await requireUserSession(request)
	if (!loggedInUser) {
		throw redirect(!redirectTo ? '/login' : `/login?redirectTo=${redirectTo}`)
	}
	return loggedInUser
}

export async function getUserId(request: Request): Promise<string | null> {
	let session = await getUserSession(request)
	const { userId } = session.get('user') as { userId: string, accessToken: string }
	if (!userId.length || userId === undefined) {
		return null
	}
	return userId
}

export const storage = sessionStore