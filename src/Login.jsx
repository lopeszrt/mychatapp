import React, { useEffect, useState } from "react";
import "./tailwind.css";
import { redirect } from "react-router-dom";
import KUTE from "kute.js";
import logo_app from "./images/logo_app.png";
import HANDLERS from "./handlers/handlers";
import { auth, firestore } from "./App";
import firebase from "firebase/compat/app";
import uuid from "react-uuid";

export default function Sign({ pwdTestReg }) {
	useEffect(() => {
		const anim = KUTE.fromTo(
			"#blob1",
			{ path: "#blob1" },
			{ path: "#blob2" },
			{ repeat: 999, duration: 4000, yoyo: true }
		);

		anim.start();
	}, []);
	let [error, setErrorState] = useState();
	let [errorMessage, setErrorMessage] = useState("");
	let [info, setInfo] = useState(false);
	return (
		<div className="bg-inherit w-screen h-screen">
			<div className="flex justify-center">
				<img
					className="block relative top-16 md:pt-10 aspect-square z-[2] w-[150px] h-[150px] md:w-[350px] md:h-[350px]"
					src={logo_app}
					alt="MCA logo"
				/>
			</div>
			<SignInPage
				setErrorMessage={setErrorMessage}
				setErrorState={setErrorState}
				pwdTestReg={pwdTestReg}
				info={setInfo}
			/>
			<svg
				className={"w-screen h-screen absolute top-0 z-0 hidden 2xl:block"}
				id="visual"
				viewBox="0 0 900 600"
				width="900"
				height="600"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1">
				<g transform="translate(459.72835525825275 303.6555028448566)">
					<path
						id="blob1"
						d="M135.2 -230.9C183.4 -206.4 236.3 -186.7 272.8 -149C309.2 -111.3 329.1 -55.7 324 -2.9C319 49.8 289 99.7 250.3 133.5C211.7 167.3 164.4 185.2 121.3 203.4C78.1 221.7 39.1 240.3 -11 259.3C-61 278.3 -122 297.6 -160.5 276.7C-199.1 255.8 -215.2 194.7 -246 141.8C-276.8 89 -322.4 44.5 -338 -9C-353.6 -62.5 -339.2 -125 -303.5 -169.5C-267.8 -213.9 -210.9 -240.3 -156.8 -261.4C-102.7 -282.5 -51.3 -298.2 -3.9 -291.5C43.5 -284.7 87 -255.4 135.2 -230.9"
						fill="#4B4B4B"></path>
				</g>
				<g
					transform="translate(454.8406657016137 289.8207886964717)"
					style={{ visibility: "hidden" }}>
					<path
						id="blob2"
						d="M59.3 -67.4C78.4 -54.7 96.3 -37.4 102.8 -15.8C109.4 5.7 104.5 31.6 93.8 58C83.2 84.4 66.7 111.3 43.4 120.2C20.1 129.1 -10.1 120 -29.4 103.2C-48.6 86.4 -56.8 62 -71.9 39.6C-87 17.3 -109 -2.9 -114.2 -28.3C-119.5 -53.7 -107.9 -84.3 -86.1 -96.5C-64.3 -108.6 -32.1 -102.3 -6 -95.2C20.1 -88 40.3 -80 59.3 -67.4"
						fill="#4b4b4b"></path>
				</g>
			</svg>
			<Error
				errorMessage={errorMessage}
				error={error}
				setErrorMessage={setErrorMessage}
				setErrorState={setErrorState}
			/>
			<Info info={info} />
		</div>
	);
}

function SignInPage({ setErrorMessage, setErrorState, pwdTestReg, info }) {
	let [PasswordRecovery, SetPasswordReset] = useState(false);
	let [newAcc, setNewValue] = useState();

	if (PasswordRecovery)
		return (
			<Reset
				info={info}
				pwdRT={SetPasswordReset}
				setErrorMessage={setErrorMessage}
				setErrorState={setErrorState}
			/>
		);

	if (!newAcc)
		return (
			<SignIn
				setErrorMessage={setErrorMessage}
				setErrorState={setErrorState}
				setNewValue={setNewValue}
				pwdRT={SetPasswordReset}
			/>
		);
	else
		return (
			<SignUp
				setErrorMessage={setErrorMessage}
				setErrorState={setErrorState}
				setNewValue={setNewValue}
				pwdTestReg={pwdTestReg}
			/>
		);
}

