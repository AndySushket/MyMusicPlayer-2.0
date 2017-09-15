/**
 * Created by Ellyson on 9/13/2017.
 */
	class MyPlayer {
		constructor () {
			this.playlist = [
				{src:'src/1.mp3', title:"Running Out of Time", artist:"Sivert Hoyem", image:"img/1.jpg"},
				{src:'src/2.mp3', title:"found out", artist:"noir & richard davis", image:"img/2.jpg"},
				{src:'src/3.mp3', title:"Runnin'(Lose It all)", artist:"Naughty Boy", image:"img/3.jpg"},
				{src:'src/4.mp3', title:"The Little Things Give You Away", artist:"Linkin Park", image:"img/4.jpg"},
				{src:'src/5.mp3', title:"Lost", artist:"Within Temptation", image:"img/5.jpg"},
				{src:'src/6.mp3', title:"Oceans", artist:"Seafret", image:"img/6.jpg"},
				{src:'src/7.mp3', title:"I Found", artist:"Amber Run", image:"img/7.jpg"}
			];
			this.NumberOfSong = 0;
			this.shuffle = false;
			this.loopsTrack = false;
			this.shuffleHistory = [];
			this.playingTrek = false;

			// Adding audio object
			let audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
			let source, destination;
			this.audio = new Audio();
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.audio.load();
			this.tags();
			this.setVol(.5);
			this.playListRender();
			this.currentSong ( this.NumberOfSong );
			this.animatedIntro();
			source = audioCtx.createMediaElementSource(this.audio);
			destination = audioCtx.destination;
			source.connect(destination);

			//events on buttons
			document.querySelector('.play').onclick = () => {
				this.play();
			};
			document.querySelector('.forward').onclick = () => {
				this.forward();
			};
			document.querySelector('.rewind').onclick = () => {
				this.rewind();
			};
			document.querySelector(".shuffle").onclick = () => {
				this.shuffleToggle();
			};
			document.querySelector(".loop").onclick = () => {
				this.loopToggle();
			};

			//events for range inputs
			document.querySelector(".timeLine").addEventListener('mouseup', () => {
				this.setTime(document.querySelector(".timeLine").value);
			});
			document.querySelector(".volumeLine").addEventListener('mouseup', () => {
				this.setVol(document.querySelector(".volumeLine").value);
			});

			//update current time of song
			this.audio.ontimeupdate = () => {
				this.playing();
			}
		}

		animatedIntro(){ //animation at start
			document.querySelector('main').classList.add("pre-enter");
			document.querySelector('main').classList.remove("with-hover");
			setTimeout( () => {
				document.querySelector('main').classList.add("on-enter");
				document.querySelector('.flip').onclick =()=>{
					document.querySelector(".player").classList.toggle("playlist");
				};
				document.querySelector('.back a').onclick =()=>{
					document.querySelector(".player").classList.toggle("playlist");
				};
			}, 500);

		}

		playListRender(){ //creating playlist
			let back = document.querySelector(".back");

			this.playlist.forEach( ( elem, i ) => {
				let li = document.createElement("li");
				let a = document.createElement("a");
				let h3 = document.createElement("h3");
				let h4 = document.createElement("h4");
				let img = document.createElement("img");
				let div = document.createElement("div");
				let ol = document.createElement("ol");
				h4.innerHTML = elem.title;
				h3.innerHTML = elem.artist;
				img.src = elem.image;
				a.addEventListener("click", ( e ) => {
					e.preventDefault();
					document.querySelector(".player").classList.toggle("playlist");
					this.NumberOfSong = i;
					this.audio.src = this.playlist[this.NumberOfSong].src;
					if( this.loopsTrack === true ){
						this.loopToggle();
					}
					if( this.shuffle === true ){
						this.shuffleToggle();
					}
					if( this.playingTrek === false ){
						this.play();
					}
					else this.audio.play();
					this.currentSong ( this.NumberOfSong );
					this.tags();
				});
				div.appendChild( h3 );
				div.appendChild( h4 );
				a.appendChild( img );
				a.appendChild( div );
				li.appendChild( a );
				ol.appendChild( li );
				back.appendChild( ol );
			});
		}

		play() { // play/pause
			if( this.playingTrek === true ){
				this.playingTrek = false;
				this.audio.pause();
				document.querySelector("#circle").classList.toggle("play");
				document.querySelector("#from_play_to_pause").beginElement();
			}
			else {
				this.playingTrek = true;
				this.audio.play();
				document.querySelector("#circle").classList.toggle("play");
				document.querySelector("#from_pause_to_play").beginElement();
			}
		}

		tags(){	//set info at front
			document.querySelector(".info h1").innerHTML = this.playlist[this.NumberOfSong].artist;
			document.querySelector(".info h2").innerHTML = this.playlist[this.NumberOfSong].title;
			document.querySelector(".art").src = this.playlist[this.NumberOfSong].image;
			document.querySelector(".background img").src = this.playlist[this.NumberOfSong].image;
		}

		timer( time ){ //method for getting time
				let minutes = Math.floor( time / 60 );
				let seconds = Math.floor( time );
				if ( isNaN( seconds ) || isNaN( minutes ) ) {
					return "0:00";
				}
				else {
					seconds = ( seconds - ( minutes * 60 )) < 10 ? ('0' + ( seconds - ( minutes * 60 ))) : ( seconds - (minutes * 60 ));
					time = minutes + ':' + seconds;
					return time;
				}
		}

		playing(){ //method for updayting status of played song
			let duration = this.audio.duration;
			let Current = this.audio.currentTime;
			let Margin = Current / duration;
			document.querySelector(".bar hr").style.transform = "translateX(-" + ( 100 - Margin * 100 ) + "%)";
			if ( Margin === 1 ) {
				let songNumber = this.NumberOfSong;
				if ( this.shuffle === true ) {
					this.NumberOfSong = Math.floor( Math.random() * ( this.playlist.length - 1 ) );
				}
				else if ( this.NumberOfSong < this.playlist.length - 1 ) {
					this.NumberOfSong++;
				}
				else{
					this.NumberOfSong = 0;
				}
				if( this.loopsTrack === true ){
					this.NumberOfSong = songNumber;
				}
				this.audio.src = this.playlist[this.NumberOfSong].src;
				this.currentSong ( this.NumberOfSong );
				this.audio.play();
				this.tags();
			}
			document.querySelectorAll("time span")[0].innerHTML = this.timer( Current );
			document.querySelectorAll("time span")[1].innerHTML = this.timer( duration );
		}

		currentSong ( song ) {
			if(document.querySelector(".playing")){
				document.querySelector(".playing").classList.toggle("playing");
			}
			document.querySelectorAll("ol a")[song].classList.toggle("playing");
		};

		forward(){ //next song
			if ( this.shuffle === true ) {
				this.NumberOfSong = Math.floor( Math.random() * ( this.playlist.length - 1 ) );
				this.shuffleHistory.push( this.NumberOfSong ) ;
			}
			else if ( this.NumberOfSong < this.playlist.length - 1 ) {
				this.NumberOfSong++;
			}
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.currentSong ( this.NumberOfSong );
			this.audio.load();
			this.audio.play();
			this.tags();
		}

		rewind(){ //rewind song
			if ( this.shuffle === true )  { //for shuffle
				this.shuffleHistory.splice( this.shuffleHistory.length - 1, 1 );
				if ( this.shuffleHistory.length !== 0 ) {
					this.NumberOfSong = this.shuffleHistory[this.shuffleHistory.length - 1];
				}
				else if ( this.shuffleHistory.length === 0 ){
					return;
				}
			}
			else if ( this.NumberOfSong > 0 ) {
				this.NumberOfSong--;
			}
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.currentSong ( this.NumberOfSong );
			this.audio.load();
			this.audio.play();
			this.tags();
		}

		shuffleToggle(){ // shuffle toggle
			if ( this.shuffle === false ) {
				document.querySelector(".shuffle").classList.toggle("active");
				this.shuffleHistory = [];
				this.shuffle = true;
			}
			else if ( this.shuffle === true ) {
				this.shuffle = false;
				document.querySelector(".shuffle").classList.toggle("active");
			}
		}

		loopToggle(){	// loop toggle
			if ( this.loopsTrack === false ) {
				document.querySelector(".loop").classList.toggle("active");
				this.loopsTrack = true;
			}
			else if ( this.loopsTrack === true ) {
				this.loopsTrack = false;
				document.querySelector(".loop").classList.toggle("active");
			}
		}

		setTime(value){ // the chosen user time
				this.audio.currentTime = this.audio.duration*value;
		};

		setVol(value)  {	// the chosen user volume
			this.audio.volume = value;
			document.querySelector(".volume hr").style.transform = "translateX(-"+(100-value*100)+"%)";
		}
	}

	// init player
	let player = new MyPlayer();