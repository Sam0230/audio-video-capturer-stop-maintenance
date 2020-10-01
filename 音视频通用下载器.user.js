// ==UserScript==
// @name         音视频通用下载器
// @version      3.5
// @description  下载所有网站上的音乐、视频。单击页面最右边的《 来打开捕获列表，双击捕获列表来关闭它。
// @author       Sam0230
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    https://greasyfork.org/users/207000
// ==/UserScript==

(function () {
	"use strict";
	let windowID = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100), MediaSources = [];
	let waitForDocument = function waitForDocument(callback) {
		let __waitForDocument = function () {
			if (window.document) {
				callback();
			} else {
				setTimeout(__waitForDocument, 25);
			};
		};
		__waitForDocument();
	};
	let waitForBody = function waitForBody(callback) {
		let __waitForBody = function () {
			if (window.document && window.document.body) {
				callback();
			} else {
				setTimeout(__waitForBody, 25);
			};
		};
		__waitForBody();
	};
	if (document.contentType.indexOf("audio") == 0 || document.contentType.indexOf("video") == 0) {
		if (location.href.indexOf("audioVideoCapturerDownloadThisLink") != -1) {
			waitForBody(function () {
				document.querySelector("video").volume = 0;
				document.querySelector("video").pause();
				document.querySelector("video").remove();
				let loading = document.createElement("div");
				loading.className = "loading";
				setTimeout(function () {
					document.body.append(loading);
					setTimeout(function () {
						loading.style.position = "fixed";
						loading.style.left = "0";
						loading.style.top = "61.803398874989484820458683436565%";
						loading.style.height = "3px";
						loading.style.width = "100%";
					}, 25);
				}, 25);
				let style = document.createElement("style");
				style.innerHTML = '@keyframes loading{0%{left:-20%;}100%{left:100%;}}.loading{overflow:hidden;background:rgba(255,255,255,0.2);transition:background 0.5s linear;}.loading::after{content:"";display:block;position:relative;background:rgba(255,255,255,0.8);height:100%;width:20%;animation:loading 5s linear infinite;transition:background 0.5s linear;}';
				document.body.append(style);
			});
		}
		let link = document.createElement("a");
		document.body.append(link);
		let hide_1 = function hide_1() {
			link.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
			link.style.color = "rgba(255, 255, 255, 0.5)";
		}
		let show_1 = function show_1() {
			link.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
			link.style.color = "rgba(255, 255, 255, 1)";
		}
		link.style.border = "none";
		link.style.zIndex = 999999999999999;
		link.style.height = "31px";
		link.style.width = "20px";
		link.style.position = "fixed";
		link.style.right = "0";
		link.style.top = "50%";
		link.style.margin = "-15px 0 0 0";
		link.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
		link.style.transition = "all 0.3s linear";
		link.style.cursor = "pointer";
		link.style.lineHeight = "150%";
		link.style.color = "rgba(255, 255, 255, 0.5)";
		link.style.fontSize = "20px";
		link.style.fontFamily = "Microsoft YaHei,Microsoft YaHei UI,Microsoft JhengHei,Microsoft JhengHei UI,Segoe UI,Lucida Grande,Helvetica,Arial,Noto Sans CJK SC,Droid Sans Fallback,Noto Sans Mono CJK SC,FreeSans,Arimo,Droid Sans,Hiragino Sans GB,Hiragino Sans GB W3,FontAwesome,PingFang SC,Source Han Sans CN,Wenquanyi Micro Hei,WenQuanYi Zen Hei,sans-serif";
		link.style.textDecoration = "none";
		link.style.transition = "all 0.3s linear";
		link.onselectstart = function () {
			return false;
		};
		link.onmousedown = function () {
			return false;
		};
		link.onmouseup = function () {
			return false;
		};
		link.onmouseover = show_1;
		link.onmouseout = hide_1;
		link.innerHTML = "\u25cb";
		link.download = "";
		let req = new XMLHttpRequest;
		req.open("GET", location.href);
		req.responseType = "blob";
		req.onload = function () {
			link.href = URL.createObjectURL(req.response);
			link.innerHTML = "\u2193";
			if (location.href.indexOf("audioVideoCapturerDownloadThisLink") != -1) {
				link.click();
				window.top.postMessage("audioVideoCapturerDownloadFinished", "*");
				window.close();
			}
		};
		req.onerror = function () {
			window.top.postMessage("audioVideoCapturerDownloadError", "*");
		};
		req.send();
		return;
	}
	function getRandStr(chs, len) {
		let str = "";
		while(len--) {
			str += chs[parseInt(Math.random() * chs.length)];
		}
		return str;
	}
	function process(outerHTML) {
		let i, result = "";
		while (outerHTML.indexOf("src=\"") != -1) {
			i = outerHTML.indexOf("src=\"") + 5;
			while (outerHTML[i] != '"' && i < outerHTML.length) {
				result += outerHTML[i];
				++ i;
			}
			if (i < outerHTML.length) {
				result += "\r\n";
			}
			outerHTML = outerHTML.replace("src=\"", "");
		}
		return result;
	}
	(function () {
		let playOriginal = HTMLAudioElement.prototype.play;
		function play() {
			let link;
			if (this.src) {
				link = this.src;
			} else {
				link = process(this.outerHTML);
			}
			if (link.indexOf("blob") != 0) {
				window.top.postMessage(Array("audioVideoCapturer", link, windowID, "link"), "*");
			}
			return playOriginal.call(this);
		}
		HTMLAudioElement.prototype.play = play;
		HTMLAudioElement.prototype.play.toString = HTMLAudioElement.prototype.play.toString.bind(playOriginal);
	})();
	(function () {
		let playOriginal = HTMLVideoElement.prototype.play;
		function play() {
			let link;
			if (this.src) {
				link = this.src;
			} else {
				link = process(this.outerHTML);
			}
			if (link.indexOf("blob") != 0) {
				window.top.postMessage(Array("audioVideoCapturer", link, windowID, "link"), "*");
			}
			return playOriginal.call(this);
		}
		HTMLVideoElement.prototype.play = play;
		HTMLVideoElement.prototype.play.toString = HTMLVideoElement.prototype.play.toString.bind(playOriginal);
	})();
	(function () {
		let MediaSourceOriginal = MediaSource;
		class MediaSourcE extends MediaSourceOriginal {
			constructor() {
				super();
				this.content = [];
				let id = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100);
				MediaSources[id] = this;
				window.top.postMessage(Array("audioVideoCapturer", id, windowID, "blob"), "*");
			}
		}
		window.MediaSource = MediaSourcE;
		MediaSource.toString = MediaSource.toString.bind(MediaSourceOriginal);
	})();
	(function () {
		let addSourceBufferOriginal = MediaSource.prototype.addSourceBuffer;
		function addSourceBuffer(mimeType) {
			let result = addSourceBufferOriginal.call(this, mimeType);
			this.content.push(result);
			result.mimeType = mimeType;
			result.content = [];
			return result;
		}
		MediaSource.prototype.addSourceBuffer = addSourceBuffer;
		MediaSource.prototype.addSourceBuffer.toString = MediaSource.prototype.addSourceBuffer.toString.bind(addSourceBufferOriginal);
	})();
	(function () {
		let appendBufferOriginal = SourceBuffer.prototype.appendBuffer;
		function appendBuffer(data) {
			if (this.content == undefined) {
				this.content = [];
			}
			this.content.push(data);
			return appendBufferOriginal.call(this, data);
		}
		SourceBuffer.prototype.appendBuffer = appendBuffer;
		SourceBuffer.prototype.appendBuffer.toString = SourceBuffer.prototype.appendBuffer.toString.bind(appendBufferOriginal);
	})();
	window.addEventListener("message", function (event) {
		if (event.data[0] == "audioVideoCapturerDownloadBlob") {
			if (event.data[1] == windowID) {
				let content, link = document.createElement("a");
				link.download = "";
				for (let i in MediaSources[event.data[2]].content) {
					content = [];
					for (let j in MediaSources[event.data[2]].content[i].content) {
						content = content.concat(MediaSources[event.data[2]].content[i].content[j]);
					}
					content = new Blob(content, {
						type: MediaSources[event.data[2]].content[i].mimeType
					});
					link.href = URL.createObjectURL(content);
					link.click();
				}
				window.top.postMessage("audioVideoCapturerDownloadFinished", "*");
			} else {
				for (let i = 0; i < frames.length; i++) {
					frames[i].postMessage(event.data, "*");
				}
			}
		}
		if (event.data[0] == "audioVideoCapturerDownloadLink") {
			if (event.data[1] == windowID) {
				let link = document.createElement("a");
				link.download = "";
				let req = new XMLHttpRequest;
				req.open("GET", event.data[2]);
				req.responseType = "blob";
				req.onload = function () {
					link.href = URL.createObjectURL(req.response);
					link.download = "";
					link.click();
					window.top.postMessage("audioVideoCapturerDownloadFinished", "*");
				};
				req.onerror = function () {
					window.top.postMessage("audioVideoCapturerDownloadError", "*");
				};
				req.send();
			} else {
				for (let i = 0; i < frames.length; i++) {
					frames[i].postMessage(event.data, "*");
				}
			}
		}
	});
	waitForDocument(function () {
		let firstKeydown = 999999999999999;
		let onKeyDown, onKeyUp;
		onKeyDown = function (event) {
			if (event.key == "`") {
				let time = ((new Date()).getTime());
				firstKeydown = Math.min(firstKeydown, time);
				if (time - firstKeydown >= 5000) {
					window.top.postMessage({
						audioVideoCapturerShow: {
							show: true,
							force: true
						}
					}, "*");
					document.removeEventListener("keydown", onKeyDown);
					document.removeEventListener("keyup", onKeyUp);
				}
			} else {
				firstKeydown = 999999999999999;
			}
		};
		onKeyUp = function (event) {
			if (event.key == "`") {
				firstKeydown = 999999999999999;
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
	});
	let iframe, iframe2, downloading = 0, style2;
	waitForBody(function () {
		let hide_1 = function hide_1() {
			iframe.style.transform = "translate(12px, 0)";
			iframe.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
			iframe.contentDocument.body.style.color = "rgba(255, 255, 255, 0)";
		};
		let show_1 = function show_1() {
			iframe.style.transform = "";
			iframe.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
			iframe.contentDocument.body.style.color = "rgba(255, 255, 255, 0.8)";
		};
		let show_2_hide_1 = function show_2_hide_1() {
			iframe2.style.transform = "translate(-300px, 0)";
			iframe.contentDocument.body.onmousemove = undefined;
			iframe.contentDocument.body.onmouseout = undefined;
			iframe.contentDocument.body.onmouseover = undefined;
			setTimeout(function () {
				iframe.style.backgroundColor = "rgba(0, 0, 0, 0)";
				iframe.contentDocument.body.style.color = "rgba(255, 255, 255, 0)";
			}, 50);
		};
		let show_1_hide_2 = function show_1_hide_2() {
			iframe2.style.transform = "none";
			iframe.contentDocument.body.onmousemove = show_1;
			iframe.contentDocument.body.onmouseover = show_1;
			iframe.contentDocument.body.onmouseout = hide_1;
			hide_1();
		};
		iframe = document.createElement("iframe"); //to cope with different CSS Style and DOCTYPE
		iframe.style.border = "none";
		iframe.style.zIndex = 999999999999999;
		iframe.style.height = "31px";
		iframe.style.width = "23px";
		iframe.style.position = "fixed";
		iframe.style.right = "0";
		iframe.style.top = "50%";
		iframe.style.margin = "-15px 0 0 0";
		iframe.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
		iframe.style.transform = "translate(12px, 0)";
		iframe.style.transition = "all 0.3s linear";
		iframe.style.visibility = "hidden";
		document.body.append(iframe);
		setTimeout(function () {
			iframe.contentDocument.body.style.cursor = "pointer";
			iframe.contentDocument.body.style.margin = 0;
			iframe.contentDocument.body.style.lineHeight = "150%";
			iframe.contentDocument.body.style.color = "rgba(255, 255, 255, 0)";
			iframe.contentDocument.body.style.fontSize = "20px";
			iframe.contentDocument.body.style.fontFamily = "Microsoft YaHei,Microsoft YaHei UI,Microsoft JhengHei,Microsoft JhengHei UI,Segoe UI,Lucida Grande,Helvetica,Arial,Noto Sans CJK SC,Droid Sans Fallback,Noto Sans Mono CJK SC,FreeSans,Arimo,Droid Sans,Hiragino Sans GB,Hiragino Sans GB W3,FontAwesome,PingFang SC,Source Han Sans CN,Wenquanyi Micro Hei,WenQuanYi Zen Hei,sans-serif";
			iframe.contentDocument.body.style.transition = "all 0.3s linear";
			iframe.contentDocument.body.onclick = show_2_hide_1;
			iframe.contentDocument.body.onmouseover = show_1;
			iframe.contentDocument.body.onmouseout = hide_1;
			iframe.contentDocument.body.onselectstart = function () {
				return false;
			};
			iframe.contentDocument.body.onmousedown = function () {
				return false;
			};
			iframe.contentDocument.body.onmouseup = function () {
				return false;
			};
			setTimeout(function () {
				iframe.contentDocument.body.innerHTML = "\u300a";
			}, 25);
		}, 25);
		iframe2 = document.createElement("iframe");
		iframe2.style.border = "none";
		iframe2.style.zIndex = 999999999999999;
		iframe2.style.height = "100%";
		iframe2.style.width = "300px";
		iframe2.style.position = "fixed";
		iframe2.style.left = "100%";
		iframe2.style.top = "0";
		iframe2.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		iframe2.style.transition = "all 0.3s";
		document.body.append(iframe2);
		setTimeout(function () {
			iframe2.contentDocument.body.style.whiteSpace = "pre";
			iframe2.contentDocument.body.style.color = "#fff";
			iframe2.contentDocument.body.style.lineHeight = "120%";
			iframe2.contentDocument.body.style.fontSize = "0.8em";
			iframe2.contentDocument.body.style.paddingTop = "3px";
			let style = iframe2.contentDocument.createElement("style");
			style.innerHTML = '@keyframes loading{0%{left:-20%;}100%{left:100%;}}.loading{overflow:hidden;background:rgba(255,255,255,0.2);transition:background 0.5s linear;}.loading::after{content:"";display:block;position:relative;background:rgba(255,255,255,0.8);height:100%;width:20%;animation:loading 2s linear infinite;transition:background 0.5s linear;}';
			style2 = iframe2.contentDocument.createElement("style");
			style2.id = "style2";
			style2.innerHTML = ".loading{background:rgba(255,255,255,0.075)}.loading::after{background:transparent}"
			iframe2.contentDocument.body.append(style);
			iframe2.contentDocument.body.append(style2);
			let loading = iframe2.contentDocument.createElement("div");
			loading.className = "loading";
			setTimeout(function () {
				iframe2.contentDocument.body.append(loading);
				setTimeout(function () {
					loading.style.position = "fixed";
					loading.style.right = "0";
					loading.style.top = "0";
					loading.style.height = "3px";
					loading.style.width = "300px";
				}, 25);
			}, 25);
			iframe2.contentDocument.body.style.fontFamily = "Microsoft YaHei,Microsoft YaHei UI,Microsoft JhengHei,Microsoft JhengHei UI,Segoe UI,Lucida Grande,Helvetica,Arial,Noto Sans CJK SC,Droid Sans Fallback,Noto Sans Mono CJK SC,FreeSans,Arimo,Droid Sans,Hiragino Sans GB,Hiragino Sans GB W3,FontAwesome,PingFang SC,Source Han Sans CN,Wenquanyi Micro Hei,WenQuanYi Zen Hei,sans-serif";
			let clickTime;
			iframe2.contentDocument.onclick = function () {
				let time = (new Date()).valueOf();
				if (time - clickTime <= 400) {
					show_1_hide_2();
					clickTime = 0;
				} else {
					clickTime = time;
				}
			};
			window.addEventListener("message", function (event) {
				if (event.data == "audioVideoCapturerDownloadFinished") {
					downloading--;
					if (!downloading) {
						iframe2.contentDocument.body.append(style2);
					}
				}
				if (event.data == "audioVideoCapturerDownloadError") {
					downloading--;
					if (!downloading) {
						iframe2.contentDocument.body.append(style2);
					}
					alert("AudioVideoCapturer: downloading error!");
				}
			});
		}, 25);
	});
	if (window.top == window) {
		window.addEventListener("message", function (event) {
			if (event.data[0] == "audioVideoCapturer") {
				let addToList = function () {
					if (iframe2.contentDocument) {
						let id = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100), elt = iframe2.contentDocument.createElement("a");
						iframe2.contentDocument.body.append(elt);
						if (event.data[3] == "blob") {
							elt.outerHTML = "<a id=\"" + id + "\" style=\"text-decoration: underline; cursor: pointer;\">Blob: " + event.data[1].slice(0,20) + "</a>\r\n";
							iframe2.contentDocument.getElementById(id).onclick = function () {
								window.postMessage(["audioVideoCapturerDownloadBlob", event.data[2], event.data[1]], "*");
								downloading++;
								if (iframe2.contentDocument.getElementById("style2") && downloading) {
									iframe2.contentDocument.getElementById("style2").remove();
								}
							};
						} else {
							elt.outerHTML = "<a id=\"" + id + "\" style=\"text-decoration: underline; cursor: pointer;\">" + event.data[1] + "</a>\r\n";
							iframe2.contentDocument.getElementById(id).onclick = function () {
								/*
								let link = document.createElement("a");
								link.href = event.data[1];
								link.click();
								setTimeout(function () {
									location.href = event.data[1];
								}, 200);
								*/
								if (event.data[1].slice(0, 7) == "http://") {
									let src = event.data[1];
									if (src.indexOf("?") == -1) {
										src += "?audioVideoCapturerDownloadThisLink";
									} else {
										src += "&audioVideoCapturerDownloadThisLink";
									}
									window.open(src).blur();
									window.focus();
								} else {
									let f = document.createElement("iframe");
									let src = event.data[1];
									if (src.indexOf("?") == -1) {
										src += "?audioVideoCapturerDownloadThisLink";
									} else {
										src += "&audioVideoCapturerDownloadThisLink";
									}
									f.src = src;
									f.style.position = "fixed";
									f.style.zIndex = -999999999999999;
									f.style.height = "10px";
									f.style.width = "10px";
									f.style.top = "-1000px";
									f.style.left = "-1000px";
									document.body.append(f);
									downloading++;
									if (iframe2.contentDocument.getElementById("style2") && downloading) {
										iframe2.contentDocument.getElementById("style2").remove();
									}
									/*
									window.postMessage(["audioVideoCapturerDownloadLink", event.data[2], event.data[1]], "*");
									downloading++;
									if (iframe2.contentDocument.getElementById("style2") && downloading) {
										iframe2.contentDocument.getElementById("style2").remove();
									}
									*/
								}
							};
						}
					} else {
						setTimeout(addToList, 25);
					}
				};
				addToList();
			}
		});
		let onShowRequest = function onShowRequest(event) {
			if (!(event.data && event.data.audioVideoCapturerShow && event.data.audioVideoCapturerShow.show)) {
				return;
			}
			window.removeEventListener("message", onShowRequest);
			let show = function () {
				if (iframe && iframe.style && iframe.style.visibility == "hidden") {
					if (event.data && event.data.audioVideoCapturerShow && event.data.audioVideoCapturerShow.show) {
						show = true;
						iframe.style.visibility = "";
						if (event.data.audioVideoCapturerShow.force) {
							alert("AudioVideoCapturer is enabled!");
						}
					}
				} else {
					setTimeout(show, 25);
				}
			};
			show();
		};
		window.addEventListener("message", onShowRequest);
	}
	if (true || location.href.toLocaleLowerCase().indexOf("xue.taobao.com") != -1 || location.href.toLocaleLowerCase().indexOf("edu.taobao.com") != -1 || location.href.toLocaleLowerCase().indexOf("kuwo") != -1 || location.href.toLocaleLowerCase().indexOf("youku") != -1 || location.href.toLocaleLowerCase().indexOf("play") != -1 || location.href.toLocaleLowerCase().indexOf("sing") != -1 || location.href.toLocaleLowerCase().indexOf("song") != -1 || location.href.toLocaleLowerCase().indexOf("album") != -1 || location.href.toLocaleLowerCase().indexOf("audio") != -1 || location.href.toLocaleLowerCase().indexOf("music") != -1 || location.href.toLocaleLowerCase().indexOf("yinyue") != -1 || location.href.toLocaleLowerCase().indexOf("video") != -1 || location.href.toLocaleLowerCase().indexOf("movie") != -1 || location.href.toLocaleLowerCase().indexOf("film") != -1 || location.href.toLocaleLowerCase().indexOf("watch") != -1 || location.href.toLocaleLowerCase().indexOf("dianying") != -1 || location.href.toLocaleUpperCase().indexOf("%E6%AD%8C") != -1 || location.href.toLocaleUpperCase().indexOf("%E4%B9%90") != -1 || location.href.toLocaleUpperCase().indexOf("%E6%9B%B2") != -1 || location.href.toLocaleUpperCase().indexOf("%E5%BD%B1") != -1 || location.href.toLocaleUpperCase().indexOf("%E5%89%A7") != -1) {
		window.top.postMessage({
			audioVideoCapturerShow: {
				show: true,
				force: false
			}
		}, "*");
	}
})();
