let rnd = (l,u) => Math.random()*(u-l) + l;
let scene, camera, activeCamera, activeVoided, world;
let health, canTakeDamage;
let killBricks = [], spinnerx = [], spinnery = [], spinnerObj = [], goals = [];
let portal1, portal2,  portal3;

window.onload = function(){
	scene = document.querySelector("a-scene");
	player = new Player("#spawn","player","7.347, 29, 32.954", "#lobby");
	goals = document.querySelectorAll(".goal");
	activeCamera = "player";
	killBricks = document.querySelectorAll(".killBrick");
	spinnerx = document.querySelectorAll(".spinnerx");
	spinnery = document.querySelectorAll(".spinnery");
	portal1 = new Portal("#toas", -49.943, 80, -200.457);
	portal2 = new Portal("#tods", 203.932, 133, -9.518);
	portal3 = new Portal("#toti", -168.5, 2, 165.526);
	
	for(let spinner of spinnerx){
		spinner = new Spinner(spinner, -0.5, "x");
		spinnerObj.push(spinner);
	}
	
	for(let spinner of spinnery){
		spinner = new Spinner(spinner, -0.5, "y");
		spinnerObj.push(spinner);
	}
	
	console.log(killBricks);
	console.log(goals);
	canTakeDamage = true;
	
	health = document.getElementById("health");
	healCycle();

	setTimeout(loop,100);
}

function loop(){
	player.update();
	health.innerHTML = `Health: ${player.health}`;
	for(let spinner of spinnerObj){
		spinner.spin();
	}
	
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
			player.setPosition(7.347, 29, 32.954);
			player.driver.setAttribute("sound", {loop: true, src: "#lobby"});
			document.getElementById('win').play();
		}
	}
	
	portal1.teleport("#toasSong");
	portal2.teleport("#todsSong");
	portal3.teleport("#totiSong");
	
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