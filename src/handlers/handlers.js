import {
	updateProfile,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
	confirmPasswordReset,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { auth, firestore } from "../App";
import { useDocument } from "react-firebase-hooks/firestore";

async function CHANGE_DISPLAY_NAME(user, newName, signup) {
	if (signup)
		return updateProfile(user, {
			displayName: newName,
			photoURL: user.photoURL,
		});
	const privUser = firestore.collection("user").doc(user.uid);
	const publicUser = firestore.collection("publicUser").doc(user.uid);

	privUser.update({ name: newName });
	publicUser.update({ name: newName });
	updateProfile(user, {
		displayName: newName,
		photoURL: user.photoURL,
	});
}

function CHANGE_DISPLAY_IMAGE(user, newImageURL) {
	return updateProfile(user, {
		displayName: user.displayName,
		photoURL: newImageURL,
	});
}

function GET_USER_DATA(userUID) {
	const userRef = firestore.collection("user").doc(userUID);
	return useDocument(userRef);
}

function GET_PUBLIC_USER(userID) {
	return firestore
		.collection("publicUser")
		.doc(userID)
		.get()
		.then((val) => {
			return val.data();
		});
}

function CREATE_USER_INFO(user, publicUser, uid) {
	firestore
		.collection("user")
		.doc(uid)
		.set(user)
		.then(() => firestore.collection("publicUser").doc(uid).set(publicUser));
}

function CHANGE_DESCRIPTION() {
	return 0;
}

function REAUTHENTICATE_USER(user, oldPassword) {
	const newCredential = EmailAuthProvider.credential(user.email, oldPassword);
	return reauthenticateWithCredential(user, newCredential);
}

function CHANGE_PASSWORD(user, newPassword) {
	return updatePassword(user, newPassword);
}

function PASSWORD_RESET_HANDLER(oobcode, newPassword) {
	return confirmPasswordReset(auth, oobcode, newPassword);
}

function QUERY_PARAMS() {
	const location = useLocation();
	return new URLSearchParams(location.search);
}

export const AUTHENTICATION_HANDLERS = {
	REAUTHENTICATE: REAUTHENTICATE_USER,
};

export const PROFILE_HANDLERS = {
	DISPLAY_NAME: CHANGE_DISPLAY_NAME,
	DISPLAY_IMAGE: CHANGE_DISPLAY_IMAGE,
	DESCRIPTION: CHANGE_DESCRIPTION,
};

export const PASSWORD_HANDLERS = {
	UPDATE: CHANGE_PASSWORD,
	RESET: PASSWORD_RESET_HANDLER,
};

export const DATABASE_HANDLERS = {
	GET_USER: GET_USER_DATA,
	GET_PUBLIC_USER: GET_PUBLIC_USER,
	CREATE_USER: CREATE_USER_INFO,
};

export const USER_HANDLERS = {
	PASSWORD: PASSWORD_HANDLERS,
	PROFILE: PROFILE_HANDLERS,
	AUTH: AUTHENTICATION_HANDLERS,
};

export const PAGE_HANDLERS = {
	QUERY: QUERY_PARAMS,
};

const HANDLERS = {
	USER: USER_HANDLERS,
	PAGE: PAGE_HANDLERS,
	DATABASE: DATABASE_HANDLERS,
};

export default HANDLERS;
