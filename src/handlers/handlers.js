import {
	updateProfile,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
	confirmPasswordReset,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { auth } from "../App";

function CHANGE_DISPLAY_NAME(user, newName) {
	return updateProfile(user, { displayName: newName, photoURL: user.photoURL });
}

function CHANGE_DISPLAY_IMAGE(user, newImageURL) {
	return updateProfile(user, {
		displayName: user.displayName,
		photoURL: newImageURL,
	});
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
};

export default HANDLERS;
