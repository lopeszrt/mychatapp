import React from "react";
import { Helmet } from "react-helmet";

export default function Home() {
	return (
		<div className="text-black h-screen bg-third">
			<Helmet>
				<title>My Chat App | Home</title>
			</Helmet>
			<NavBar />
			<article>HomePage</article>
		</div>
	);
}

function NavBar() {
	return (
		<nav className="text-second">
			<ul className="nav">
				<li>
					<a href="/">home</a>
				</li>
				<li>
					<a href="/sign-in">Sign In</a>
				</li>
			</ul>
		</nav>
	);
}
