import React from "react";
import "./tailwind.css";
import { Helmet } from "react-helmet";
import Loader from "./Loader";
import { DATABASE_HANDLERS } from "./handlers/handlers";
import { auth } from "./App";

export default function MainPage() {
	const [user, loading] = DATABASE_HANDLERS.GET_USER(
		"user",
		auth.currentUser.uid
	);

	return (
		<div className="text-white">
			<Helmet>
				<title>My Chat App</title>
			</Helmet>
			<div>
				{loading && <Loader />}
				{user && <>User: {user.data().email}</>}
			</div>
		</div>
	);
}
