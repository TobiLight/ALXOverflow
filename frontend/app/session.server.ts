import { createCookieSessionStorage, redirect } from "@remix-run/node";

// let sessionSecret = process.env.SESSION_SECRET;
// if (!sessionSecret) {
// 	throw new Error("SESSION_SECRET must be set");
// }

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
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
export const createUserSession = async ({ accessToken, userId, redirectTo }: { redirectTo?: string, accessToken: string, userId: string }) => {
	const session = await getSession()

	session.set('user', { userId, accessToken })
	return redirect(redirectTo || '/', {
		headers: {
			"Set-Cookie": await commitSession(session),
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
	return await getSession(request.headers.get("Cookie"));
}

export async function getAccessToken(request: Request) {
	let session = await getUserSession(request);
	if (!session.has("user")) {
		return undefined
	}
	let { accessToken } = session.get("user") as { accessToken: string, };
	if (!accessToken) return undefined
	return accessToken
}


export async function requireUserSession(request: Request): Promise<{ userId: string, accessToken: string } | undefined> {
	let session = await getUserSession(request);
	if (!session.has("user")) {
		return undefined
	}
	let user = session.get("user") as { userId: string, accessToken: string, };
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

export async function getUser(request: Request): Promise<{ email: string, first_name?: string, last_name?: string, username: string, bio: string } | undefined> {
	let userId = await getUserId(request)
	let accessToken = await getAccessToken(request)

	if (!userId)
		return undefined

	let data = await fetch("http://localhost:8000/api/user/profile/", {
		headers: {
			"Authorization": `Bearer ${accessToken}`,
		}
	})

	let user = await data.json()
	if (Object.keys(user).includes('detail'))
		return undefined
	return user
}

export async function getUserId(request: Request): Promise<string | undefined> {
	let session = await getUserSession(request)
	if (!session.has("user"))
		return undefined
	const { userId } = session.get('user') as { userId: string }
	if (!userId.length || userId === undefined) {
		return undefined
	}
	return userId
}
