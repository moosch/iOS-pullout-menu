// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();
Element.prototype.hasClassOf = function(className) {
	return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};
!function ($) {

	"use strict";

	var s;
	var app = {
		settings: {
			site: document.getElementsByClassName('site')[0], // The site wrapper
			inner: document.getElementsByClassName('inner')[0], // The site inner div
			menu_toggle: document.getElementsByClassName('menu-toggle')[0], // Menu toggle button
			nav_state: 'closed', // Current 'state' of the navigation
			nav_w: document.getElementsByClassName('navigation')[0].offsetWidth, // Width of the navigation
			touch_down: 0, // Start location of swipe
			nav_move: 0, // The movement of the swipe
			nav_watch: false, // Watch for swipe
			nav_threshold: 40, // This is the minimum movement of the menu before an action
			start: null
		},
		init: function(){
			s = this.settings;
			this.bindUIActions();
		},
		navToggle: function(){
			requestAnimationFrame(app.anim);
		},
		anim: function(timestamp){
			var progress;
			if (s.start === null)
				s.start = timestamp;
			progress = timestamp - s.start;

			if( s.nav_state === 'closed' ){
				s.inner.style.left = '-'+Math.min(progress, 200) + "px";
				if (progress < 201){ // Continue animation
					requestAnimationFrame(app.anim);
				} else {
					s.nav_state = 'open';
					s.inner.classList.add('opened-nav');
					s.start = null;
				}
			} else {
				s.inner.style.left = Math.min((-200 + progress), 0) + "px";
				if (progress < 201){ // Continue animation
					requestAnimationFrame(app.anim);
				} else {
					s.inner.className = s.inner.className.replace(' opened-nav','');
					s.nav_state = 'closed';
					s.start = null;
				}
			}
		},
		touchStart: function(event){
			var touch = event.touches[0];
				s.touch_down = touch.pageX;
				s.nav_watch = true;
		},
		touchMove: function(event){
			if( s.nav_watch === true )
				app.navMove(event);
		},
		touchEnd: function(event){
			if( s.nav_watch === true )
				app.navSnap();
		},
		navMove: function(event){
			var touch = event.touches[0];
			if( s.nav_move > (s.touch_down+s.nav_threshold) || s.nav_move < (s.touch_down-s.nav_threshold) ){
				if( s.nav_state === 'closed' ){
					s.nav_move = touch.clientX - s.touch_down;
					if( s.nav_move < 0 && s.nav_move > -s.nav_w ){
						event.preventDefault();
						s.inner.style.left = s.nav_move+'px';
					}
				} else {
					s.nav_move = (touch.clientX - s.nav_w) - s.touch_down;
					if( s.nav_move < 0 && s.nav_move > -s.nav_w ){
						event.preventDefault();
						s.inner.style.left = s.nav_move+'px';
					}
				}
			}
		},
		navSnap: function(){
			if( s.nav_move < -50 ){
				s.inner.style.left = '-200px';
				s.inner.classList.add('opened-nav');
				s.nav_state = 'open';
			} else {
				s.inner.style.left = '0px';
				s.inner.className = s.inner.className.replace(' opened-nav','');
				s.nav_state = 'closed';
			}
			s.nav_watch = false;
		},
		bindUIActions: function(){
			s.menu_toggle.addEventListener('click', this.navToggle, false);
			document.addEventListener('touchstart', app.touchStart, false);
			document.addEventListener('touchmove', app.touchMove, false);
			document.addEventListener('touchend', app.touchEnd, false);
		}
	};
	app.init();

}(window.jQuery);