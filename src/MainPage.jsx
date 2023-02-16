import React from "react";
import "./tailwind.css";
import { auth } from "./App";
import { Helmet } from "react-helmet";

export default function MainPage() {
	return (
		<div className="text-white">
			<Helmet>
				<title>My Chat App</title>
			</Helmet>
			<div> Home - {auth.currentUser.displayName}</div>
		</div>
	);
}
