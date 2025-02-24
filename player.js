class Player{
  constructor(selector, name, initialPos, lobby){
    this.name = name;
	console.log(this.name)
    this.obj = document.querySelector(selector);
    this.moveStrength = 50;
    this.jumpStrength = 110;
    this.moving = false;
    this.jumping = false;
	this.grounded = false;
    this.restore = false;
	this.initialPos = initialPos;
	this.lobby = lobby;
	
    // this.dx = 0; this.dy = 0; this.dz = 0;
    this.pressed = [];

    this.driver = document.createElement("a-sphere");
    this.driver.setAttribute("color","yellow");
    this.driver.setAttribute("dynamic-body",{mass:5, angularDamping: 0.9});
    this.driver.setAttribute("radius",0.3);
	this.driver.setAttribute("position", initialPos);
	this.driver.setAttribute("sound", {autoplay: true, loop: true, src: this.lobby});
	
    this.driver.object3D.position.x = this.obj.object3D.position.x;
    this.driver.object3D.position.y = this.obj.object3D.position.y;
    this.driver.object3D.position.z = this.obj.object3D.position.z;
    scene.append(this.driver);
	

    window.addEventListener("keyup",(e)=>{
		if(activeCamera == this.name){
			delete this.pressed[e.key];
			  if(e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown" ||
				 e.key == "w" || e.key == "a" || e.key == "s" || e.key == "d"){
				this.moving = false;
			  }
		}
    });
    window.addEventListener("keydown",(e)=>{
		if(activeCamera == this.name){
			this.pressed[e.key] = true; 
		}
      //console.log(this.pressed)
    })
	
	
		this.health = 100;
	}


  
  update(){
	  //console.log(this.driver.object3D.position.y)
	if(this.driver.object3D.position.y <= -75 || this.health <= 0){
		this.restore = true;
		this.resetPosition(this.initialPos);
		this.driver.setAttribute("sound", {loop: true, src: "#lobby"});
		this.health = 100;
	}else{
		this.processImpulses();
		this.obj.object3D.position.x = this.driver.object3D.position.x;
		this.obj.object3D.position.y = this.driver.object3D.position.y + 4;
		this.obj.object3D.position.z = this.driver.object3D.position.z;
		
		
		if(!this.moving){
		  if(Math.abs(this.driver.body.velocity.x) > 0.01 ||  Math.abs(this.driver.body.velocity.z) > 0.01 ){
			this.driver.body.velocity.x = 0;
			this.driver.body.velocity.z = 0;
		  }
		}
	}
	
	

  
  }
  processImpulses(){
    let dx = 0, dy = 0, dz = 0, impulse = null, theta = 0;
//	console.log(this.pressed)
    if(this.pressed[" "] && this.isGrounded()){
      impulse = new CANNON.Vec3(0, this.jumpStrength, 0);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.jumping = true;
	  this.grounded = false;
    }
	// front
    if(this.pressed["w"] && !this.pressed["a"] && !this.pressed["d"]){
	  this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
    }else if(this.pressed["a"] && !this.pressed["w"] && !this.pressed["s"]){
		//left
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI + Math.PI/2;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
    }else if(this.pressed["a"] && this.pressed["s"] ){
		//back left
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y - Math.PI/4;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
	}else if(this.pressed["d"] && !this.pressed["s"] && !this.pressed["w"]){
		//right
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI - Math.PI/2;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
    }else if(this.pressed["s"] && !this.pressed["a"] && !this.pressed["d"]){
		//back
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(-dx, 0, -dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
    }else if(this.pressed["w"] && this.pressed["d"] ){
		//front right
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI - Math.PI/4;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
	}else if(this.pressed["w"] && this.pressed["a"] ){
		//front left
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI + Math.PI/4;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
	}else if(this.pressed["d"] && this.pressed["s"] ){
		//back right
		this.driver.body.velocity.x = 0;
      this.driver.body.velocity.z = 0;
      theta = this.obj.object3D.rotation.y + Math.PI/4;
      dz = this.moveStrength * Math.cos(theta);
      dx = this.moveStrength * Math.sin(theta);
      impulse = new CANNON.Vec3(dx, 0, dz);
      this.driver.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
      this.moving = true;
	}

    if (Math.abs(this.driver.body.velocity.y) < 0.0001) {
      this.jumping = false;
	  //console.log("landed");
    }
	if (Math.abs(this.driver.body.velocity.y) > 0.0001) {
		this.grounded = false;
    }else{
		this.grounded = true;
	}

	//console.log(this.driver.body.velocity.y)
	
  }
  
  resetPosition(position){	  
	if(this.restore){
		console.log("help");
		this.driver.body.velocity.x = 0;
		this.driver.body.velocity.y = 0;
        this.driver.body.velocity.z = 0;
		//this.driver.object3D.position.x = 0;
		//this.driver.object3D.position.y = 3;
		//this.driver.object3D.position.z = 0;
		this.driver.removeAttribute("dynamic-body");
		this.driver.setAttribute("position",position);
		this.driver.setAttribute("dynamic-body",{mass:5});
		this.restore = false;
	}
  }
  
  setPosition(x, y, z){
		this.driver.body.velocity.x = 0;
		this.driver.body.velocity.y = 0;
        this.driver.body.velocity.z = 0;
		this.driver.removeAttribute("dynamic-body");
		this.driver.setAttribute("position",{x:x, y:y, z:z});
		this.driver.setAttribute("dynamic-body",{mass:5});
  }
  
  isGrounded() {
		let raycaster = new THREE.Raycaster();
		let origin = this.driver.object3D.position.clone();
		let direction = new THREE.Vector3(0, -1, 0);
		raycaster.set(origin, direction);

		let intersects = raycaster.intersectObject(scene.object3D, true);

		if (intersects.length > 0) {
			let distance = intersects[0].distance;
			return distance <= 0.35;
		}
		return false;
	}

	


}