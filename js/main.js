var osu_file;
var player;

window.onload = function()
{
	setTimeout("main();", 0);
}

main = function()
{
	body = document.body;
	
	loadJS();
	loadImages();
	loadBeatMap();
	loadReadme();
	
	//loadAddons(); → moved to loadJS();
	//loadSound(); → buggy for now (once more)
}
