var velocity = 1.0;
var gamemode = false;
var brutal = false;
var recording = false;
var padnum = 50;
var original = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png')";
var failedpicture = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/wink-512.png')";
var laughing = new Audio("http://www.eletech.com/Products/Kiddie_Ride_Boards/HAHAHA.WAV");
var no = new Audio("https://www.myinstants.com/media/sounds/nooo.mp3");
var gotitpic1 = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/angry-512.png')"
var gotitpic2 = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/dead-512.png')"
var curlevel;

//stop watch functions
//event.preventdefault
var curtime = 0;
var timeunit = 100; //time unit - decimaly by 2
var timer = null;

function reset_timer(){
    notimer();
    curtime = 0;
    timer = setInterval('increasingsec()', (1000/timeunit));
    // event.preventdefault();
}

function increasingsec(){
    curtime+=1;
    document.getElementById('timer').innerHTML = (curtime / timeunit);
}

function notimer(){
    clearInterval(timer);
    document.getElementById('timer').innerHTML = "0.0";
}

$(document).ready(function(){
    animateDiv();
});

function getlv(){
    
    var sel = document.getElementById('level');
    var opt = sel.value;//options[sel.selectedIndex];
    if(opt == ""){
        laughing.currentTime = 0;
        no.currentTime = 0;
        alert("non-game mode");
        notimer();
        velocity = 1.0;
        padnum = 50;
        gamemode = false;
        brutal = false;
        document.getElementById('a').style.height = "50px";
        document.getElementById('a').style.width = "50px";
    }
    else{
        gamemode = true;
        curlevel = opt;
        $('.a').css('background-image', original);
        switch (opt) {
            case "easy":
                // code
                reset_timer();
                velocity = 0.5;
                document.getElementById('a').style.height = "100px";
                document.getElementById('a').style.width = "100px";
                padnum = 100;
                brutal = false;
                break;
            case "normal":
                reset_timer();
                velocity = 0.75;
                document.getElementById('a').style.height = "80px";
                document.getElementById('a').style.width = "80px";
                padnum = 80;
                brutal = false;
                break;
            case "hard":
                reset_timer();
                velocity = 1.0;
                document.getElementById('a').style.height = "50px";
                document.getElementById('a').style.width = "50px";
                padnum = 50;
                brutal = false;
                break;
            case "brutal":
                reset_timer();
                velocity = 1.25;
                document.getElementById('a').style.height = "40px";
                document.getElementById('a').style.width = "40px";
                padnum=35;
                brutal = true;
                break;
            default:
                // non of them....
        }
        
    }
}

var failedpic;

function missed(){
    if (gamemode == true){
        laughing.pause();
        laughing.currentTime = 0;
        laughing.play();
        $('.a').css('background-image', failedpicture);
        failedpic = setTimeout('back2original()', 500);
    }
    // else {
    //     alert("set the gamemode");
    // }
}

function back2original(){
    $('.a').css('background-image', original);
}

function gotit(){
    var endtime;
    if(gamemode == true){
        if (brutal == true){
            $('.a').css('background-image', gotitpic2);
            laughing.pause();
            laughing.currentTime = 0;
            clearTimeout(failedpic);
            notimer();
            endtime = curtime/timeunit;
            no.play();
            alert("Nooooooo!!!!!!!");
            brutal = false;
        }
        else{
            $('.a').css('background-image', gotitpic1);
            laughing.pause();
            laughing.currentTime = 0;
            notimer();
            endtime = curtime/timeunit;
            alert("Do not think this is the end...");
        }
        // document.getElementById('a').style.visibility = "hidden";
        // records();
        recording = false;
        gamemode = false;
        document.getElementById('level').value = "";
        velocity = 1.0;
        padnum = 50;
        document.getElementById('a').style.height = "50px";
        document.getElementById('a').style.width = "50px";
    }
}

function records(){
    recording = true;
    document.getElementById('form').style.visibility = "visible";
}

$('#submit').click(function(e) {
    var value = $('#name').val();
    var myurl = 'score.json';
    var data = {
        level: curlevel,
        time: curtime/timeunit,
        name: value
    };
    
    var mydata = JSON.stringify(data);

    resetrecordform();
});

function resetrecordform(){//for the case of switching mode without saving name and the time
    recording = false;
    document.getElementById('form').style.visibility = "hidden";
   // $('#name').val("");
}


function makeNewPosition(){
    
    var h = $(".smallgame").height() - padnum;
    var w = $(".smallgame").width() - padnum;
    
    var nh = Math.floor(Math.random() * (h-padnum));// + top;
    var nw = Math.floor(Math.random() * (w-padnum));// + left;
    
    return [nh,nw];    
    
}



function animateDiv(){
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.a').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    var speedModifier = velocity;
    var speed = Math.ceil(greatest/speedModifier);
    return speed;

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

$("#submitButton").click(function(e) {
    var keyword = $("#searchField").val();
    var mySearch = "https://api.themoviedb.org/3/search/movie?api_key=4e2457fc3f449ae1031bf4fe900dbd80&query=" + keyword + "&language=en-US&page=1&include_adult=false";
    console.log(mySearch);
    alert("wait");
    $.ajax({
        url: mySearch,
        dataType: "json",
        success: function(data){
            alert("connected");
            var title = '';
            var overview = '';
            var realeasedate = '';
            var language = '';
            // var runtime = '';
            var defaultposter = 'http://image.tmdb.org/t/p/w185';
            var movieList = "<ul>";
            
            for(var i=0; i < data.results.length; i++){
                var curdata = data.results[i];
                title = curdata.title;
                overview = curdata.overview;
                realeasedate = curdata.release_date;
                language = curdata.original_language;
                // runtime = curdata.
                var poster = defaultposter + curdata.poster_path;
                console.log(poster);
                movieList += "<li><div id='moviecontainer'><div id='picture'><img src='" + poster + "'></div>" +
                "<div id='moviedescription'>"+
                "<text>title: "+ title +"</br></text>" +
                "<text>released: "+ realeasedate +"<br></text>" +
                "<text>language: "+ language +"<br></text>" +
                "<text>overview: "+ overview +"</br></text>" +
                "</div>"+
                "</div>"+
                "</li>";
            }
            movieList += "</ul>";
            console.log(movieList);
            alert("connection ends");
            $("#answers").html(movieList);
            // 
        }
    });
    e.preventDefault();
    document.getElementById('gamingArea').style.visibility = "hidden";
});