// #region Login Pages
function SignUp({ setErrorState, setErrorMessage, setNewValue, pwdTestReg }) {
	let [emailVal, setEmailVal] = useState("");
	let [passwordVal, setPasswordVal] = useState("");

	const createAccount = (email, password) => {
		if (email === "" || password === "") {
			setErrorMessage(`Email or Password is empty!`);
			setErrorState(true);
			return;
		}

		if (password.includes(" ")) {
			setErrorMessage(`Password contains a prohibited character!`);
			setErrorState(true);
			return;
		}

		if (!pwdTestReg.test(password)) {
			setErrorMessage(`The password you provided wasn't strong enough.`);
			setErrorState(true);
			return;
		}
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((credential) => {
				let defaultName = email.split("@")[0];
				HANDLERS.USER.PROFILE.DISPLAY_NAME(credential.user, defaultName);
				let user = {
					email: credential.user.email,
					name: credential.user.displayName | "",
					profilePicture: credential.user.photoURL | "",
					friends: [],
					channels: [],
					servers: [],
					blocked: [],
					requests: {
						incoming: [],
						outgoing: [],
					},
				};
				let publicUser = {
					profilePicture: credential.user.photoURL | "",
					name: credential.user.displayName | "",
					description: "",
					status: "online",
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				};
				HANDLERS.DATABASE.CREATE_USER(user, publicUser, credential.user.uid);

				auth.signInWithEmailAndPassword(email, password);
			})
			.catch(function (error) {
				switch (true) {
					case error.code.includes("auth/email-already-in-use"):
						setErrorMessage(
							`${email} already in use, please login into your account, or use a different email`
						);
						break;
					case error.code.includes("auth/invalid-email"):
						setErrorMessage(
							`${email} is not a valid email. Desired format: name@example.com`
						);
						break;
					case error.code.includes("auth/weak-password"):
						setErrorMessage(`The password you provided wasn't strong enough.`);
						break;
					default:
						setErrorMessage(
							`An error happened. Try Again. If the error persists, please contact support with this message: ${error.message}`
						);
				}
				setErrorState(true);
				setEmailVal("");
				setPasswordVal("");
				return;
			});
		setEmailVal("");
		setPasswordVal("");
		redirect("/app");
	};

	return (
		<div className="flex justify-center md:pt-10 pt-20 fixed z-[10]">
			<div className="centerPage w-screen">
				<div className="inputPlaceHolder">
					<input
						className="input"
						type="text"
						value={emailVal}
						onChange={(text) => {
							text.preventDefault();
							setEmailVal(text.target.value);
						}}
						name="email"
						placeholder="name@example.com"
					/>
					<input
						className="input"
						type="password"
						value={passwordVal}
						onChange={(text) => {
							text.preventDefault();
							setPasswordVal(text.target.value);
						}}
						name="password"
						placeholder="•••••••••"
					/>
				</div>
				<div className="SignPageBtnsHolder">
					<button
						className="singPageBtns"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							createAccount(emailVal, passwordVal);
						}}>
						Sign Up
					</button>
					<button
						className="singPageBtns"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							setNewValue(false);
							setErrorState(false);
							setErrorMessage("");
						}}>
						Sign In
					</button>
				</div>
			</div>
		</div>
	);
}

