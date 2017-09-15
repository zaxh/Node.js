$(document).ready(function(){
	//document.body.scrollTop = document.documentElement.scrollTop = 0;
	$("html,body").animate({"scrollTop":"0"},500);
	$(".logo").css({
		"opacity":"1",
		"-webkit-transform": "scale(1.2) translateY(0px)",
		"transform": "scale(1.2) translateY(0px)",
	});
	$(".text").css({
		"opacity":"1",
		"-webkit-transform": "translateY(0px)",
		"transform": "translateY(0px)",
	});
});