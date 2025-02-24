let rnd = (l,u) => Math.random()*(u-l) + l;
let scene, camera, activeCamera, activeVoided, world;
let health, canTakeDamage;
let killBricks = [], goals = [];
let portal1, portal2;
let shover1, shover2, shover3, shover4, shover5;
let tele1, tele2, tele3, tele4, tele5, tele6;

window.onload = function(){
	scene = document.querySelector("a-scene");
	player = new Player("#spawn","player","18.582, 4.5, 84.266", "#lobby2");
	goals = document.querySelectorAll(".goal");
	activeCamera = "player";
	killBricks = document.querySelectorAll(".killBrick");
	portal1 = new Portal("#tocwd", -105.746, 4.5, -77.276);
	portal2 = new Portal("#toccc", -165.196, 4.5, 191.196);
	
	shover1 = new Shover("#shover1", -0.1, 0, 0, 500, 11);
	shover2 = new Shover("#shover2", 0.1, 0, 0, 500, 9);
	shover3 = new Shover("#shover3", -0.1, 0, 0, 500, 4);
	shover4 = new Shover("#shover4", 0.1, 0, 0, 500, 4);
	shover5 = new Shover("#shover5", 0, 0, -0.1, 500, 50);
	
	tele1 = new Portal("#tele1", -175.222, 4.5, 195.83);
	tele2 = new Portal("#tele2", -180.222, 4.5, 187.17);
	tele3 = new Portal("#tele3", -171.562, 4.5, 182.17);
	tele4 = new Portal("#tele4", -22.601, 58.5, 170.252);
	tele5 = new Portal("#tele5", -172.873, 84.5, 277.715);
	tele6 = new Portal("#tele6", -46.029, 161.5, 194.831);
	
	console.log(goals);
	canTakeDamage = true;
	
	health = document.getElementById("health");
	healCycle();

	setTimeout(loop,100);
}

function loop(){
	player.update();
	health.innerHTML = `Health: ${player.health}`;
	
	for(let brick of killBricks){
		let rangecheck = inRange(brick, player.driver);
		if(rangecheck){
			if (canTakeDamage) {
				canTakeDamage = false;
				damage();
				setTimeout(() => {
					canTakeDamage = true;
				}, 750);
			}
		}
	}
	
	for(let goal of goals){
		let rangecheck = inRange(goal, player.driver);
		if(rangecheck){
			player.setPosition(18.582, 4.5, 84.266);
			player.driver.setAttribute("sound", {loop: true, src: "#lobby"});
			document.getElementById('win').play();
		}
	}
	
	portal1.teleport("#tocwdSong");
	portal2.teleport("#tocccSong");
	
	shover1.shove();
	shover2.shove();
	shover3.shove();
	shover4.shove();
	shover5.shove();
	
	tele1.altTeleport();
	tele2.altTeleport();
	tele3.altTeleport();
	tele4.altTeleport();
	tele5.altTeleport();
	tele6.altTeleport();
	
  	window.requestAnimationFrame(loop);
}

function distance(obj1, obj2){
	let x1 = obj1.object3D.position.x;
	let y1 = obj1.object3D.position.y;
	let z1 = obj1.object3D.position.z;
	let x2 = obj2.object3D.position.x;
	let y2 = obj2.object3D.position.y;
	let z2 = obj2.object3D.position.z;

	let d = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) + Math.pow(z1-z2,2));
	return d;
}

function inRange(obj, player) {
	let geometry = obj.getAttribute("geometry") || {};
  
	let baseWidth  = parseFloat(geometry.width)  || 1;
	let baseHeight = parseFloat(geometry.height) || 1;
	let baseDepth  = parseFloat(geometry.depth)  || 1;
  
	let scale = obj.object3D.scale;
  
	let actualWidth  = baseWidth  * scale.x;
	let actualHeight = baseHeight * scale.y;
	let actualDepth  = baseDepth  * scale.z;
  	let playersize = parseFloat(player.getAttribute("radius"));
  
	let damageRangeX = actualWidth / 2 + playersize;
	let damageRangeY = actualHeight / 2 + playersize;
	let damageRangeZ = actualDepth / 2 + playersize;
  

	let dx = Math.abs(obj.object3D.position.x - player.object3D.position.x);
	let dy = Math.abs(obj.object3D.position.y - player.object3D.position.y);
	let dz = Math.abs(obj.object3D.position.z - player.object3D.position.z);
  
	return (dx <= damageRangeX) && (dy <= damageRangeY) && (dz <= damageRangeZ);
}



function damage(){
	player.health -= 5;
}

function heal(){
	if(player.health < 100){
		player.health += 1;
	}
}

function healCycle(){
	let takingDamage = false;
	for (let brick of killBricks) {
		if (inRange(brick, player.driver)) {
			takingDamage = true;
			break;
		}
	}
	if (!takingDamage) {
		heal();
	}
	setTimeout(healCycle, 1000);
}