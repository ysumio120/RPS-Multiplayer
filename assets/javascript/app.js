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
var p1_wins = 0;
var p1_losses = 0;
var p2_wins = 0;
var p2_losses = 0;

var currentPlayer;

// Updates (in database) players' wins and losses count based on which player won
function winConditions(winner) {
	if(winner == "draw") {
		database.ref("player1").update({
			choice: "",
			updated: true
		});
			
		database.ref("player2").update({
			choice: "",
			updated: true
		})
	}

	else if(winner == "player1") {
		database.ref("player1").update({
			choice: "",
			wins: ++p1_wins,
			updated: true
		});
			
		database.ref("player2").update({
			choice: "",
			losses: ++p2_losses,
			updated: true
		})
	}
	else {
		console.log("WHY PLAYER2 WIN?");
		database.ref("player2").update({
			choice: "",
			wins: ++p2_wins,
			updated: true
		});
			
		database.ref("player1").update({
			choice: "",
			losses: ++p1_losses,
			updated: true
		})
	}
	console.log("FINISHED win/loss update");
}

 $(document).ready(function() {
 	
 	// Receive a current snapshot of database when any value is changed
	database.ref().on("value", function(snapshot) {
 		
		// Check if there are any values (players or chat) in the database
 		if(snapshot.val() == null) {
 			return;
 		}		

		if(snapshot.val().player1.choice || snapshot.val().player1.choice) {
			var p1_choice = snapshot.val().player1.choice;
			var p2_choice = snapshot.val().player2.choice;
			
			p1_wins = snapshot.val().player1.wins;
			p1_losses = snapshot.val().player1.losses;
			p2_wins = snapshot.val().player2.wins;
			p2_losses = snapshot.val().player2.losses;

			if(p1_choice && p2_choice) {

				if(p1_choice == p2_choice) {
					$(".winner").text("Draw. Go again.");
					winConditions("draw");
				}

				else if((p1_choice == "Rock" && p2_choice == "Scissors") ||
				   (p1_choice == "Paper" && p2_choice == "Rock") ||
				   (p1_choice == "Scissors" && p2_choice == "Paper")) {
					
					$(".winner").text(snapshot.val().player1.name + " wins!");
					winConditions("player1");

				}
				else {
					$(".winner").text(snapshot.val().player2.name + " wins!");
					winConditions("player2");
				}
			}
			
			else if(p1_choice) {
				$(".instr").text("Waiting for " + snapshot.val().player1.name + " to choose");
			}	
			
			else {
				$(".instr").text("Waiting for " + snapshot.val().player2.name + " to choose");
			}				
		 
		}

 		if(snapshot.val().player1 != null) {

 			$(".p1_name").text(snapshot.val().player1.name);
 			$(".player1 .wins").text("Wins: " + p1_wins);
 			$(".player1 .losses").text("Losses: " + p1_losses);
 			player1 = true;
 			//sessionStorage.setItem("player", 1);
 		}

 		if(snapshot.val().player2 != null) {
 			$(".p2_name").text(snapshot.val().player2.name);
 			$(".player2 .wins").text("Wins: " + p2_wins);
 			$(".player2 .losses").text("Losses: " + p2_losses);
 			player2 = true;
 		}
 		
 		if(player1 && player2) {
 			$("." + currentPlayer + " .choices").css("visibility", "visible");
 		}

 	});
 });

 $(".start").on("click", function() {
 	var username = $(".username").val();
 	$(".username").val("");

 	// if(sessionStorage.getItem("player") != null) {
 	// 	return;
 	// }

 	if(username != "") {
 		if(!player1) {
 			currentPlayer = "player1";
 			player1 = true;
 			$(".instr").text("")
 			$(".p1_name").text(username);
 			database.ref("player1").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: "",
 					updated: false
 			});
 			sessionStorage.setItem("player", 1);
 	
 		}
 		else if(!player2) {
 			currentPlayer = "player2";
 			player2 = true;
 			$(".p2_name").text(username);
 			database.ref("player2").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: "",
 					updated: false
 			});
 			sessionStorage.setItem("player", 2);
 			
 		}
 	}

 });

 $(".choices div").on("click", function() {
 	var choosen = $(this).text();
 	$("#"  + currentPlayer + "_choice").attr("src", "assets/images/" + choosen.toLowerCase() + ".png");
 	
 	database.ref(currentPlayer).update({
 		choice: choosen,
 		updated: false
 	});
 	
 })