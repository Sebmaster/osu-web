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
	for (i = 0; i < ho.length; ++i) {
		this.hitObjects[i] = new HitObject(this, ho[i]);
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