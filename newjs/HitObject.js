function HitObject(beatmap, data) {
	this.beatmap = beatmap;

	this.data = data;

	this.x = parseInt(data[0], 10);
	this.y = parseInt(data[1], 10);

	this.time = parseInt(data[2], 10);
	this.type = parseInt(data[3], 10);
	this.sound = parseInt(data[4], 10);

	this.combo = 0;
	this.comboText = 1;

	this.clicked = null;

	if (this.type === 2 || this.type === 6) {
		this._initSlider();
	}
}

HitObject.prototype._initSlider = function () {
	this.curvePoints = this.data[5].split('|');
	this.sliderType = this.curvePoints.shift();

	for (var i = 0; i < this.curvePoints.length; ++i) {
		this.curvePoints[i] = this.curvePoints[i].split(':');
	}
};

HitObject.prototype.getColor = function (alpha) {
	if (typeof alpha !== 'number') {
		alpha = 1;
	}
	var col = this.combo % this.beatmap.color.length;
	return 'rgba(' + this.beatmap.color[col][0] + ',' + this.beatmap.color[col][1] + ',' + this.beatmap.color[col][2] + ',' + alpha + ')';
};

HitObject.prototype.draw = function (ctx, ratioX, ratioY, currentTime) {
	switch (this.type) {
		case 1:
		case 4:
		case 5:
			if (this.clicked === null) {
				this._drawObject(ctx, ratioX, ratioY, currentTime);
			}
			break;
		case 2:
		case 6:
			this._drawSlider(ctx, ratioX, ratioY, currentTime);
			break;
	}
};

HitObject.prototype._drawObject = function (ctx, ratioX, ratioY, currentTime) {
	var alpha = (1 - (this.time - currentTime) / 1500);
	var rgba = this.getColor(alpha);

	if (currentTime >= this.time - 1500 && currentTime <= this.time) {
		this._drawCircle(ctx, ratioX, ratioY, this.x, this.y, rgba, alpha);
		this._drawApproach(ctx, ratioX, ratioY, currentTime);
	}
};

HitObject.prototype._drawSlider = function (ctx, ratioX, ratioY, currentTime) {
	var alpha = (1 - (this.time - currentTime) / 1500);
	var rgba = this.getColor(alpha);
	var circleSize = this.beatmap.circleSize;

	if (currentTime >= this.time - 1500 && currentTime <= this.time) {
		this._drawSlide(ctx, ratioX, ratioY, currentTime);
		this._drawCircle(ctx, ratioX, ratioY, this.x, this.y, rgba, alpha);
		this._drawApproach(ctx, ratioX, ratioY, currentTime);
	}
};

HitObject.prototype._drawCircle = function (ctx, ratioX, ratioY, x, y, color, alpha) {
	var circleSize = this.beatmap.circleSize;

	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.fillStyle = 'rgba(' + this.beatmap.circleBorder.join(',') + ',' + alpha + ')';
	ctx.arc(x * ratioX, y * ratioY, circleSize, 0, Math.PI * 2, 0);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x * ratioX, y * ratioY, circleSize * 0.9, 0, Math.PI * 2, 0);
	ctx.fill();

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.font = circleSize + 'px Arial';
	ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';

	ctx.fillText(this.comboText, x * ratioX, y * ratioY);
};

HitObject.prototype._drawApproach = function (ctx, ratioX, ratioY, currentTime) {
	var alpha = (1 - (this.time - currentTime) / 1500);
	var rgba = this.getColor(alpha);
	var circleSize = this.beatmap.circleSize;

	if (!this.clic) {
		var taux = 1 - alpha;

		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.strokeStyle = rgba;
		ctx.arc(this.x * ratioX, this.y * ratioY, (1 + 3 * taux) * circleSize, 0, Math.PI * 2, 0);
		ctx.stroke();
	}
};

HitObject.prototype._drawSlide = function (ctx, ratioX, ratioY, currentTime) {
	var alpha = (1 - (this.time - currentTime) / 1500);
	var rgba = this.getColor(alpha);

	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.lineWidth = this.beatmap.circleSize * 2;

	ctx.beginPath();
	ctx.strokeStyle = 'rgba(' + this.beatmap.circleBorder.join(',') + ',' + alpha + ')';
	ctx.moveTo(ratioX * this.x, ratioY * this.y);
	if (this.sliderType === 'B' && this.curvePoints.length === 3) {
		ctx.bezierCurveTo(ratioX * this.curvePoints[0][0], ratioY * this.curvePoints[0][1], ratioX * this.curvePoints[1][0], ratioY * this.curvePoints[1][1], ratioX * this.curvePoints[2][0], ratioY * this.curvePoints[2][1]);
	} else if (this.sliderType === 'B' && this.curvePoints.length === 2) {
		ctx.quadraticCurveTo(ratioX * this.curvePoints[0][0], ratioY * this.curvePoints[0][1], ratioX * this.curvePoints[1][0], ratioY * this.curvePoints[1][1]);
	} else {
		for (var i = 0; i < this.curvePoints.length; ++i) {
			ctx.lineTo(ratioX * this.curvePoints[i][0], ratioY * this.curvePoints[i][1]);
		}
	}
	ctx.stroke();

	ctx.lineWidth = this.beatmap.circleSize * 2 * 0.95;

	ctx.beginPath();
	ctx.strokeStyle = rgba;
	ctx.moveTo(ratioX * this.x, ratioY * this.y);
	if (this.sliderType === 'B' && this.curvePoints.length === 3) {
		ctx.bezierCurveTo(ratioX * this.curvePoints[0][0], ratioY * this.curvePoints[0][1], ratioX * this.curvePoints[1][0], ratioY * this.curvePoints[1][1], ratioX * this.curvePoints[2][0], ratioY * this.curvePoints[2][1]);
	} else if (this.sliderType === 'B' && this.curvePoints.length === 2) {
		ctx.quadraticCurveTo(ratioX * this.curvePoints[0][0], ratioY * this.curvePoints[0][1], ratioX * this.curvePoints[1][0], ratioY * this.curvePoints[1][1]);
	} else {
		for (var i = 0; i < this.curvePoints.length; ++i) {
			ctx.lineTo(ratioX * this.curvePoints[i][0], ratioY * this.curvePoints[i][1]);
		}
	}
	ctx.stroke();

	ctx.lineJoin = 'miter';
	ctx.lineCap = 'butt';
};