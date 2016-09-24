
// Firebase Configuration
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
var currentPlayerName;

// Clear field of previous choices and text
function emptyField() {
	$(".winner").empty();
	$("#player1_choice").attr("src", "");
	$("#player2_choice").attr("src", "");
};

// Updates (in database) players' wins and losses count based on which player won
function winConditions(winner) {
	
	// Draw
	if(winner == "draw") {
		database.ref("player1").update({
			choice: ""
		});
			
		database.ref("player2").update({
			choice: ""
		})
	}

	// Player1 wins
	else if(winner == "player1") {
		database.ref("player1").update({
			choice: "",
			wins: ++p1_wins
		});
			
		database.ref("player2").update({
			choice: "",
			losses: ++p2_losses
		})
	}

	// Player2 wins
	else {
		database.ref("player2").update({
			choice: "",
			wins: ++p2_wins
		});
			
		database.ref("player1").update({
			choice: "",
			losses: ++p1_losses
		})
	}
}

 $(document).ready(function() {
 	
 	// Initialize chat object for firebase
 	database.ref("chat").set({
 		name: "",
 		message: ""
 	});

 	// Receive a current snapshot of database when any value is changed
	database.ref().on("value", function(snapshot) {
		console.log("Triggered");

		// Display current data of Player1
 		if(snapshot.val().player1 != null) {
 			$(".p1_name").text(snapshot.val().player1.name);
 			$(".player1 .wins").text("Wins: " + p1_wins);
 			$(".player1 .losses").text("Losses: " + p1_losses);
 			player1 = true;
 		}
 		// Emtpy all data for Player1
 		else {
 			emptyField();
 			$(".p1_name").empty();
 			$(".player1 .wins").empty();
 			$(".player1 .losses").empty();
 			player1 = false;

 			$(".player2 .choices").css("visibility", "hidden");
 		}

		// Display current data of Player2
 		if(snapshot.val().player2 != null) {
 			$(".p2_name").text(snapshot.val().player2.name);
 			$(".player2 .wins").text("Wins: " + p2_wins);
 			$(".player2 .losses").text("Losses: " + p2_losses);
 			player2 = true;
 		}

 		// Empty all data for Player2
 		else {
 			emptyField();
 			$(".p2_name").empty();
 			$(".player2 .wins").empty();
 			$(".player2 .losses").empty();
 			player2 = false;

 			$(".player1 .choices").css("visibility", "hidden");
 		}
 		
 		// Show choices when both players are active
 		if(player1 && player2) {
 			$(".instr").empty();
 			$("." + currentPlayer + " .choices").css("visibility", "visible");
 		}
 		else {
 			return;
 		}

		if(snapshot.val().player1.choice || snapshot.val().player2.choice) {
			var p1_choice = snapshot.val().player1.choice;
			var p2_choice = snapshot.val().player2.choice;
			
			p1_wins = snapshot.val().player1.wins;
			p1_losses = snapshot.val().player1.losses;
			p2_wins = snapshot.val().player2.wins;
			p2_losses = snapshot.val().player2.losses;

			// Check win conditions when both players made a choice
			if(p1_choice && p2_choice) {
				$("#player1_choice").attr("src", "assets/images/" + p1_choice.toLowerCase() + ".png");
				$("#player2_choice").attr("src", "assets/images/" + p2_choice.toLowerCase() + ".png");

				$("#" + currentPlayer + "_chosen").css("display", "none");
				$("." + currentPlayer + " .choices").css("display", "initial");

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

				$(".instr").text("Choose to play again");
			}
			
			// Notify if other player has not chosen yet
			else if(p1_choice) {
				$(".instr").text("Waiting for " + snapshot.val().player2.name + " to choose");
			}	
			
			else {
				$(".instr").text("Waiting for " + snapshot.val().player1.name + " to choose");
			}				
		 
		}

 	});
 });

// Assign player when name is entered
// Also checks if player already assigned and 
// if there are already two players
 $(".start").on("click", function() {
 	var username = $(".username").val();
 	$(".username").val("");

 	if(currentPlayer) {
 		$(".instr").text("Please wait for another player to connect");
 		return;
 	}

 	if(username != "") {
 		currentPlayerName = username;

 		if(!player1) {
 			currentPlayer = "player1";
 			player1 = true;

 			$(".instr").text("")
 			$(".p1_name").text(username);
 			database.ref("player1").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: ""
 			});
 			
 	
 		}
 		else if(!player2) {
 			currentPlayer = "player2";
 			player2 = true;

 			$(".p2_name").text(username);
 			database.ref("player2").set({
 					name: username,
 					wins: 0,
 					losses: 0,
 					choice: ""
 			});
 			
 			
 		}

 		// When player disconnects via closing tab or refreshing page,
 		// there spot will be available for another user
 		var disconnectPlayer = database.ref(currentPlayer);
 		disconnectPlayer.onDisconnect().remove();
 	}

 });

// Displays the appropriate image corresponding to the choice made
 $(".choices div").on("click", function() {
 	var chosen = $(this).text();
 	
 	$("." + currentPlayer + " .choices").css("display", "none");
 	$("#" + currentPlayer + "_chosen").attr("src", "assets/images/" + chosen.toLowerCase() + ".png")
 	$("#" + currentPlayer + "_chosen").css("display", "block");

 	emptyField();

 	database.ref(currentPlayer).update({
 		choice: chosen
 	});
 	
 });

// Keeps track of last message sent in database
// Must be assigned to player1 or player2 to send message
 $(".send").on("click", function() {
 	var message = $(".message").val();
 	$(".message").val("");

 	if(message == "" || !currentPlayer) {
 		return;
 	}

 	database.ref("chat").set({
 		name: currentPlayerName,
 		message: message
 	});
 })

// Appends message to chat box
database.ref("chat").on("value", function(snapshot) {
	console.log("chat trigger");
	var name = snapshot.val().name;
	var text = snapshot.val().message;

	if(name == "" || text == "") {
		return;
	}

	var message = $("<p></p>");
	message.text(name + ": " + text);
	$(".log").append(message);
})