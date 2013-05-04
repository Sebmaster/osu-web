function HitObject(beatmap, data) {
	this.beatmap = beatmap;

	this.x = parseInt(data[0], 10);
	this.y = parseInt(data[1], 10);

	this.time = parseInt(data[2], 10);
	this.type = parseInt(data[3], 10);
	this.sound = parseInt(data[4], 10);

	this.combo = 0;
	this.comboText = 1;

	this.clicked = false;
}

HitObject.prototype.getColor = function (alpha) {
	if (typeof alpha !== 'number') {
		alpha = 1;
	}
	var col = this.combo % this.beatmap.color.length;
	return 'rgba(' + this.beatmap.color[col][0] + ',' + this.beatmap.color[col][1] + ',' + this.beatmap.color[col][2] + ',' + alpha + ')';
};

HitObject.prototype.draw = function (currentTime) {
	switch (this.type) {
		case 1:
		case 4:
		case 5:
			if (!this.clicked && currentTime >= this.time - 1500 && currentTime <= this.time) {
				//this.drawApproach();
				this._drawObject(currentTime);
			}
			break;
	}
};

HitObject.prototype._drawObject = function (currentTime) {
	var alpha = (1 - (this.time - currentTime) / 1500);
	var rgba = this.getColor(alpha);
	var rgb = this.getColor();
	var circleSize = 20;
	var ctx = this.beatmap.context;

	switch (this.type) {
		case 1:
		case 4:
		case 5:
			ctx.beginPath();
			ctx.fillStyle = "rgba(200,200,200," + alpha + ")";
			ctx.arc(this.x, this.y, circleSize, 0, Math.PI * 2, 0);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = rgba;
			ctx.arc(this.x, this.y, circleSize * 0.95, 0, Math.PI * 2, 0);
			ctx.fill();

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			ctx.font = circleSize + "px Arial";
			ctx.fillStyle = "rgba(255,255,255," + alpha + ")";

			ctx.fillText(this.comboText, this.x, this.y);
			break;
	}
};