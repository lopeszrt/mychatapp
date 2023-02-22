import React from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../App";
export default function Channel() {
	const { channelId } = useParams();

	return <div>Channel: {channelId}</div>;
}
