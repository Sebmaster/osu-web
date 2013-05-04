function Beatmap(osuFile, path) {
	this.color = [
		[255, 165, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 0, 0]
	];

	this.osu = osuFile;
	this.path = path;
	this.audio = document.createElement('audio');
	this.audio.src = 'filesystem:' + document.location.origin + '/persistent' + this.path + this.osu.data.General.AudioFilename;

	this._init();
}

Beatmap.prototype._init = function () {
	var i = 0;
	for (var key in this.osu.data.Colours) {
		this.color[i] = this.osu.data.Colours[key];
	}
};

Beatmap.prototype.start = function () {
	this.audio.play();
};