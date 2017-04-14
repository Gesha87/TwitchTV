var Constants = {
    STATE_BROWSE: 'browse',
    STATE_WATCH: 'watch',
    STATE_SELECT: 'select',
    
    PAGE_ACTIVE_CHANNELS: 'active-channels',
    PAGE_VIDEOS: 'videos',
    
    AREA_PAGES: 'pages',
    AREA_FILTERS: 'filter',
    AREA_RESULTS: 'results',
};

var App = {}
App.page = Constants.PAGE_ACTIVE_CHANNELS;
App.state = Constants.STATE_BROWSE;
App.activeArea = Constants.AREA_RESULTS;
App.areas = {};
App.areas[Constants.AREA_RESULTS] = {
    count: 0,
    columns: 0,
    rows: 3,
    x: 0,
    y: 0
};
App.areas[Constants.AREA_FILTERS] = {
    columns: 6,
    x: 0
};
App.areas[Constants.AREA_PAGES] = {
    columns: 2,
    x: 0
};
App.translateLayout = function() {
    $('#page-live-channels').find('.text').text(messages.PAGE_LIVE_CHANNELS);
    $('#page-videos').find('.text').text(messages.PAGE_VIDEOS);
    $('#filter-game').find('.text').text(messages.FILTER_GAME);
    $('#filter-channels').find('.text').text(messages.FILTER_CHANNELS);
    $('#filter-language').find('.text').text(messages.FILTER_LANGUAGE);
    $('#filter-stream-type').find('.text').text(messages.FILTER_STREAM_TYPE);
    $('#filter-presets').find('.text').text(messages.FILTER_PRESETS);
    $('#filter-search').find('.text').text(messages.FILTER_SEARCH);
    $('#hint-refresh').find('.text').text(messages.HINT_REFRESH);
    $('#hint-change-section').find('.text').text(messages.HINT_VIDEOS);
    $('#hint-presets').find('.text').text(messages.HINT_PRESETS);
    $('#hint-search').find('.text').text(messages.HINT_SEARCH);
    $('#loading').find('.text').text(messages.LOADING);
    $('body').addClass('init');
};
App.setUnderscore = function() {
    var $activeMenu = $('#pages').find('.active');
    var $lineSelected = $('#line-selected');
    $lineSelected.css('width', $activeMenu[0].offsetWidth + 'px');
    $lineSelected.css('margin-left', $activeMenu[0].offsetLeft + 'px');
};
App.thousandsSeparator = messages.language == 'ru' ? ' ' : ',';
App.$loading = null;
App.$selectBox = null;
App.$player = null;
App.$items = null;
App.$itemsContainer = null;
App.init = function() {
    App.$loading = $('#loading-wrapper');
    App.$selectBox = $('#select-box');
    App.$player = $('#av-player');
    App.$items = $('#items');
    App.translateLayout();
    App.setUnderscore();
    App.$items.mCustomScrollbar({
        axis: "x",
        autoHideScrollbar: false,
        advanced: {
            updateOnContentResize: false,
            updateOnImageLoad: false
        },
        keyboard: {
            enable: false
        },
        mouseWheel: {
            enable: false
        },
        contentTouchScroll: false,
        documentTouchScroll: false,
        callbacks: {
            onScroll: function() {
                
            }
        }
    });
    App.$itemsContainer = App.$items.find('.mCSB_container');
    /*document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            webapis.avplay.suspend();
        } else {
            if (App.state == Constants.STATE_WATCH) {
                webapis.avplay.restore();
            } else {
                App.refresh();
            }
        }
    });*/
    
    var timeoutAutoHide;
    var timeoutSelect;
    function scrollTo($element) {
        var vh = $(window).height() / 100;
        var scrollLeft = App.$itemsContainer.position().left;
        var left = -scrollLeft;
        if ($element.position().left - 2 * vh + scrollLeft < 0) {
            left = Math.round($element.position().left - 2 * vh);
        } else if ($element.position().left + scrollLeft + $element.width() - $(window).width() > 0) {
            left = Math.round($element.position().left - $(window).width() + $element.width());
        }
        left = Math.max(0, left);
        var change = Math.abs(left + scrollLeft);
        var selectPosition = $('#select-box').offset();
        if (change > 0) {
            App.$items.mCustomScrollbar('scrollTo', left, {
                scrollInertia: 0,
                timeout: 0
            });
        }
        App.$selectBox.find('.stream-channel-name').html($element.data('channel-name'));
        App.$selectBox.find('.stream-viewers').html('<i class="fa fa-eye"></i> ' + 
                $element.data('viewers').toString().replace(/\B(?=(\d{3})+(?!\d))/g, App.thousandsSeparator));
        App.$selectBox.find('.game-name').html($element.data('game'));
        App.$selectBox.find('.channel-status').html($element.data('status'));
        App.$selectBox.width($element.width());
        App.$selectBox.height($element.height());
        var newOffset = $element.offset();
        newOffset.left -= left + scrollLeft;
        App.$selectBox.offset(newOffset);
        if (timeoutAutoHide) {
            clearTimeout(timeoutAutoHide);
        }
        App.$items.removeClass('mCS-autoHide');
        timeoutAutoHide = setTimeout(function() {
            App.$items.addClass('mCS-autoHide');
        }, 2000);
        if (timeoutSelect) {
            clearTimeout(timeoutSelect);
        }
        $element.addClass('selected');
    }
    
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37: // LEFT arrow
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
            case 38: // UP arrow
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
            case 39: // RIGHT arrow
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
            case 40: // DOWN arrow
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
            case 13: // OK button
                var selectedChannel = $('.cell.selected').data('channel');
                App.$player.show();
                App.$loading.show();
                $.get('http://api.twitch.tv/api/channels/' + selectedChannel + '/access_token', function(data) {
                    $.get('http://usher.twitch.tv/api/channel/hls/' + selectedChannel + '.m3u8?player=twitchweb&&type=any&sig=' + data.sig + '&token=' + escape(data.token) + '&allow_source=true&allow_audi_only=true&p=' + Math.round(Math.random() * 1e7), function(data) {
                        App.$loading.hide();
                        var qualities = extractQualities(data);
                        webapis.avplay.stop();
                        webapis.avplay.open(qualities[0].url);
                        webapis.avplay.setListener({
                            onbufferingstart: function() {
                                console.log("Buffering start.");
                                // SceneSceneChannel.onBufferingStart();
                            },
                            onbufferingprogress: function(percent) {
                                console.log("Buffering progress data : " + percent);
                                // SceneSceneChannel.onBufferingProgress(percent);
                            },
                            onbufferingcomplete: function() {
                                console.log("Buffering complete.");
                                // SceneSceneChannel.onBufferingComplete();
                            },
                            oncurrentplaytime: function(currentTime) {
                                console.log("Current Playtime : " + currentTime);
                                // updateCurrentTime(currentTime);
                            },
                            onevent: function(eventType, eventData) {
                                console.log("event type error : " + eventType + ", data: " + eventData);
                                if (eventType == 'PLAYER_MSG_RESOLUTION_CHANGED') {
                                    console.log("Mudou de Qualidade");
                                }
                            },
                            onerror: function(eventType) {
                                console.log("event type error : " + eventType);
                                if (eventType == 'PLAYER_ERROR_CONNECTION_FAILED') {
                                    console.log("Closing stream from eventType == 'PLAYER_ERROR_CONNECTION_FAILED'");
                                    // SceneSceneBrowser.errorNetwork
                                    // =
                                    // true;
                                    // SceneSceneChannel.shutdownStream();
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
                                // SceneSceneChannel.onRenderingComplete();
                            }
                        });
                        webapis.avplay.setDisplayRect(0, 0, $(window).width(), $(window).height());
                        webapis.avplay.prepare();
                        webapis.avplay.play();
                    });
                }, 'json');
                break;
            case 27:
            case 10009: //RETURN button
                webapis.avplay.stop();
                App.$player.hide();
                break;
            default:
                console.log("Key code : " + e.keyCode);
                break;
        }
    });
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
            xhr.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
        }
    });
    $.get('https://api.twitch.tv/kraken/streams?language=ru&stream_type=live&limit=50&offset=0', function(response) {
        console.log(response);
        App.$itemsContainer.empty();
        var $firstCell = null;
        var countResults = App.areas[Constants.AREA_RESULTS].count;
        var countRows = App.areas[Constants.AREA_RESULTS].rows;
        var $newColumn = App.$itemsContainer.find('.column:last-child');
        for (var i = countResults; i < countResults + response.streams.length; i++) {
            if (i % countRows == 0) {
                $newColumn = $('<div class="column"/>');
                App.$itemsContainer.append($newColumn);
                App.areas[Constants.AREA_RESULTS].columns++;
            }
            var stream = response.streams[i];
            var $newCell = $('<div class="cell">\
                <i class="fa fa-fw fa-twitch"></i>\
                <img src="' + stream.preview.large + '" onload="imageLoaded(this)" onerror="imageFailed(this)">\
                <div class="stream-channel-name">' + stream.channel.display_name + '</div>\
            </div>');
            $newCell.data('channel', stream.channel.name);
            $newCell.data('channel-name', stream.channel.display_name);
            $newCell.data('viewers', stream.viewers);
            $newCell.data('game', stream.game);
            $newCell.data('status', stream.channel.status);
            $newColumn.append($newCell);
            if (!$firstCell) {
                $newCell.addClass('active');
                $firstCell = $newCell;
            }
        }
        App.areas[Constants.AREA_RESULTS].count += response.streams.length;
        App.$loading.hide();
        App.$items.mCustomScrollbar('update');
        scrollTo($firstCell);
        timeoutAutoHide = setTimeout(function() {
            App.$itemsContainer.addClass('mCS-autoHide');
        }, 2000);
    }, 'json');
};

function ajaxGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                try {
                    var responseText = xmlHttp.responseText;
                    //var response = JSON.parse(responseText);
                    callback(responseText);
                } catch (err) {
                    console.log(err);
                    //SceneSceneBrowser.showDialog("loadDataSuccess() exception: " + err.name + ' ' + err.message);
                }
                
            } else {
                //SceneSceneBrowser.loadDataError("HTTP Status " + xmlHttp.status+" Message: "+xmlHttp.statusText,xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
    xmlHttp.send(null);
}

function twitchApiGet(url, callback) {
    
}

function imageLoaded(img) {
    $(img).addClass('loaded');
}

function imageFailed(img) {
    $(img).siblings('i').addClass('danger');
}

function extractStreamDeclarations(input) {
    var result = [];
    var myRegexp = /#EXT-X-MEDIA:(.)*\n#EXT-X-STREAM-INF:(.)*\n(.)*/g;
    var match;
    while (match = myRegexp.exec(input)) {
        result.push(match[0]);
    }
    
    return result;
}
function extractQualityFromStream(input) {
    var myRegexp = /#EXT-X-MEDIA:.*NAME=\"(\w+)\".*/g;
    var match = myRegexp.exec(input);
    var quality;
    if (match !== null) {
        quality = match[1];
    } else {
        var values = input.split("\n");
        values = values[0].split(":");
        values = values[1].split(",");
        
        var set = {};
        for (var i = 0; i < values.length; i++) {
            var value = values[i].split("=");
            set[value[0]] = value[1].replace(/"/g, '');
        }
        quality = set.NAME;
    }
    return quality;
}
function extractUrlFromStream(input) {
    return input.split("\n")[2];
}
function extractQualities(input) {
    var result = [];
    var streams = extractStreamDeclarations(input);
    for (var i = 0; i < streams.length; i++) {
        result.push({
            'id': extractQualityFromStream(streams[i]),
            'url': extractUrlFromStream(streams[i])
        });
    }
    
    return result;
}

window.onload = App.init;