function Beatmap(ctx, osuFile, path) {
	this.color = [
		[255, 165, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 0, 0]
	];

	this.context = ctx;
	this.animationFrame = null;
	this.osu = osuFile;
	this.path = path;
	this.audio = document.createElement('audio');
	this.hitObjects = [];

	this._init();
}

Beatmap.prototype._init = function () {
	var i = 0;
	for (var key in this.osu.data.Colours) {
		var cols = this.osu.data.Colours[key].split(',');
		this.color[i++] = [parseInt(cols[0], 10), parseInt(cols[1], 10), parseInt(cols[2], 10)];
	}

	this.audio.src = 'filesystem:' + document.location.origin + '/persistent' + this.path + this.osu.data.General.AudioFilename;

	var ho = this.osu.data.HitObjects;
	var combo = 0;
	var comboText = 1;
	for (i = 0; i < ho.length; ++i) {
		this.hitObjects[i] = new HitObject(this, ho[i]);
		if (this.hitObjects[i].type === 4 || this.hitObjects[i].type === 5 || this.hitObjects[i].type === 6) {
			if (i !== 0) {
				++combo;
			}
			comboText = 1;
		}
		if (i > 0 && this.hitObjects[i - 1].x === this.hitObjects[i].x && this.hitObjects[i - 1].y === this.hitObjects[i].y &&
			(this.hitObjects[i].type === 1 || this.hitObjects[i].type === 4 || this.hitObjects[i].type === 5)) {
			this.hitObjects[i].x += 10;
			this.hitObjects[i].y += 10;
		}

		this.hitObjects[i].combo = combo;
		this.hitObjects[i].comboText = comboText++;
	}
};

Beatmap.prototype.start = function () {
	this.audio.play();
	this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
};

Beatmap.prototype.draw = function () {
	this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));

	var curr = this.audio.currentTime * 1000;
	this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	for (var i = 0; i < this.hitObjects.length; ++i) {
		this.hitObjects[i].draw(curr);
	}
};

Beatmap.prototype.stop = function () {
	this.audio.pause();
	window.cancelAnimationFrame(this.animationFrame);
}