import React, { useEffect, useMemo } from "react";
import HANDLERS from "../handlers/handlers";
import { useState } from "react";

export default function ActivityHandler({ useruid }) {
	const [pUser, loading] = HANDLERS.DATABASE.GET_PUBLIC_USER(useruid);
	return <>{pUser && <ActivityHelper user={pUser.data()} />}</>;
}

function ActivityHelper({ user }) {
	let [isIdle, setIdle] = useState(false);
	function useCheckOnline(user) {
		useEffect(() => {}, []);
		useEffect(() => {
		}, []);
		useEffect(() => {
			const handleAppClosing = (e) => {
				e.preventDefault();
				HANDLERS.USER.PROFILE.STATUS(
					user.uid,
					"offline",
					user.status.typeOf,
					user.status.custom
				);
			};

			window.addEventListener("beforeunload", handleAppClosing);

			return () => {
				window.removeEventListener("beforeunload", handleAppClosing);
			};
		}, [user]);
	}

	useCheckOnline(user);
	return <></>;
}
