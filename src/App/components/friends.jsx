import React from "react";
import placeholder from "../../images/placeholder.png";

export default function FriendsList({ friends }) {
	const statusColor = (onlineStatus) => {
		let statusClass = "hidden";
		switch (onlineStatus) {
			case "online":
				statusClass = "text-green-500";
				break;
			case "idle":
				statusClass = "text-yellow-400";
				break;
			case "dnd":
				statusClass = "text-red-500";
				break;
			case "offline":
				statusClass = "hidden";
				break;
			default:
				return console.error("ERROR WHEN PARSING COLOR OPTIONS");
		}

		return statusClass;
	};
	return (
		<div className="friendsList">
			<ul>
				{friends.map((friend, index) => (
					<li
						key={index}
						className="flex cursor-pointer select-none border border-transparent rounded-sm text-sm md:text-base active:bg-gray-400 hover:bg-gray-600 w-fit px-3 py-2"
						onClick={(e) => {
							e.preventDefault();
						}}>
						<div className="flex self-center md:h-12 md:w-12 w-8 h-8 border rounded-full mr-2 overflow-hidden">
							<img
								className="md:w-[48px] md:h-[48px] w-[32px] h-[32px] self-center justify-self-center block object-cover pointer-events-none"
								src={placeholder}
								alt="friendpfp"
							/>
						</div>
						<div className="self-center flex flex-col">
							<div>{friend.name}</div>
							<div className={statusColor(friend.status.typeOf)}>
								{friend.status.typeOf}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
