var config = {
    apiKey: "AIzaSyA_RcQi7ra1wRZpnvktALI5Du8psxR-13A",
    authDomain: "rps-multiplayer-395ad.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-395ad.firebaseio.com",
    storageBucket: "rps-multiplayer-395ad.appspot.com",
    messagingSenderId: "253465045343"
 };
  
 firebase.initializeApp(config);

var database = firebase.database();

var player1 = false;
var player2 = false;
	// database.ref().set({
 // 				player1: {
 // 					name: "",
 // 					wins: 0,
 // 					losses: 0,
 // 					choice: ""
 // 				},
 // 				player2: {
 // 					name: "",
 // 					wins: 0,
 // 					losses: 0,
 // 					choice: ""
 // 				},
 // 				chat: {
 // 					recent: ""
 // 				}
 // 			});

 $(document).ready(function() {
 
 	database.ref().on("value", function(snapshot) {
 		if(snapshot.val() == null) {
 			return;
 		}

 		if(snapshot.val().player1 != null) {
 			$(".p1_name").text(snapshot.val().player1.name);
 			$(".player1 .wins").text("Wins: " + snapshot.val().player1.wins);
 			$(".player1 .losses").text("Losses: " + snapshot.val().player1.losses);
 			player1 = true;
 			//sessionStorage.setItem("player", 1);
 		}

 		if(snapshot.val().player2 != null) {
 			$(".p2_name").text(snapshot.val().player2.name);
 			$(".player2 .wins").text("Wins: " + snapshot.val().player2.wins);
 			$(".player2 .losses").text("Losses: " + snapshot.val().player2.losses);
 			player2 = true;
 		}
 	
 	});
 })

 $(".start").on("click", function() {
 	var username = $(".username").val();
 	$(".username").val("");

 	if(username != "") {
 		if(!player1) {
 			$(".p1_name").text(username);
 			database.ref("player1").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: ""	
 			});
 		}
 		else if(!player2) {
 			$(".p2_name").text(username);
 			database.ref("player2").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: ""	
 			});

 		}
 		else {
 			$(".choices").css("display", "block");
 		}
 	}


 })