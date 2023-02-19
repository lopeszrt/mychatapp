import React from "react";
import "./tailwind.css";
import { Helmet } from "react-helmet";
import Loader from "./Loader";
import { DATABASE_HANDLERS } from "./handlers/handlers";
import { auth } from "./App";
import placeholder from "./images/placeholder.png";

export default function MainPage() {
	const [user, loading] = DATABASE_HANDLERS.GET_USER(auth.currentUser.uid);
	return (
		<>
			<Helmet>
				<title>My Chat App</title>
			</Helmet>
			<div className="text-white h-screen">
				{loading && <Loader />}
				{user && <UserPage user={user.data()} />}
			</div>
		</>
	);
}

function UserPage({ user }) {
	const creationDate = new Date(
		user.createdAt.seconds * 1000
	).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	let friends = [];
	user.friends.foreach((friendID) => {
		DATABASE_HANDLERS.GET_PUBLIC_USER(friendID).then((res) =>
			friends.push(res)
		);
	});
	let chats = user.chats;
	let blockedUsers = user.blocked;
	let servers = user.servers;
	let requests = user.requests;
	let profilePic = placeholder;
	if (user.profilePicture !== "") profilePic = user.profilePicture;
	return (
		<div>
			<div>mychatapp - {user.name}</div>
			<div className="friendsList">
				{friends.map((friend) => (
					<div></div>
				))}
			</div>
		</div>
	);
}