function SignIn({ setErrorMessage, setErrorState, setNewValue, pwdRT }) {
	let [emailVal, setEmailVal] = useState("");
	let [passwordVal, setPasswordVal] = useState("");

	const signedInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	const login = (email, password) => {
		if (email === "" || password === "") {
			setErrorMessage(`Email or Password is empty!`);
			setErrorState(true);
			return;
		}

		auth
			.signInWithEmailAndPassword(email, password)
			.then((credential) => {
				let user = {
					email: credential.user.email,
					name: credential.user.displayName,
					profilePicture: credential.user.photoURL,
					friends: [],
					channels: [],
					servers: [],
					blocked: [],
					requests: {
						incoming: [],
						outgoing: [],
					},
				};
				let publicUser = {
					profilePicture: credential.user.photoURL,
					name: credential.user.displayName,
					description: "",
					status: "online",
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				};

				HANDLERS.DATABASE.CREATE_USER(user, publicUser, credential.user.uid);
			})
			.catch((error) => {
				switch (true) {
					case error.code.includes("auth/invalid-email"):
						setErrorMessage(
							`${email} is not a valid email. Desired format: name@example.com`
						);
						break;
					case error.code.includes("auth/user-disabled"):
						setErrorMessage(
							`The User with the email "${email}" is banned from using My Chat App. To revoke the ban, contact support.`
						);
						break;
					case error.code.includes("auth/user-not-found"):
						setErrorMessage(
							`The user could not be found with the provided email address or wrong password!`
						);
						break;
					case error.code.includes("auth/wrong-password"):
						setErrorMessage(
							`The user could not be found with the provided email address or wrong password!`
						);
						break;
					default:
						break;
				}
				setErrorState(true);
				setEmailVal("");
				setPasswordVal("");
				return;
			});
		setEmailVal("");
		setPasswordVal("");
		redirect("/app");
	};

	return (
		<div className="flex justify-center md:pt-10 pt-20 fixed z-[10]">
			<div className="centerPage w-screen">
				<div className="inputPlaceHolder">
					<div>
						<input
							className="input"
							type="text"
							value={emailVal}
							onChange={(text) => {
								text.preventDefault();
								setEmailVal(text.target.value);
							}}
							name="email"
							placeholder="name@example.com"
						/>
					</div>
					<div>
						<input
							className="input"
							type="password"
							value={passwordVal}
							onChange={(text) => {
								text.preventDefault();
								setPasswordVal(text.target.value);
							}}
							name="password"
							placeholder="•••••••••"
						/>
					</div>
					<div className="text-white text-xs md:text-base pt-4">
						Forgotten Password?
						<div
							onClick={(e) => {
								e.preventDefault();
								pwdRT(true);
							}}
							className="inline ml-1 cursor-pointer text-blue-500">
							Reset Password
						</div>
					</div>
				</div>
				<div className="SignPageBtnsHolder">
					<button
						type="button"
						onClick={signedInWithGoogle}
						className="singPageBtns">
						Sign in with <div className="googleName googleG">G</div>
						<div className="googleName googleO1E">o</div>
						<div className="googleName googleO2">o</div>
						<div className="googleName googleG">g</div>
						<div className="googleName googleL">l</div>
						<div className="googleName googleO1E">e</div>
					</button>
					<button
						className="singPageBtns"
						type="submit"
						onClick={() => {
							login(emailVal, passwordVal);
						}}>
						Sign In
					</button>
					<button
						className="singPageBtns"
						type="submit"
						onClick={() => {
							setNewValue(true);
							setErrorState(false);
							setErrorMessage("");
						}}>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
}

function Reset({ pwdRT, setErrorMessage, setErrorState, info }) {
	const [inputVal, setInputVal] = useState("");
	const passwordRecoverHelper = (email) => {
		if (email === "") {
			setErrorMessage("Email is empty");
			setErrorState(true);
			return;
		}

		auth
			.sendPasswordResetEmail(email)
			.then(() => {
				info(true);
			})
			.catch((err) => {
				setErrorMessage(err.message);
				setErrorState(true);
			});
		setInputVal("");
	};

	return (
		<div className="flex justify-center sm:pt-10 pt-20 fixed z-[10]">
			<div className="centerPage w-screen">
				<div className="inputPlaceHolder">
					<div className="title text-white">Forgot Password</div>
					<div className="message text-white">Enter your email</div>
					<input
						className="input"
						type="text"
						value={inputVal}
						onChange={(text) => setInputVal(text.target.value)}
						name="password"
						placeholder="name@example.com"
					/>
				</div>
				<div className="SignPageBtnsHolder">
					<button
						className="singPageBtns"
						type="submit"
						onClick={() => {
							passwordRecoverHelper(inputVal);
						}}>
						Send Recovery Email
					</button>
					<button
						className="singPageBtns"
						type="submit"
						onClick={() => {
							pwdRT(false);
						}}>
						Go to Sign In
					</button>
				</div>
			</div>
		</div>
	);
}
// #endregion

function Error({ errorMessage, error, setErrorState, setErrorMessage }) {
	setTimeout(() => {
		setErrorState(false);
		setErrorMessage("");
	}, 5000);
	if (error)
		return <div className="error absolute bottom-0">Error: {errorMessage}</div>;
	return null;
}

function Info(props) {
	if (!props.info) return null;
	return <div className="info absolute bottom-0">The Email was sent</div>;
}
