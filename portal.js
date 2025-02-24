class Portal{
	constructor(selector, x, y, z){
		this.obj = document.querySelector(selector);
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	teleport(sound){
		let rangecheck = inRange(this.obj, player.driver);
		if(rangecheck){
			player.setPosition(this.x, this.y, this.z);
			player.driver.setAttribute("sound", {loop: true, src: sound});
		}
	}
	
	altTeleport(){
		let rangecheck = inRange(this.obj, player.driver);
		if(rangecheck){
			player.setPosition(this.x, this.y, this.z);
		}
	}
}