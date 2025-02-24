class Shover{
    constructor(selector, dx, dy, dz, waitTime, gapLength) {
        this.obj = document.querySelector(selector);
        this.gapLength = gapLength;
        this.x = this.obj.object3D.position.x;
        this.y = this.obj.object3D.position.y;
        this.z = this.obj.object3D.position.z;
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
        this.accumulator = 0;
        this.isWaiting = false;
		this.waitTime = waitTime;
    }

    shove() {
        if (this.isWaiting) {
            return;
        }

        // Move the shover
        this.accumulator += Math.abs(Math.sqrt(Math.pow(this.dx,2) + Math.pow(this.dy,2) + Math.pow(this.dz,2)));
        this.obj.object3D.position.x += this.dx;
        this.obj.object3D.position.y += this.dy;
        this.obj.object3D.position.z += this.dz;

		if (this.accumulator >= this.gapLength) {
            this.dx *= -1;
			this.dy *= -1;
			this.dz *= -1;
            this.accumulator = 0;
			

            // Prevent constant shoving
            this.isWaiting = true;
            setTimeout(() => {
                this.isWaiting = false;
            }, this.waitTime);
        }
    }
}
