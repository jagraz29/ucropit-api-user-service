const firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DATABASE}.firebaseio.com`,
  storageBucket: `${process.env.FIREBASE_PROJECT_NAME}.appspot.com`
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Firebase {
  static save(data, collection, child = null) {
    const requestsRef = this.chooseCollection(collection, child);
    return requestsRef.set({ ...data });
  }

  static update(data, child = null) {}

  static delete(collection, id) {
    const requestsRef = this.chooseCollection(collection, id);
    return requestsRef.remove();
  }

  static where(field) {}

  static chooseCollection(type, child = null) {
    if (type == "connect-users") {
      return firebaseApp
        .database()
        .ref(`/${process.env.COLLECTION_USERS_CONNECTED}`)
        .child(child);
    }

    return firebaseApp.database().ref(`${process.env.COLLECTION_DEFAULT}`);
  }
}

module.exports = Firebase;
