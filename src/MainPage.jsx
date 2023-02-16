import React from "react";
import "./tailwind.css";
import { auth, firestore } from "./App";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { DATABASE_HANDLERS } from "./handlers/handlers";
import { useEffect } from "react";

export default function MainPage() {
	let [user, setUser] = useState();
	useEffect(() => {
		DATABASE_HANDLERS.GET_USER("user", auth.currentUser.uid).then((data) => {
			setUser(data);
		});
	}, []);
	console.log(user);
	return (
		<div className="text-white">
			<Helmet>
				<title>My Chat App</title>
			</Helmet>
			<div> Home - {auth.currentUser.displayName}</div>
		</div>
	);
}
