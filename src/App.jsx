import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import MyRoutes from "./my-routes";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const app = firebase.initializeApp({
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

export { app };
export const auth = firebase.auth(app);
export const firestore = firebase.firestore();
const STRONG_PASSWORD = new RegExp(process.env.REACT_APP_PASSWORD_REQS);

function App() {
	const [user] = useAuthState(auth);
	return (
		<div className="bg-main w-screen h-screen font-roboto overflow-hidden">
			<MyRoutes
				auth={auth}
				firebase={firebase}
				collections={useCollectionData}
				isAuthenticated={user}
				strPwdTest={STRONG_PASSWORD}
			/>
		</div>
	);
}

export default App;
