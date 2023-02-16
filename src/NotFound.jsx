import React from "react";

export default function NotFound() {
	return (
		<div className="flex justify-center flex-col">
			<div className="mt-10">
				<div className="font-semibold relative text-white text-4xl text-center">
					Hey, you might have run into a dead-end
				</div>
				<div className="relative text-left top-10 left-20 text-white text-2xl ">
					You might be looking for:
					<ul className="text-hyperlink ml-2">
						<li style={{ listStyle: "inside" }}>
							<a href="/">Home</a>
						</li>
						<li style={{ listStyle: "inside" }}>
							<a href="/support">Support</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
