var startTime;
var checkTime;

var app = {
		
}

//Initialize function
var init = function () {
    function setUnderscore() {
    	var activeMenu = document.querySelector('.button.active', $('#sections'));
        var lineSelected = document.getElementById('line-selected');
        lineSelected.style.width = activeMenu.offsetWidth + 'px';
        lineSelected.style['margin-left'] = activeMenu.offsetLeft + 'px';
    }
    setUnderscore();
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
    
    var timeoutAutoHide;
    var timeoutSelect;
    function scrollTo(element)
    {
    	var vh = $(window).height() / 100;
    	var scrollLeft = element.parents('.mCSB_container').position().left;
    	var left = -scrollLeft;
    	if (element.position().left - 2 * vh + scrollLeft < 0) {
    		left = element.position().left - 2 * vh;
    	} else if (element.position().left + scrollLeft + 47.866667 * vh - $(window).width() > 0) {
    		left = element.position().left - $(window).width() + 47.866667 * vh;
    	}
    	//left = element.position().left - ($(window).width() - 45.867 * vh) / 2;
    	left = Math.max(0, left);
    	var change = Math.abs(left + scrollLeft);
    	var selectPosition = $('#select-box').offset();
    	if (change > 0) {
    		$('#channels').mCustomScrollbar('scrollTo', left, {scrollInertia: 0, timeout: 0});
    	}
    	var $selectBox = $('#select-box');
    	$('.stream-channel-name', $selectBox).html(element.data('channel-name'));
    	$('.stream-viewers', $selectBox).html('<i class="fa fa-eye"></i>' + element.data('viewers').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
    	$('.game-name', $selectBox).html(element.data('game'));
    	$('.channel-status', $selectBox).html(element.data('status'));
    	$selectBox.width(element.width());
    	$selectBox.height(element.height());
    	var newOffset = element.offset();
    	newOffset.left -= left + scrollLeft;
    	$selectBox.offset(newOffset);
    	if (timeoutAutoHide) {
    		clearTimeout(timeoutAutoHide);
    	}
    	$('#channels').removeClass('mCS-autoHide');
    	timeoutAutoHide = setTimeout(function() {
			$('#channels').addClass('mCS-autoHide');
		}, 2000);
    	if (timeoutSelect) {
    		clearTimeout(timeoutSelect);
    	}
    	element.addClass('selected');
    	/*timeoutSelect = setTimeout(function() {
			element.addClass('selected');
		}, 100);*/
    }
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		var allColumns = $('.column');
    		var container = $('#channels');
    		var activeCell = $('.cell.active', container);
    		if (activeCell) {
    			var activeColumn = activeCell.parent();
        		var x = allColumns.index(activeColumn);
        		var allCells = $('.cell', activeColumn);
        		var y = allCells.index(activeCell);
        		if (x > 0) {
        			x--;
					var prevColumn = allColumns[x];
					if (prevColumn) {
						var prevCells = $('.cell', prevColumn);
						var prevCell = $(prevCells[y]);
						activeCell.removeClass('active selected');
			    		prevCell.addClass('active');
						scrollTo(prevCell);
					}
        		}
    		}
    		break;
    	case 38: //UP arrow
    		var container = $('#channels');
    		var activeCell = $('.cell.active', container);
    		if (activeCell) {
    			var activeColumn = activeCell.parent();
        		var allCells = $('.cell', activeColumn);
        		var y = allCells.index(activeCell);
        		if (y > 0) {
        			y--;
					var prevCell = $(allCells[y]);
		    		activeCell.removeClass('active selected');
		    		prevCell.addClass('active');
		    		scrollTo(prevCell);
        		}
    		}
    		break;
    	case 39: //RIGHT arrow
    		var allColumns = $('.column');
    		var container = $('#channels');
    		var activeCell = $('.cell.active', container);
    		if (activeCell) {
    			var activeColumn = activeCell.parent();
        		var x = allColumns.index(activeColumn);
        		var allCells = $('.cell', activeColumn);
        		var y = allCells.index(activeCell);
        		if (x < allColumns.length - 1) {
        			x++;
					var nextColumn = allColumns[x];
					if (nextColumn) {
						var nextCells = $('.cell', nextColumn);
						var nextCell = $(nextCells[y]);
						activeCell.removeClass('active selected');
						nextCell.addClass('active');
						scrollTo(nextCell);
					}
        		}
    		}
    		break;
    	case 40: //DOWN arrow
    		var container = $('#channels');
    		var activeCell = $('.cell.active', container);
    		if (activeCell) {
    			var activeColumn = activeCell.parent();
        		var allCells = $('.cell', activeColumn);
        		var y = allCells.index(activeCell);
        		if (y < 2) {
        			y++;
					var nextCell = $(allCells[y]);
		    		activeCell.removeClass('active selected');
		    		nextCell.addClass('active');
		    		scrollTo(nextCell);
        		}
    		}
    		break;
    	case 13: //OK button
    		var selectedChannel = $('.cell.selected').data('channel');
    		$('#av-player').show();
    		$('#loading-wrapper').show();
    		ajaxGet('http://api.twitch.tv/api/channels/' + selectedChannel + '/access_token', function(data) {
    			data = JSON.parse(data);
    			ajaxGet('http://usher.twitch.tv/api/channel/hls/' + selectedChannel + '.m3u8?player=twitchweb&&type=any&sig=' + data.sig + '&token=' + escape(data.token) + '&allow_source=true&allow_audi_only=true&p=' + Math.round(Math.random() * 1e7), function(data) {
    				$('#loading-wrapper').hide();
    				var qualities = extractQualities(data);
    				webapis.avplay.stop();
        		    webapis.avplay.open(qualities[0].url);
        		    webapis.avplay.setListener({
        		        onbufferingstart: function() {
        		        		console.log("Buffering start.");
        		        		//SceneSceneChannel.onBufferingStart();
        		        },
        		        onbufferingprogress: function(percent) {
    			                console.log("Buffering progress data : " + percent);
    			        		//SceneSceneChannel.onBufferingProgress(percent);
        		        },
        		        onbufferingcomplete: function() {
        		        		console.log("Buffering complete.");
        		        		//SceneSceneChannel.onBufferingComplete();
        		        },
        		        oncurrentplaytime: function(currentTime) {
        		                console.log("Current Playtime : " + currentTime);
        		                //updateCurrentTime(currentTime);
        		        },
        		        onevent: function(eventType, eventData) {
        		                console.log("event type error : " + eventType + ", data: " + eventData);
        		                if (eventType == 'PLAYER_MSG_RESOLUTION_CHANGED'){
        		                	console.log("Mudou de Qualidade");
        		                }
        		        },
        		        onerror: function(eventType) {
        		                console.log("event type error : " + eventType);
        			        	if(eventType == 'PLAYER_ERROR_CONNECTION_FAILED'){
        			            	console.log("Closing stream from eventType == 'PLAYER_ERROR_CONNECTION_FAILED'");
        			            	//SceneSceneBrowser.errorNetwork = true;
        			            	//SceneSceneChannel.shutdownStream();
        			            }
        		        },
        		        onsubtitlechange: function(duration, text, data3, data4) {
        		                console.log("Subtitle Changed.");
        		        },
        		        ondrmevent: function(drmEvent, drmData) {
        		                console.log("DRM callback: " + drmEvent + ", data: " + drmData);
        		        },
        		        onstreamcompleted: function() {
        		                console.log("Stream Completed");
        		                //SceneSceneChannel.onRenderingComplete();
        		        }
        		    });
        		    webapis.avplay.setDisplayRect(0, 0, $(window).width(), $(window).height());
        		    webapis.avplay.prepare();
        		    webapis.avplay.play();
    			});
    		});
    		break;
    	case 10009: //RETURN button
			webapis.avplay.stop();
			$('#av-player').hide();
    		break;
    	default:
    		console.log("Key code : " + e.keyCode);
    		break;
    	}
    });
    
    var xmlHttp = new XMLHttpRequest();
	var theUrl = 'https://api.twitch.tv/kraken/streams?language=es,ru&stream_type=live&limit=51&offset=0';	
	xmlHttp.onreadystatechange = function()
	{
		if (xmlHttp.readyState === 4)
		{ 
			if (xmlHttp.status === 200)
			{
				try
				{
					var responseText = xmlHttp.responseText;
					var response = JSON.parse(responseText);
					console.log(response);
					console.log($('#select-box').offset().left);
					var channelsContainer = $('#channels');
					channelsContainer.empty();
					var firstCell = null;
					for (var i = 0; i < response.streams.length; i++) {
						var newColumn;
						if (i % 3 === 0) {
							newColumn = $('<div/>').addClass('column');
							channelsContainer.append(newColumn);
						}
						var stream = response.streams[i];
						var newCell = $('<div class="cell">\
							<i class="fa fa-fw fa-twitch"></i>\
							<img src="' + stream.preview.large + '" onload="imageLoaded(this)" onerror="imageFailed(this)">\
							<div class="stream-channel-name">' + stream.channel.display_name + '</div>\
						</div>');
						newCell.data('channel', stream.channel.name);
						newCell.data('channel-name', stream.channel.display_name);
						newCell.data('viewers', stream.viewers);
						newCell.data('game', stream.game);
						newCell.data('status', stream.channel.status);
						newColumn.append(newCell);
						if (!firstCell) {
							newCell.addClass('active');
							firstCell = newCell;
						}
					}
					$('#loading-wrapper').hide();
					channelsContainer.mCustomScrollbar({
						axis: "x",
						autoHideScrollbar: false,
						updateOnContentResize: true,
						keyboard: {enable: false},
						contentTouchScroll: false,
						documentTouchScroll: false,
						callbacks: {
							onScroll: function() {
								
							}
						}
					});
					scrollTo(firstCell);
					timeoutAutoHide = setTimeout(function() {
						channelsContainer.addClass('mCS-autoHide');
					}, 2000);
				}
				catch (err)
				{
					console.log(err);
					//SceneSceneBrowser.showDialog("loadDataSuccess() exception: " + err.name + ' ' + err.message);
				}
				
			}
			else
			{
				//SceneSceneBrowser.loadDataError("HTTP Status " + xmlHttp.status+" Message: "+xmlHttp.statusText,xmlHttp.responseText);
			}
		}
	};
    xmlHttp.open("GET", theUrl, true);
	xmlHttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
	xmlHttp.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
    xmlHttp.send(null);
};

