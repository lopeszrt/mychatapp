import React, { useEffect } from "react";
import HANDLERS from "../handlers/handlers";
import createActivityDetector from "activity-detector";

export default function ActivityHandler({ user, options }) {
	console.log(user.uid);
	const [pUser, loading] = HANDLERS.DATABASE.GET_PUBLIC_USER(user.uid);
	return (
		<>{!loading && <ActivityHelper user={pUser.data()} options={options} />}</>
	);
}

function ActivityHelper({ user, options }) {
	let userStatus = user.status.typeOf;
	function useCheckIdle(options, user) {
		useEffect(() => {
			const handleAppClosing = (e) => {
				e.preventDefault();
				HANDLERS.USER.PROFILE.STATUS(
					user.uid,
					"offline",
					userStatus,
					user.status.custom
				);
			};
			const activityDetector = createActivityDetector(options);
			activityDetector.on("idle", () => {
				console.log("idle");
				if (userStatus !== "dnd") {
					HANDLERS.USER.PROFILE.STATUS(
						user.uid,
						"idle",
						userStatus,
						user.status.custom
					);
				}
			});
			activityDetector.on("active", () => {
				console.log("active");
				if (userStatus !== "dnd") {
					HANDLERS.USER.PROFILE.STATUS(
						user.uid,
						"online",
						userStatus,
						user.status.custom
					);
				}
			});
			window.addEventListener("beforeunload", handleAppClosing);

			return () => {
				activityDetector.stop();
				window.removeEventListener("beforeunload", handleAppClosing);
			};
		}, []);
	}

	useCheckIdle(options, user);
	return <></>;
}
