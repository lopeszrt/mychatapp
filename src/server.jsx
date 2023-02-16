import React from "react";
import { useParams } from "react-router-dom";

export default function Server() {
	const serverId = useParams();
	return <div> Server: {serverId.serverId}</div>;
}