function ajaxGet(url, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function()
	{
		if (xmlHttp.readyState === 4)
		{ 
			if (xmlHttp.status === 200)
			{
				try
				{
					var responseText = xmlHttp.responseText;
					//var response = JSON.parse(responseText);
					callback(responseText);
				}
				catch (err)
				{
					console.log(err);
					//SceneSceneBrowser.showDialog("loadDataSuccess() exception: " + err.name + ' ' + err.message);
				}
				
			}
			else
			{
				//SceneSceneBrowser.loadDataError("HTTP Status " + xmlHttp.status+" Message: "+xmlHttp.statusText,xmlHttp.responseText);
			}
		}
	};
    xmlHttp.open("GET", url, true);
	xmlHttp.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
    xmlHttp.send(null);
}

function imageLoaded(img)
{
	$(img).addClass('loaded');
}

function imageFailed(img)
{
	$(img).siblings('i').addClass('danger');
}

function extractStreamDeclarations(input)
{
  var result = [];

  var myRegexp = /#EXT-X-MEDIA:(.)*\n#EXT-X-STREAM-INF:(.)*\n(.)*/g;
  var match;
  while (match = myRegexp.exec(input))
  {
    result.push(match[0]);
  }

  return result;
}
function extractQualityFromStream(input)
{
  var myRegexp = /#EXT-X-MEDIA:.*NAME=\"(\w+)\".*/g;
  var match = myRegexp.exec(input);

	var quality;
	if (match !== null)
	{
		quality = match[1];
	}
	else
	{
		var values = input.split("\n");
		values = values[0].split(":");
		values = values[1].split(",");

		var set = {};
		for(var i = 0; i<values.length; i++) {
			var value = values[i].split("=");
			set[value[0]] = value[1].replace(/"/g, '');
		}
		quality = set.NAME;
	}
	return quality;
}
function extractUrlFromStream(input)
{
	return input.split("\n")[2];
}
function extractQualities(input)
{
  var result = [ ];

  var streams = extractStreamDeclarations(input);
  for (var i = 0; i < streams.length; i++)
  {
    result.push({
        'id' : extractQualityFromStream(streams[i]),
        'url' : extractUrlFromStream(streams[i])
    });
  }

  return result;
}

window.onload = init;