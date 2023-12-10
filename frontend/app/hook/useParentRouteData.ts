import { useMatches } from "@remix-run/react";

export const useParentRouteData = <T>(routeId: string): T | undefined => {
	const matches = useMatches();
	const data = matches.find((match) => match.pathname === routeId)?.data;

	return data as T | undefined;
};