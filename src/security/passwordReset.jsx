import React, { useState } from "react";
import HANDLERS from "../handlers/handlers";
import { Navigate } from "react-router-dom";
import logo_app from "../images/logo_app.png";

export default function PasswordReset(props) {
	let query = HANDLERS.PAGE.QUERY();
	let [newPasswordVal, SetPassword] = useState("");
	let [error, setError] = useState(false);
	let [errorMessage, setErrorMessage] = useState("");
	let [info, setInfo] = useState(false);
	let [count, setCount] = useState(0);

	if (count !== 0) {
		console.log(count);
		return <Navigate to="/sign-in" replace />;
	}

	const passwordReset = (newPassword) => {
		if (!props.pwdTestReg.test(newPassword)) {
			setErrorMessage(`The password you provided wasn't strong enough.`);
			setError(true);
			SetPassword("");
			return;
		}

		if (!query.get("oobCode")) {
			return;
		}

		HANDLERS.USER.PASSWORD.RESET(query.get("oobCode"), newPassword)
			.then(() => {
				setInfo(true);
				SetPassword("");
				setTimeout(() => {
					setCount(count + 1);
				}, 2000);
			})
			.catch(() => {
				setError(true);
				setErrorMessage("There was an internal error");
				SetPassword("");
			});
		return;
	};
	return (
		<div className="bg-inherit w-screen h-screen">
			<div className="flex h-screen w-screen centerPage justify-center md:pt-10  fixed z-[10]">
				<div className="centerPage mx-auto">
					<div className="centerPage md:pb-40 md:px-16 md:pt-16 md:bg-fourth md:border-third md:border-2 md:rounded-lg">
						<img
							src={logo_app}
							alt="round img for pfp"
							className="hidden md:block mb-6 w-[200px]"></img>
						<div className="inputPlaceHolder">
							<div className="self-start ml-[1px] -mb-4 text-white">
								New Password
							</div>
							<input
								className="input"
								type="password"
								value={newPasswordVal}
								onChange={(text) => SetPassword(text.target.value)}
								name="password"
								placeholder="•••••••••"
							/>
						</div>
						<div className="SignPageBtnsHolder">
							<button
								className="singPageBtns"
								type="submit"
								onClick={() => {
									passwordReset(newPasswordVal);
								}}>
								Reset Password
							</button>
						</div>
					</div>
				</div>
			</div>
			<Info info={info} setInfo={setInfo} />
			<Error
				setError={setError}
				setErrorMessage={setErrorMessage}
				errorMessage={errorMessage}
				err={error}
			/>
		</div>
	);
}

function Error(props) {
	setTimeout(() => {
		props.setError(false);
		props.setErrorMessage("");
	}, 3500);
	if (!props.err) return null;
	return (
		<div className="error absolute bottom-0">Error: {props.errorMessage}</div>
	);
}

function Info(props) {
	if (!props.info) return null;
	return (
		<div className="info absolute bottom-0">
			Your Password was Reset, you'll be redirected shortly
		</div>
	);
}
