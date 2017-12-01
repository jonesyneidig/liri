var request = require("request");
var keys = require('./keys.js');
var Twitter = require('twitter');

var fs = require('fs');

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: '0a1597fac3db4ed990214f0563061d2f',
  secret: 'b73f7134936a4f76927162f6e10726c1'
});

//capture user input, and inform user of what to type in.
console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");


var userCommand = process.argv[2];
var secondCommand = process.argv[3];
//process multiple words. Triggers if user types anything more than the above console logged options and first parameter.
	for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}
function CLI(){
	//action statement, switch statement to declare what action to execute.
	switch(userCommand){

		case 'my-tweets':
		fetchTweets();
		break;

		case 'spotify-this-song':
		spotifyMe();
		break;

		case 'movie-this':
		aMovieForMe();
		break;

		case 'do-what-it-says':
		followTheTextbook();
		break;
		
	}
};

function aMovieForMe(){
	console.log("How about a Flick?");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
		console.log(searchMovie);
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json&apikey=fc3e776d';
	console.log(url);
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};//end aMovieForMe

function fetchTweets(){
	console.log("Tweets headed your way!");
	//new variable for instance of twitter, load keys from imported keys.js

	var client = new Twitter(keys);
 
var params = {screen_name: 'BootcampJoh', count:20};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    			for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
  		}
	});
	
};//end fetchTweets;

function spotifyMe() {

	if (!secondCommand) {
		secondCommand = "The Sign Ace of Base"
	}

	spotify.search({ type: 'track', query: secondCommand }, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	  	}

	  	console.log("");
	  	console.log("Your song information: ")
	  	console.log("-------------------------------------------");
	  	//artist
	  	console.log("*Artist: " + data.tracks.items[0].artists[0].name);
	  	console.log("");

	  	//song name
	  	console.log("*Song Name: " + data.tracks.items[0].name);
	  	console.log("");

	  	//preview link of the song on Spotify
	  	console.log("*Link to Song: " + data.tracks.items[0].preview_url);
	  	console.log("");

	  	//album
	  	console.log("*Album: " + data.tracks.items[0].album.name);
	  	console.log("-------------------------------------------");
	  	console.log("");
	 	
	});
};//end spotifyThis

function followTheTextbook(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run action
		CLI();
		};//end else

    });//end readfile

};//end followTheTextbook

CLI();