/**
 * Created by Ellyson on 9/13/2017.
 */
	class MyPlayer {
		constructor() {
			this.playlist=[{src:'src/1.mp3',title:"Running Out of Time",artist:"Sivert Hoyem",image:"img/1.jpg"},
				{src:'src/2.mp3',title:"found out",artist:"noir & richard davis",image:"img/2.jpg"},
				{src:'src/3.mp3',title:"Runnin'(Lose It all)",artist:"Naughty Boy",image:"img/3.jpg"},
				{src:'src/4.mp3',title:"The Little Things Give You Away",artist:"Linkin Park",image:"img/4.jpg"},
				{src:'src/5.mp3',title:"Lost",artist:"Within Temptation",image:"img/5.jpg"},
				{src:'src/6.mp3',title:"Oceans",artist:"Seafret",image:"img/6.jpg"},
				{src:'src/7.mp3',title:"I Found",artist:"Amber Run",image:"img/7.jpg"}
			];
			this.NumberOfSong = 0;
			this.shuffle=false;
			this.loopsTrack=false;
			this.shuffleHistory=[];
			this.playingTrek=false;

			let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			let source, destination;
			this.audio =new Audio();
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.audio.load();
			this.tags();
			this.setVol(.5);
			this.playListRender();
			source = audioCtx.createMediaElementSource(this.audio);
			destination = audioCtx.destination;
			source.connect(destination);

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

			document.querySelector(".timeLine").addEventListener('mouseup', () => {
				this.setTime(document.querySelector(".timeLine").value);
				console.log(document.querySelector(".timeLine").value)
			});

			document.querySelector(".volumeLine").addEventListener('mouseup', () => {
				this.setVol(document.querySelector(".volumeLine").value);
				console.log(document.querySelector(".volumeLine").value)
			});

			this.audio.ontimeupdate = ()=> {
				this.playing();
			}
		}

		playListRender(){
			let player=this;
			this.playlist.forEach((elem, i)=> {
				document.querySelectorAll("ol h4")[i].innerHTML=elem.title;
				document.querySelectorAll("ol h3")[i].innerHTML=elem.artist;
				document.querySelectorAll("ol img")[i].src=elem.image;
			});
			document.querySelectorAll("ol a").forEach((ell, i)=>{
				ell.addEventListener("click",(e)=> {
					e.preventDefault();
					document.querySelector(".player").classList.toggle("playlist");
					player.NumberOfSong=i;
					player.audio.src=player.playlist[player.NumberOfSong].src;
					player.audio.play();
					player.tags();
				})
			})
		}

		play() {
			if( this.playingTrek===true){
				this.playingTrek=false;
				this.audio.pause();
				document.querySelector("#circle").classList.toggle("play");
				document.querySelector("#from_play_to_pause").beginElement();
			}
			else {
				this.playingTrek=true;
				this.audio.play();
				document.querySelector("#circle").classList.toggle("play");
				document.querySelector("#from_pause_to_play").beginElement();
			}
		}

		tags(){
			document.querySelector(".info h1").innerHTML = this.playlist[this.NumberOfSong].artist;
			document.querySelector(".info h2").innerHTML = this.playlist[this.NumberOfSong].title;
			document.querySelector(".art").src=this.playlist[this.NumberOfSong].image;
			document.querySelector(".background img").src=this.playlist[this.NumberOfSong].image;
		}

		timer(time){
				let minutes = Math.floor(time / 60);
				let seconds = Math.floor(time);
				if (isNaN(seconds) || isNaN(minutes)) {
					return "0:00";
				}
				else {
					seconds = (seconds - (minutes * 60)) < 10 ? ('0' + (seconds - (minutes * 60))) : (seconds - (minutes * 60));
					time = minutes + ':' + seconds;
					return time;
				}
		}

		playing(){
			let duration = this.audio.duration;
			let Current = this.audio.currentTime;
			let Margin = Current / duration;
			document.querySelector(".bar hr").style.transform = "translateX(-"+(100-Margin*100)+"%)";
			if (Margin === 1) {
				let songNumber=this.NumberOfSong;
				if (this.shuffle === true) {
					this.NumberOfSong = Math.floor(Math.random() * (this.playlist.length - 1));
				}
				else if (this.NumberOfSong < this.playlist.length - 1) {
					this.NumberOfSong++;
				}
				else{
					this.NumberOfSong=0;
				}
				if(this.loopsTrack===true){
					this.NumberOfSong=songNumber;
				}
				this.audio.src = this.playlist[this.NumberOfSong].src;
				this.audio.play();
				this.tags();
			}
			document.querySelectorAll("time span")[0].innerHTML = this.timer(Current);
			document.querySelectorAll("time span")[1].innerHTML = this.timer(duration);
		}

		forward(){
			if (this.shuffle === true) {
				this.NumberOfSong = Math.floor(Math.random() * (this.playlist.length - 1));
				this.shuffleHistory.push(this.NumberOfSong);
			}
			else if (this.NumberOfSong < this.playlist.length - 1) {
				this.NumberOfSong++;
			}
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.audio.load();
			this.audio.play();
			this.tags();
		}

		rewind(){
			if (this.shuffle === true)  { //for shuffle
				this.shuffleHistory.splice(this.shuffleHistory.length - 1, 1);
				if (this.shuffleHistory.length !== 0) {
					this.NumberOfSong = this.shuffleHistory[this.shuffleHistory.length - 1];
				}
				else if( this.shuffleHistory.length===0){
					return;
				}
			}
			else if (this.NumberOfSong > 0) {
				this.NumberOfSong--;
			}
			this.audio.src = this.playlist[this.NumberOfSong].src;
			this.audio.load();
			this.audio.play();
			this.tags();
		}

		shuffleToggle(){
			if (this.shuffle === false) {
				document.querySelector(".shuffle").classList.toggle("active");
				this.shuffleHistory = [];
				this.shuffle = true;
			}
			else if (this.shuffle === true) {
				this.shuffle = false;
				document.querySelector(".shuffle").classList.toggle("active");
			}
		}
		loopToggle(){
			if (this.loopsTrack === false) {
				document.querySelector(".loop").classList.toggle("active");
				this.loopsTrack = true;
			}
			else if (this.loopsTrack === true) {
				this.loopsTrack = false;
				document.querySelector(".loop").classList.toggle("active");
			}
		}
		setTime(value){
				this.audio.currentTime = this.audio.duration*value;
		};
		setVol(value)  {
			this.audio.volume = value;
			document.querySelector(".volume hr").style.transform = "translateX(-"+(100-value*100)+"%)";
		}
	}

	let player = new MyPlayer();