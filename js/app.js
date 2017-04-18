var app = {}
app.page = constants.PAGE_LIVE_CHANNELS;
app.returnStack = [];
app.state = constants.STATE_BROWSE;
app.activeArea = constants.AREA_RESULTS;
app.areas = {};
app.areas[constants.AREA_RESULTS] = { count: 0, columns: 0, rows: 3, x: 0, y: 0 };
app.areas[constants.AREA_FILTERS] = { columns: 0, x: 0 };
app.areas[constants.AREA_STREAM_FILTERS] = { columns: 0, x: 0 };
app.areas[constants.AREA_VIDEO_FILTERS] = { columns: 0, x: 0 };
app.areas[constants.AREA_PAGES] = { columns: 0, x: 0 };
app.translateLayout = function() {
    // pages
    $('#page-live-channels').find('.text').text(messages.PAGE_LIVE_CHANNELS);
    $('#page-videos').find('.text').text(messages.PAGE_VIDEOS);
    // stream filters
    $('#stream-filter-game').find('.text').text(messages.FILTER_STREAM_GAME);
    $('#stream-filter-channels').find('.text').text(messages.FILTER_STREAM_CHANNELS);
    $('#stream-filter-language').find('.text').text(messages.FILTER_STREAM_LANGUAGE);
    $('#stream-filter-type').find('.text').text(messages.FILTER_STREAM_TYPE);
    $('#stream-filter-presets').find('.text').text(messages.FILTER_PRESETS);
    $('#stream-filter-search').find('.text').text(messages.FILTER_SEARCH);
    // video filters
    $('#video-filter-game').find('.text').text(messages.FILTER_VIDEO_GAME);
    $('#video-filter-period').find('.text').text(messages.FILTER_VIDEO_PERIOD);
    $('#video-filter-languages').find('.text').text(messages.FILTER_VIDEO_LANGUAGES);
    $('#video-filter-type').find('.text').text(messages.FILTER_VIDEO_TYPE);
    $('#video-filter-sort').find('.text').text(messages.FILTER_VIDEO_SORT);
    $('#video-filter-presets').find('.text').text(messages.FILTER_PRESETS);
    $('#video-filter-search').find('.text').text(messages.FILTER_SEARCH);
    // hints
    $('#hint-refresh').find('.text').text(messages.HINT_REFRESH);
    $('#hint-change-page').find('.text').text(messages.HINT_VIDEOS);
    $('#hint-presets').find('.text').text(messages.HINT_PRESETS);
    $('#hint-search').find('.text').text(messages.HINT_SEARCH);
    // buttons
    $('#button-exit').text(messages.BUTTON_EXIT);
    $('#button-cancel').text(messages.BUTTON_CANCEL);
    $('#button-close').text(messages.BUTTON_CLOSE);
    // others
    $('#loading').find('.text').text(messages.LOADING);
    $('#confirm-exit').text(messages.CONFIRM_EXIT);
};
app.setUnderscore = function() {
    var $activePage = app.$pages.find('.active');
    var $lineSelected = $('#divider').find('.line-selected');
    $lineSelected.css('width', $activePage[0].offsetWidth + 'px');
    $lineSelected.css('margin-left', $activePage[0].offsetLeft + 'px');
};
app.thousandsSeparator = messages.language === 'ru' ? ' ' : ',';
app.$loading = null;
app.$error = null;
app.$errorText = null;
app.$buttonCloseError = null;
app.$exitDialog = null;
app.$selectBox = null;
app.$player = null;
app.$items = null;
app.$itemsContainer = null;
app.$filters = null;
app.$streamFilters = null;
app.$videoFilters = null;
app.$pages = null;
app.$liveChannelsPage = null;
app.$videosPage = null;
app.$hintChangePageText = null;
app.init = function() {
    app.$loading = $('#loading-wrapper');
    app.$error = $('#error-dialog');
    app.$errorText = $('#error-dialog-text');
    app.$buttonCloseError = $('#button-close');
    app.$exitDialog = $('#exit-dialog');
    app.$loadingText = app.$loading.find('.text');
    app.$selectBox = $('#select-box');
    app.$player = $('#av-player');
    app.$items = $('#items');
    app.$pages = $('#pages');
    app.$liveChannelsPage = $('#page-live-channels');
    app.$videosPage = $('#page-videos');
    app.$streamFilters = $('#stream-filters');
    app.$videoFilters = $('#video-filters');
    app.$filters = app.$streamFilters;
    app.$hintChangePageText = $('#hint-change-page').find('.text');
    app.translateLayout();
    app.setUnderscore();
    app.areas[constants.AREA_PAGES].columns = app.$pages.find('.page').length;
    app.areas[constants.AREA_STREAM_FILTERS].columns = app.$streamFilters.find('.filter').length;
    app.areas[constants.AREA_VIDEO_FILTERS].columns = app.$videoFilters.find('.filter').length;
    app.areas[constants.AREA_FILTERS] = app.areas[constants.AREA_STREAM_FILTERS];
    $('body').addClass('init');
    app.$items.mCustomScrollbar({
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
                app.loadMore();
            },
            onTotalScrollOffset: $(window).height() * 0.5
        }
    });
    app.$itemsContainer = app.$items.find('.mCSB_container');
    /*document.addEventListener('visibilitychange', function() {
        if (app.state == constants.STATE_WATCH) {
            if (document.hidden) {
                webapis.avplay.suspend();
            } else {
                webapis.avplay.restore();
            }
        }
    });*/
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case keys.KEY_LEFT:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea === constants.AREA_RESULTS) {
                        var $newActiveCell, $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($activeCell.length > 0 && app.areas[constants.AREA_RESULTS].x > 0) {
                            $newActiveCell = $('#item-' + (app.areas[constants.AREA_RESULTS].x - 1) + '-' + app.areas[constants.AREA_RESULTS].y);
                            if ($newActiveCell.length > 0) {
                                app.areas[constants.AREA_RESULTS].x--;
                                app.showItem($newActiveCell);
                            }
                        }
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        if (app.areas[constants.AREA_FILTERS].x > 0) {
                            app.areas[constants.AREA_FILTERS].x--;
                            app.showCurrentFilter();
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_PAGES].x > 0) {
                            app.areas[constants.AREA_PAGES].x--;
                            app.showCurrentPage(true);
                        }
                    }
                }
                break;
            case keys.KEY_UP:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        var $newActiveCell, $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($activeCell.length > 0 && app.areas[constants.AREA_RESULTS].y > 0) {
                            $newActiveCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + (app.areas[constants.AREA_RESULTS].y - 1));
                            if ($newActiveCell.length > 0) {
                                app.areas[constants.AREA_RESULTS].y--;
                                app.showItem($newActiveCell);
                            }
                        } else if (app.areas[constants.AREA_RESULTS].y == 0) {
                            if (app.areas[constants.AREA_FILTERS].columns > 0) {
                                app.activateFiltersArea();
                            } else {
                                app.activatePagesArea();
                            }
                        }
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        app.activatePagesArea();
                    }
                }
                break;
            case keys.KEY_RIGHT:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        var $newActiveCell, $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($activeCell.length > 0 && app.areas[constants.AREA_RESULTS].x < app.areas[constants.AREA_RESULTS].columns - 1) {
                            $newActiveCell = $('#item-' + (app.areas[constants.AREA_RESULTS].x + 1) + '-' + app.areas[constants.AREA_RESULTS].y);
                            if ($newActiveCell.length > 0) {
                                app.areas[constants.AREA_RESULTS].x++;
                                app.showItem($newActiveCell);
                            }
                        }
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        if (app.areas[constants.AREA_FILTERS].x < app.areas[constants.AREA_FILTERS].columns - 1) {
                            app.areas[constants.AREA_FILTERS].x++;
                            app.showCurrentFilter();
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_PAGES].x < app.areas[constants.AREA_PAGES].columns - 1) {
                            app.areas[constants.AREA_PAGES].x++;
                            app.showCurrentPage(true);
                        }
                    }
                }
                break;
            case keys.KEY_DOWN:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        var $newActiveCell, $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($activeCell.length > 0 && app.areas[constants.AREA_RESULTS].y < app.areas[constants.AREA_RESULTS].rows - 1) {
                            $newActiveCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + (app.areas[constants.AREA_RESULTS].y + 1));
                            if ($newActiveCell.length > 0) {
                                app.areas[constants.AREA_RESULTS].y++;
                                app.showItem($newActiveCell);
                            }
                        }
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        app.activateItemsArea();
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_FILTERS].columns > 0) {
                            app.activateFiltersArea();
                        } else {
                            app.activateItemsArea();
                        }
                    }
                }
                break;
            case keys.KEY_ENTER:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        var $selectedItem = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            if (app.page == constants.PAGE_LIVE_CHANNELS) {
                                app.playStream($selectedItem.data('channel'));
                            } else if (app.page == constants.PAGE_VIDEOS) {
                                app.playVideo($selectedItem.data('vod-id'));
                            }
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        app.refresh();
                    }
                } else if (app.state === constants.STATE_ERROR) {
                    app.hideError();
                } else if (app.state === constants.STATE_EXIT) {
                    var type = app.$exitDialog.find('.selected').data('type');
                    if (type === constants.BUTTON_TYPE_EXIT) {
                        sf.core.exit(false);
                    } else if (type === constants.BUTTON_TYPE_CLOSE) {
                        app.hideExit();
                    }
                }
                break;
            case 27:
            case keys.KEY_RETURN:
                if (app.state === constants.STATE_WATCH) {
                    webapis.avplay.stop();
                    app.$player.hide();
                    app.returnState();
                } else if (app.state === constants.STATE_BROWSE) {
                    app.returnState();
                } else if (app.state === constants.STATE_ERROR) {
                    app.hideError();
                } else if (app.state === constants.STATE_EXIT) {
                    app.hideExit();
                }
                break;
            case keys.KEY_1:
            case keys.KEY_RED:
                if (app.state == constants.STATE_BROWSE) {
                    app.refresh();
                }
                break;
            case keys.KEY_2:
            case keys.KEY_GREEN:
                if (app.state == constants.STATE_BROWSE) {
                    app.changePage();
                }
                break;
            case keys.KEY_3:
            case keys.KEY_YELLOW:
            case keys.KEY_4:
            case keys.KEY_BLUE:
            default:
                console.log("Key code : " + e.keyCode);
                break;
        }
    });
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
        }
    });
    app.refresh();
};
app.setState = function(state) {
    app.returnStack.push(app.state);
    app.state = state;
};
app.returnState = function() {
    if (app.returnStack.length > 0) {
        app.state = app.returnStack.pop();
    } else {
        app.$exitDialog.show();
        app.returnStack.push(app.state);
        app.state = constants.STATE_EXIT;
    }
};
app.loadingStream = null;
app.playStream = function(channelName) {
    app.setState(constants.STATE_WATCH);
    if (app.loadingStream) {
        app.loadingStream.abort();
        app.loadingStream = null;
    }
    app.$player.show();
    app.showLoading(constants.LOADING);
    app.loadingStream = $.get('http://api.twitch.tv/api/channels/' + channelName + '/access_token', 'json').always(function() {
        app.loadingStream = null;
    }).done(function(data) {
        app.loadingStream = $.get('http://usher.twitch.tv/api/channel/hls/' + channelName + '.m3u8?player=twitchweb&&type=any&sig=' + data.sig + '&token=' + escape(data.token) + '&allow_source=true&allow_audio_only=true&p=' + Math.round(Math.random() * 1e7)).always(function() {
            app.loadingStream = null;
        }).done(function(data) {
            app.$loading.hide();
            var qualities = extractQualities(data);
            app.play(qualities[0].url);
        }).fail(function(xhr) {
            app.returnState();
            app.$player.hide();
            app.$loading.hide();
            app.showError(xhr.responseText);
        });
    }).fail(function(xhr) {
        app.returnState();
        app.$player.hide();
        app.$loading.hide();
        app.showError(xhr.responseText);
    });
};
app.playVideo = function(id) {
    app.setState(constants.STATE_WATCH);
    app.$player.show();
    app.showLoading(constants.LOADING);
    $.get('http://api.twitch.tv/api/vods/' + id + '/access_token', function(data) {
        $.get('http://usher.ttvnw.net/vod/' + id + '.m3u8?player_backend=html5&nauthsig=' + data.sig + '&nauth=' + escape(data.token) + '&allow_source=true&allow_spectre=true&p=' + Math.round(Math.random() * 1e7), function(data) {
            app.$loading.hide();
            var qualities = extractQualities(data);
            app.play(qualities[0].url);
        }).error(function(error) {
            app.$player.hide();
            app.$loading.hide();
            app.showError('ERROR!!!');
        });
    }, 'json').error(function(error) {
        app.$player.hide();
        app.$loading.hide();
        app.showError('ERROR!!!');
    });
};
app.play = function(url) {
    console.log(url);
    webapis.avplay.stop();
    webapis.avplay.open(url);
    webapis.avplay.setListener({
        onbufferingstart: function() {
            app.showLoading(messages.BUFFERING + ' 0%');
        },
        onbufferingprogress: function(percent) {
            app.showLoading(messages.BUFFERING + ' ' + percent + '%');
        },
        onbufferingcomplete: function() {
            app.$loading.hide();
        },
        oncurrentplaytime: function(currentTime) {},
        onevent: function(eventType, eventData) {
            console.log("event type: " + eventType + ", data: " + eventData);
            if (eventType == 'PLAYER_MSG_RESOLUTION_CHANGED') {
                console.log("Mudou de Qualidade");
            }
        },
        onerror: function(error) {
            console.log("error: " + error);
            if (error == 'PLAYER_ERROR_CONNECTION_FAILED') {
                console.log("Closing stream from eventType == 'PLAYER_ERROR_CONNECTION_FAILED'");
                // SceneSceneBrowser.errorNetwork = true;
                // SceneSceneChannel.shutdownStream();
            }
        },
        onsubtitlechange: function(duration, text, data3, data4) {},
        ondrmevent: function(drmEvent, drmData) {},
        onstreamcompleted: function() {}
    });
    webapis.avplay.setDisplayRect(0, 0, $(window).width(), $(window).height());
    webapis.avplay.prepare();
    webapis.avplay.play();
};
app.showLoading = function(text) {
    app.$loadingText.text(text);
    app.$loading.show();
};
app.showError = function(text) {
    if (app.state !== constants.STATE_EXIT) {
        app.$errorText.text(text);
        app.$error.show();
        app.returnStack.push(app.state);
        app.state = constants.STATE_ERROR;
        app.$buttonCloseError.addClass('selected');
    }
};
app.hideError = function() {
    app.$error.hide();
    app.state = app.returnStack.pop();
};
app.hideExit = function() {
    app.$exitDialog.hide();
    app.state = app.returnStack.pop();
};
app.hasMoreResults = true;
app.loadingMoreResults = null;
app.loadMore = function() {
    if (app.hasMoreResults && !app.loadingMoreResults) {
        app.loadingMoreResults = app.getLiveChannels(66, app.areas[constants.AREA_RESULTS].count, function() {
            app.loadingMoreResults = null;
        });
    }
}
app.refreshing = null;
app.refresh = function(force) {
    if (app.refreshing && force) {
        app.refreshing.abort();
        app.refreshing = null;
    }
    if (!app.refreshing) {
        if (app.loadingMoreResults) {
            app.loadingMoreResults.abort();
            app.loadingMoreResults = null;
        }
        app.$selectBox.removeClass('selected');
        app.showLoading(constants.LOADING);
        app.clearItems();
        app.areas[constants.AREA_RESULTS].count = 0;
        app.areas[constants.AREA_RESULTS].columns = 0;
        app.areas[constants.AREA_RESULTS].x = 0;
        app.areas[constants.AREA_RESULTS].y = 0;
        if (app.page == constants.PAGE_LIVE_CHANNELS) {
            app.refreshing = app.getLiveChannels(33, 0, function() {
                app.refreshing = null;
            });
        } else if (app.page == constants.PAGE_VIDEOS) {
            app.refreshing = app.getVideos(33, 0, function() {
                app.refreshing = null;
            });
        }
    }
};
app.twitchApiOptions = {
    method: 'GET',
    dataType: 'json',
    accepts: {
        json: 'application/vnd.twitchtv.v5+json'
    },
    
};
app.getLiveChannels = function(limit, offset, callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/streams?limit=' + limit + '&offset=' + offset, 
        success: function(response) {
            console.log(response);
            var i, ii, x, y, stream, $newCell;
            var countResults = app.areas[constants.AREA_RESULTS].count;
            var countRows = app.areas[constants.AREA_RESULTS].rows;
            var $newColumn = app.$itemsContainer.find('.column:last-child');
            for (i = 0; i < response.streams.length; i++) {
                ii = i + countResults;
                if ((y = ii % countRows) == 0) {
                    $newColumn = $('<div class="column"/>');
                    app.$itemsContainer.append($newColumn);
                    app.areas[constants.AREA_RESULTS].columns++;
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
                if (ii == 0 && app.activeArea == constants.AREA_RESULTS) {
                    app.showItem($newCell);
                }
            }
            app.areas[constants.AREA_RESULTS].count += response.streams.length;
            app.$loading.hide();
            app.$items.mCustomScrollbar('update');
            app.timeoutAutoHide = setTimeout(function() {
                app.$itemsContainer.addClass('mCS-autoHide');
            }, 2000);
            app.hasMoreResults = response.streams.length > 0;
            if (typeof callback == 'function') {
                callback();
            }
        }
    }));
};
app.getVideos = function(limit, offset, callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/videos/top?limit=' + limit + '&offset=' + offset, 
        success: function(response) {
            console.log(response);
            var i, ii, x, y, vod, $newCell;
            var countResults = app.areas[constants.AREA_RESULTS].count;
            var countRows = app.areas[constants.AREA_RESULTS].rows;
            var $newColumn = app.$itemsContainer.find('.column:last-child');
            for (i = 0; i < response.vods.length; i++) {
                ii = i + countResults;
                if ((y = ii % countRows) == 0) {
                    $newColumn = $('<div class="column"/>');
                    app.$itemsContainer.append($newColumn);
                    app.areas[constants.AREA_RESULTS].columns++;
                }
                x = (ii - y) / countRows;
                vod = response.vods[i];
                $newCell = $('<div class="cell" id="item-' + x + '-' + y + '">\
                    <i class="fa fa-fw fa-twitch"></i>\
                    <img src="' + vod.preview.large + '" onload="imageLoaded(this)" onerror="imageFailed(this)">\
                    <div class="stream-channel-name">' + vod.channel.display_name + '</div>\
                </div>');
                $newCell.data('channel', vod.channel.name);
                $newCell.data('channel-name', vod.channel.display_name);
                $newCell.data('viewers', vod.views);
                $newCell.data('game', vod.game);
                $newCell.data('status', vod.title);
                $newCell.data('vod-id', vod._id.toString().replace(/[^0-9]/g, ''));
                $newColumn.append($newCell);
                if (ii == 0 && app.activeArea == constants.AREA_RESULTS) {
                    app.showItem($newCell);
                }
            }
            app.areas[constants.AREA_RESULTS].count += response.vods.length;
            app.$loading.hide();
            app.$items.mCustomScrollbar('update');
            app.timeoutAutoHide = setTimeout(function() {
                app.$itemsContainer.addClass('mCS-autoHide');
            }, 2000);
            app.hasMoreResults = response.vods.length > 0;
            if (typeof callback == 'function') {
                callback();
            }
        }
    }));
};
app.timeoutAutoHide = null;
app.timeoutSelect = null;
app.showItem = function ($element) {
    var vh = $(window).height() / 100;
    var scrollLeft = app.$itemsContainer.position().left;
    var left = -scrollLeft;
    if ($element.position().left - 2 * vh + scrollLeft < 0) {
        left = Math.round($element.position().left - 2 * vh);
    } else if ($element.position().left + scrollLeft + $element.width() + 2 * vh - $(window).width() > 0) {
        left = Math.round($element.position().left + $element.width() + 2 * vh - $(window).width());
    }
    left = Math.max(0, left);
    var change = Math.abs(left + scrollLeft);
    var selectPosition = app.$selectBox.offset();
    if (change > 0) {
        app.$items.mCustomScrollbar('scrollTo', left, {
            scrollInertia: 0,
            timeout: 0
        });
    }
    app.$selectBox.find('.stream-channel-name').html($element.data('channel-name'));
    app.$selectBox.find('.stream-viewers').html('<i class="fa fa-eye"></i> ' + 
            $element.data('viewers').toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator));
    app.$selectBox.find('.game-name').html($element.data('game'));
    app.$selectBox.find('.channel-status').html($element.data('status'));
    app.$selectBox.addClass('selected');
    app.$selectBox.width($element.width());
    app.$selectBox.height($element.height());
    var newOffset = $element.offset();
    newOffset.left -= left + scrollLeft;
    app.$selectBox.offset(newOffset);
    if (app.timeoutAutoHide) {
        clearTimeout(app.timeoutAutoHide);
        app.timeoutAutoHide = null;
    }
    app.$items.removeClass('mCS-autoHide');
    app.timeoutAutoHide = setTimeout(function() {
        app.$items.addClass('mCS-autoHide');
    }, 2000);
    if (app.timeoutSelect) {
        clearTimeout(app.timeoutSelect);
        app.timeoutSelect = null;
    }
    $('.selected').filter('.cell').removeClass('selected');
    $element.addClass('selected');
};
app.clearItems = function() {
    app.$itemsContainer.empty();
    app.$itemsContainer.css('width', 0);
    app.$items.mCustomScrollbar('update');
};
app.selectPage = function(page) {
    app.page = page;
    app.clearItems();
    $('.filters').hide();
    app.areas[constants.AREA_FILTERS] = {
        x: 0,
        columns: 0
    };
    if (page === constants.PAGE_LIVE_CHANNELS) {
        app.$filters = app.$streamFilters;
        app.$streamFilters.show();
        app.areas[constants.AREA_FILTERS] = app.areas[constants.AREA_STREAM_FILTERS];
    } else if (page === constants.PAGE_VIDEOS) {
        app.$filters = app.$videoFilters;
        app.$videoFilters.show();
        app.areas[constants.AREA_FILTERS] = app.areas[constants.AREA_VIDEO_FILTERS];
    }
    app.updateHints();
    app.refresh(true);
};
app.changePage = function() {
    app.selectVideosPage();
};
app.updateHints = function() {
    if (app.page === constants.PAGE_LIVE_CHANNELS) {
        app.$hintChangePageText.text(messages.HINT_VIDEOS);
        app.changePage = function() {
            app.selectVideosPage();
        };
    } else {
        app.$hintChangePageText.text(messages.HINT_LIVE_CHANNELS);
        app.changePage = function() {
            app.selectActiveChannelsPage();
        };
    }
};
app.activatePagesArea = function() {
    app.activeArea = constants.AREA_PAGES;
    app.showCurrentPage();
};
app.showPage = function($page, select) {
    app.$pages.find('.active').removeClass('active');
    $page.addClass('active');
    app.setUnderscore();
    if (app.activeArea === constants.AREA_PAGES) {
        app.clearSelection();
        $page.addClass('selected');
    }
    if (select) {
        app.selectPage($page.data('page'));
    }
};
app.showCurrentPage = function(select) {
    $page = $(app.$pages.find('.page').get(app.areas[constants.AREA_PAGES].x));
    app.showPage($page, select);
};
app.selectActiveChannelsPage = function() {
    app.areas[constants.AREA_PAGES].x = 0;
    app.showPage(app.$liveChannelsPage, true);
};
app.selectVideosPage = function() {
    app.areas[constants.AREA_PAGES].x = 1;
    app.showPage(app.$videosPage, true);
};
app.activateFiltersArea = function() {
    app.activeArea = constants.AREA_FILTERS;
    app.showCurrentFilter();
};
app.showCurrentFilter = function() {
    app.clearSelection();
    var x = app.areas[constants.AREA_FILTERS].x;
    app.$filters.find('.filter').get(x).classList.add('selected');
}
app.activateItemsArea = function() {
    app.activeArea = constants.AREA_RESULTS;
    app.clearSelection();
    var $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
    app.showItem($activeCell);
};
app.clearSelection = function() {
    $('.selected').removeClass('selected');
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

function imageLoaded(img) {
    img.classList.add('loaded');
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

/*tizen.tvinputdevice.registerKey("Tools");
tizen.tvinputdevice.registerKey("MediaPlayPause");
tizen.tvinputdevice.registerKey("MediaPlay");
tizen.tvinputdevice.registerKey("MediaPause");
tizen.tvinputdevice.registerKey("MediaStop");
tizen.tvinputdevice.registerKey("ColorF0Red");
tizen.tvinputdevice.registerKey("ColorF1Green");
tizen.tvinputdevice.registerKey("ColorF2Yellow");
tizen.tvinputdevice.registerKey("ColorF3Blue");*/

window.onload = app.init;