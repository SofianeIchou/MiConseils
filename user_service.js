const firebase = require("firebase/app");
const fs = require("firebase-admin");
require("firebase/auth");
const fetch = require("node-fetch")
var serviceAccount = require("./serviceAccountKey.json");

const fb = firebase.initializeApp({
            apiKey: "AIzaSyBBp94ce3jBgoiXbZ2YhO4p_V2rnbSl4SE",
            authDomain: "express-server-auth-8cea5.firebaseapp.com",
            projectId: "express-server-auth-8cea5",
            storageBucket: "express-server-auth-8cea5.appspot.com",
            messagingSenderId: "642106404761",
            appId: "1:642106404761:web:630630e6c8fb3550532d08"
});

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
  databaseURL:"https://express-server-auth-8cea5.firebaseio.com/",
 });
 const db = fs.firestore();


exports.addUser = async (email, password) => {
  await fb.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user){
    console.log('uid',user.user.uid)
    return user.user.uid
  //Here if you want you can sign in the user
})
  .catch(function(error) {
    console.log(error)

    //Handle error
  });

}


exports.authenticate = (email, password) =>
  fb.auth()
  .signInWithEmailAndPassword(email, password)
  .then( async (response) => {

  var usersDb = db.collection("users");
  var oui = await usersDb.doc(response.user.uid)
  .get().then(snap => {
    return snap.data()

})
  return oui
  })

exports.logout = () => {
  fb.auth().signOut().then(function(response) {
    console.log(' heeeeeeee hoooooooooo',response)
  }, function(error) {
    console.log(' haaaaaaaaaaaaaa hiiiiiiiiiiiiiii',error)
});
}

exports.listUsers = async () => {
  var usersDb = db.collection("users");
  var test = []
  var oui = await usersDb.get()
  oui.forEach(doc => {
    test.push(doc.data())
  });
return test
}

exports.resetPassword = async (email) => {
  await fb.auth().sendPasswordResetEmail(email).then((response) => {
    console.log('wsh', response)
    console.log('email sent!');
  }).catch(function(error) {
    console.log(error)
    // An error happened.
  });
}

exports.addUsers = async (email, password) => {
  await fb.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user){
    var uid = user.user.uid
    const usersDb = db.collection('users');
  usersDb.doc(uid).set({email:email, password:password, pro:true, admin:false})
  .then(() => {
    console.log("User successfully written!");
})
.catch((error) => {
    console.error("Error writing user: ", error);
});

  //Here if you want you can sign in the user
})
  .catch(function(error) {
    console.log(error)

    //Handle error
  });

}
