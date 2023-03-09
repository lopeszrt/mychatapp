import HANDLERS from "./handlers";
import { firestore } from "../App";


class UserDatabase{ 
	constructor() { if(!UserDatabase._instance){
			UserDatabase._instance = this;
		}

		return UserDatabase._instance;
	}

	static getInstance() {
		return UserDatabase._instance;
	}

	connectToDatabase() {
		if(UserDatabase._connection){
			return UserDatabase._connection;
		}

		this.database = firestore
			.collection('user');
		UserDatabase.connection = {
			db: this.database.id,
		}
		return UserDatabase._connection;
	}
}
