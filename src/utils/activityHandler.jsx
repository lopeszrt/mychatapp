import React, { useEffect } from "react";
import HANDLERS from "../handlers/handlers";
import { useState } from "react";

export default function ActivityHandler({ useruid }) {
	const [pUser, loading] = HANDLERS.DATABASE.GET_PUBLIC_USER(useruid);
	return <>{pUser && <ActivityHelper user={pUser.data()} />}</>;
}

function ActivityHelper({ user }) {
	let [lastState, setLastState] = useState("");
	function onIdle() {
		if ("idle" !== lastState) {
			console.log("idle");
			toggleIdle("idle", setLastState);
			return;
		}

		return console.log("already in this state");
	}

	function onActive() {
		if ("online" !== lastState) {
			console.log("active");
			toggleIdle("online", setLastState);
			return;
		}

		return console.log("already in this state");
	}

	function toggleIdle(status, setStatus) {
		if (user.status.typeOf === "dnd") return;
		setStatus(status);
		/* HANDLERS.USER.PROFILE.STATUS(
			user.uid,
			status,
			user.status.typeOf,
			user.status.custom
		) */
	}
	function useCheckOnline(user) {
		const ttl = new Date.now();
		useEffect(() => {}, []);
		useEffect(() => {}, []);
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
		}, []);
	}

	useCheckOnline(user);
	return <></>;
}
