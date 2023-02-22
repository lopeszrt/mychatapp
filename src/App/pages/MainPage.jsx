import React from "react";
import "../../Assets/tailwind.css";
import { Helmet } from "react-helmet";
import Loader from "../../utils/Loader";
import { DATABASE_HANDLERS } from "../../handlers/handlers";
import { auth } from "../../App";
import FriendsList from "../components/friends";
import placeholder from "../../images/placeholder.png";
import { Navigate, redirect } from "react-router-dom";

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
	user.friends.map((friendID) => {
		const [user, loading, err] = DATABASE_HANDLERS.GET_PUBLIC_USER(friendID);
		if (!loading) {
			if (!err) return friends.push(user.data());
			return err;
		}
	});
	let blockedUsers = [...user.blocked];
	let groups = [...user.servers];
	let requests = user.requests;
	let profilePic = placeholder;
	if (user.profilePicture !== "") profilePic = user.profilePicture;
	return (
		<div className="h-screen">
			{friends.length !== 0 && <FriendsList friends={friends} />}
		</div>
	);
}
