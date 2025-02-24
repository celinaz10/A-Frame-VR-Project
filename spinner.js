class Spinner{
	constructor(spinner, rotationSpeed, axis){
		this.obj = spinner;
		this.r = 0;
		this.dr = rotationSpeed;
		this.axis = axis;
	}
	
	spin() {
		if(this.axis == "x"){
			this.r += this.dr;
			if (this.r >= 360){
				this.r = 0;
			}
			this.obj.setAttribute("rotation", {x:this.r, y:90, z:90});
		}
		
		if(this.axis == "y"){
			this.r += this.dr;
			if (this.r >= 360){
				this.r = 0;
			}
			this.obj.setAttribute("rotation", {x:0, y:this.r, z:0});
		}
	}
}