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
        scrollInertia: 0,
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
            onTotalScroll: function() {
                App.loadMore();
            },
            onTotalScrollOffset: $(window).height() * 0.5
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
    
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37: // LEFT arrow
                if (App.activeArea == Constants.AREA_RESULTS) {
                    var $newActiveCell, $activeCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + App.areas[Constants.AREA_RESULTS].y);
                    if ($activeCell.length > 0 && App.areas[Constants.AREA_RESULTS].x > 0) {
                        $newActiveCell = $('#item-' + (App.areas[Constants.AREA_RESULTS].x - 1) + '-' + App.areas[Constants.AREA_RESULTS].y);
                        if ($newActiveCell.length > 0) {
                            App.areas[Constants.AREA_RESULTS].x--;
                            $activeCell.removeClass('active selected');
                            $newActiveCell.addClass('active');
                            App.scrollTo($newActiveCell);
                        }
                    }
                }
                break;
            case 38: // UP arrow
                if (App.activeArea == Constants.AREA_RESULTS) {
                    var $newActiveCell, $activeCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + App.areas[Constants.AREA_RESULTS].y);
                    if ($activeCell.length > 0 && App.areas[Constants.AREA_RESULTS].y > 0) {
                        $newActiveCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + (App.areas[Constants.AREA_RESULTS].y - 1));
                        if ($newActiveCell.length > 0) {
                            App.areas[Constants.AREA_RESULTS].y--;
                            $activeCell.removeClass('active selected');
                            $newActiveCell.addClass('active');
                            App.scrollTo($newActiveCell);
                        }
                    }
                }
                break;
            case 39: // RIGHT arrow
                if (App.activeArea == Constants.AREA_RESULTS) {
                    var $newActiveCell, $activeCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + App.areas[Constants.AREA_RESULTS].y);
                    if ($activeCell.length > 0 && App.areas[Constants.AREA_RESULTS].x < App.areas[Constants.AREA_RESULTS].columns - 1) {
                        $newActiveCell = $('#item-' + (App.areas[Constants.AREA_RESULTS].x + 1) + '-' + App.areas[Constants.AREA_RESULTS].y);
                        if ($newActiveCell.length > 0) {
                            App.areas[Constants.AREA_RESULTS].x++;
                            $activeCell.removeClass('active selected');
                            $newActiveCell.addClass('active');
                            App.scrollTo($newActiveCell);
                        }
                    }
                }
                break;
            case 40: // DOWN arrow
                if (App.activeArea == Constants.AREA_RESULTS) {
                    var $newActiveCell, $activeCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + App.areas[Constants.AREA_RESULTS].y);
                    if ($activeCell.length > 0 && App.areas[Constants.AREA_RESULTS].y < App.areas[Constants.AREA_RESULTS].rows - 1) {
                        $newActiveCell = $('#item-' + App.areas[Constants.AREA_RESULTS].x + '-' + (App.areas[Constants.AREA_RESULTS].y + 1));
                        if ($newActiveCell.length > 0) {
                            App.areas[Constants.AREA_RESULTS].y++;
                            $activeCell.removeClass('active selected');
                            $newActiveCell.addClass('active');
                            App.scrollTo($newActiveCell);
                        }
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
                //webapis.avplay.stop();
                App.$player.hide();
                break;
            case 49:
                App.refresh();
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
    App.refresh();
};
App.hasMoreResults = true;
App.loadingMoreResults = null;
App.loadMore = function() {
    if (App.hasMoreResults && !App.loadingMoreResults) {
        App.loadingMoreResults = App.getActiveChannels(66, App.areas[Constants.AREA_RESULTS].count, function() {
            App.loadingMoreResults = null;
        });
    }
}
App.refreshing = null;
App.refresh = function() {
    if (!App.refreshing) {
        if (App.loadingMoreResults) {
            App.loadingMoreResults.abort();
            App.loadingMoreResults = null;
        }
        App.$selectBox.hide();
        App.$loading.show();
        App.$itemsContainer.empty();
        App.$itemsContainer.css('width', 0);
        App.$items.mCustomScrollbar('update');
        App.areas[Constants.AREA_RESULTS].count = 0;
        App.areas[Constants.AREA_RESULTS].columns = 0;
        App.areas[Constants.AREA_RESULTS].x = 0;
        App.areas[Constants.AREA_RESULTS].y = 0;
        App.refreshing = App.getActiveChannels(33, 0, function() {
            App.refreshing = null;
        });
    }
};
App.getActiveChannels = function(limit, offset, callback) {
    return $.get('https://api.twitch.tv/kraken/streams?language=ru&stream_type=live&limit=' + limit + '&offset=' + offset, function(response) {
        console.log(response);
        var i, ii, x, y, stream, $newCell;
        var countResults = App.areas[Constants.AREA_RESULTS].count;
        var countRows = App.areas[Constants.AREA_RESULTS].rows;
        var $newColumn = App.$itemsContainer.find('.column:last-child');
        for (i = 0; i < response.streams.length; i++) {
            ii = i + countResults;
            if ((y = ii % countRows) == 0) {
                $newColumn = $('<div class="column"/>');
                App.$itemsContainer.append($newColumn);
                App.areas[Constants.AREA_RESULTS].columns++;
            }
            x = (ii - y) / countRows;
            stream = response.streams[i];
            $newCell = $('<div class="cell" id="item-' + x + '-' + y + '">\
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
            if (ii == 0) {
                $newCell.addClass('active');
                App.scrollTo($newCell);
            }
        }
        App.areas[Constants.AREA_RESULTS].count += response.streams.length;
        App.$loading.hide();
        App.$items.mCustomScrollbar('update');
        App.timeoutAutoHide = setTimeout(function() {
            App.$itemsContainer.addClass('mCS-autoHide');
        }, 2000);
        App.hasMoreResults = response.streams.length > 0;
        if (typeof callback == 'function') {
            callback();
        }
    }, 'json');
};
App.timeoutAutoHide = null;
App.timeoutSelect = null;
App.scrollTo = function ($element) {
    var vh = $(window).height() / 100;
    var scrollLeft = App.$itemsContainer.position().left;
    var left = -scrollLeft;
    if ($element.position().left - 2 * vh + scrollLeft < 0) {
        left = Math.round($element.position().left - 2 * vh);
    } else if ($element.position().left + scrollLeft + $element.width() + 2 * vh - $(window).width() > 0) {
        left = Math.round($element.position().left + $element.width() + 2 * vh - $(window).width());
    }
    left = Math.max(0, left);
    var change = Math.abs(left + scrollLeft);
    var selectPosition = App.$selectBox.offset();
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
    App.$selectBox.show();
    App.$selectBox.width($element.width());
    App.$selectBox.height($element.height());
    var newOffset = $element.offset();
    newOffset.left -= left + scrollLeft;
    App.$selectBox.offset(newOffset);
    if (App.timeoutAutoHide) {
        clearTimeout(App.timeoutAutoHide);
        App.timeoutAutoHide = null;
    }
    App.$items.removeClass('mCS-autoHide');
    App.timeoutAutoHide = setTimeout(function() {
        App.$items.addClass('mCS-autoHide');
    }, 2000);
    if (App.timeoutSelect) {
        clearTimeout(App.timeoutSelect);
        App.timeoutSelect = null;
    }
    $element.addClass('selected');
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