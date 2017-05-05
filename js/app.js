var app = {}
app.page = constants.PAGE_LIVE_CHANNELS;
app.returnStack = [];
app.state = constants.STATE_BROWSE;
app.activeArea = constants.AREA_PAGES;
app.areas = {};
app.areas[constants.AREA_RESULTS] = {
    count: 0,
    columns: 0,
    rows: 3,
    x: 0,
    y: 0
};
app.areas[constants.AREA_FILTERS] = {
    columns: 0,
    x: 0
};
app.areas[constants.AREA_STREAM_FILTERS] = {
    columns: 0,
    x: 0
};
app.areas[constants.AREA_VIDEO_FILTERS] = {
    columns: 0,
    x: 0
};
app.areas[constants.AREA_PAGES] = {
    columns: 0,
    x: 0
};
app.areas[constants.AREA_GAME_RESULTS] = {
    columns: 0,
    rows: 2,
    x: 0,
    y: 0
};
app.areas[constants.AREA_LANGUAGES] = {
    columns: 0,
    rows: 13,
    x: 0,
    y: 1
};
app.areas[constants.AREA_STREAM_TYPE] = {
    columns: 1,
    rows: 3,
    x: 0,
    y: 0
};
app.filters = {
    game: null,
    channels: null,
    languages: [],
    streamType: null,
    period: null,
    videoType: null,
    sort: null
};
app.laguagesFilter = {
    clear: messages.LANGUAGE_CLEAR,
    ru: 'Русский',
    en: 'English',
    da: 'Dansk',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    hu: 'Magyar',
    nl: 'Nederlands',
    no: 'Norsk',
    pl: 'Polski',
    pt: 'Português',
    sk: 'Slovenčina',
    fi: 'Suomi',
    sv: 'Svenska',
    vi: 'Tiếng Việt',
    tr: 'Türkçe',
    cs: 'Čeština',
    el: 'Ελληνικά',
    bg: 'Български',
    ar: 'العربية',
    th: 'ภาษาไทย',
    zh: '中文',
    ja: '日本語',
    ko: '한국어'
};
app.initLangugesFilter = function() {
    var $items = $('#language-items');
    var i = 0, code, text, countRows = app.areas[constants.AREA_LANGUAGES].rows;
    for (code in app.laguagesFilter) {
        text = app.laguagesFilter[code];
        if ((y = i % countRows) == 0) {
            $newColumn = $('<div class="filter-list"/>');
            $items.append($newColumn);
            app.areas[constants.AREA_LANGUAGES].columns++;
        }
        x = (i - y) / countRows;
        if (code == 'clear') {
            $newCell = $('<div class="filter-list-item" id="language-item-' + x + '-' + y + '">\
                <div class="text">' + text + '</div>\
            </div>');
        } else {
            $newCell = $('<div class="filter-list-item" id="language-item-' + x + '-' + y + '">\
                <input type="checkbox">\
                <div class="text">' + text + '</div>\
            </div>');
        }
        $newCell.data('code', code);
        if (i == 1) {
            $newCell.addClass('selected');
        }
        $newColumn.append($newCell);
        i++;
    }
};
app.customScrollbarOptions = {
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
    documentTouchScroll: false
};
app.translateLayout = function() {
    // pages
    $('#page-live-channels').find('.text').text(messages.PAGE_LIVE_CHANNELS);
    $('#page-videos').find('.text').text(messages.PAGE_VIDEOS);
    // stream filters
    $('#stream-filter-game').find('.text').text(messages.FILTER_STREAM_GAME);
    $('#stream-filter-channels').find('.text').text(messages.FILTER_STREAM_CHANNELS);
    $('#stream-filter-languages').find('.text').text(messages.FILTER_STREAM_LANGUAGES);
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
    // select game
    app.$selectGame.find('.caption > .text').text(messages.GAME_SELECT);
    app.$gameSearchInput.attr('placeholder', messages.GAME_SEARCH);
    // select channels
    app.$selectChannels.find('.caption > .text').text(messages.CHANNELS_SELECT);
    app.$channelsSearchInput.attr('placeholder', messages.CHANNELS_SEARCH);
    $('#channels-clear').find('.text').text(messages.CHANNELS_CLEAR);
    // select stream type
    app.$selectStreamType.find('.caption > .text').text(messages.STREAM_TYPE_SELECT);
    $('#stream-type-item-0-0').text(messages.STREAM_TYPE_LIVE);
    $('#stream-type-item-0-1').text(messages.STREAM_TYPE_PLAYLIST);
    $('#stream-type-item-0-2').text(messages.STREAM_TYPE_ALL);
    // select language
    app.$selectLanguage.find('.caption > .text').text(messages.LANGUAGE_SELECT);
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
app.$main = null;
app.$loading = null;
app.$error = null;
app.$errorContent = null;
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
app.$selectGame = null;
app.$gameItems = null;
app.$gameItemsContainer = null;
app.$gameSelectBox = null;
app.$gameSearchInput = null;
app.$gameClear = null;
app.$selectLanguage = null;
app.$selectStreamType = null;
app.$selectChannels = null;
app.$channelsItems = null;
app.$channelsItemsContainer = null;
app.$channelsSearchInput = null;
app.init = function() {
    app.$main = $('#main');
    app.$loading = $('#loading-wrapper');
    app.$error = $('#error-dialog');
    app.$errorContent = $('#error-dialog').find('.content');
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
    app.$selectGame = $('#select-game');
    app.$gameItems = $('#game-items');
    app.$gameSelectBox = $('#select-game-box');
    app.$gameSearchInput = $('#game-search-input');
    app.$gameClear = $('#game-clear');
    app.$selectLanguage = $('#select-language');
    app.$selectStreamType = $('#select-stream-type');
    app.$selectChannels = $('#select-channels');
    app.$channelsItems = $('#channels-items');
    app.$channelsSearchInput = $('#channels-search-input');
    app.translateLayout();
    app.setUnderscore();
    app.areas[constants.AREA_PAGES].columns = app.$pages.find('.page').length;
    app.areas[constants.AREA_STREAM_FILTERS].columns = app.$streamFilters.find('.filter').length;
    app.areas[constants.AREA_VIDEO_FILTERS].columns = app.$videoFilters.find('.filter').length;
    app.areas[constants.AREA_FILTERS] = app.areas[constants.AREA_STREAM_FILTERS];
    $('body').addClass('init');
    app.initLangugesFilter();
    app.$items.mCustomScrollbar($.extend({}, app.customScrollbarOptions, {
        callbacks: {
            onTotalScroll: app.loadMore,
            onTotalScrollOffset: $(window).width() * 0.5
        }
    }));
    app.$itemsContainer = app.$items.find('.mCSB_container');
    var lastGameQuery = '';
    app.$gameSearchInput.on('keyup', function(e) {
        var query = $.trim(app.$gameSearchInput.val());
        if (query == lastGameQuery) return;
        lastGameQuery = query;
        if (app.searchGameTimeout) {
            clearTimeout(app.searchGameTimeout);
        }
        if (app.loadingGames) {
            app.loadingGames.abort();
            app.loadingGames = null;
        }
        app.searchGameTimeout = setTimeout(function() {
            app.searchGameTimeout = null;
            app.prepareGamesSearch();
            if (query) {
                app.loadingGames = app.getGamesSearch(query, function() {
                    app.loadingGames = null;
                });
            } else {
                app.loadingGames = app.getGames(function() {
                    app.loadingGames = null;
                });
            }
        }, 500);
    });
    var lastChannelQuery = '';
    app.$channelsSearchInput.on('keyup', function(e) {
        var query = $.trim(app.$channelsSearchInput.val());
        if (query == lastChannelQuery) return;
        lastChannelQuery = query;
        /*return $.ajax($.extend({}, app.twitchApiOptions, {
            url: 'https://api.twitch.tv/kraken/search/channels?limit=100&query=' + encodeURIComponent(query)
        })).done(function(response) {
            console.log(response);
        });*/
    });
    document.addEventListener('visibilitychange', function() {
        if (window.webapis && app.state == constants.STATE_WATCH) {
            if (document.hidden) {
                webapis.avplay.suspend();
            } else {
                webapis.avplay.restore();
            }
        }
    });
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case keys.KEY_LEFT:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea === constants.AREA_RESULTS) {
                        app.navigateItems(keys.KEY_LEFT);
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
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_LEFT);
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_LEFT);
                } else if (app.state === constants.STATE_EXIT) {
                    var $exitButton = $('#button-exit');
                    if (!$exitButton.hasClass('selected')) {
                        app.clearSelection(app.$exitDialog);
                        $exitButton.addClass('selected');
                    }
                }
                break;
            case keys.KEY_UP:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        app.navigateItems(keys.KEY_UP, function() {
                            if (app.areas[constants.AREA_FILTERS].columns > 0) {
                                app.activateFiltersArea();
                            } else {
                                app.activatePagesArea();
                            }
                        });
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        app.activatePagesArea();
                    }
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_UP, function() {
                            app.activateGameSearchArea();
                        });
                    } else if (app.activeArea == constants.AREA_GAME_SEARCH && app.filters.game) {
                        app.$gameSearchInput.blur();
                        app.activateGameClearArea();
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_STREAM_TYPE) {
                    app.navigateStreamTypeItems(keys.KEY_UP);
                }
                break;
            case keys.KEY_RIGHT:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        app.navigateItems(keys.KEY_RIGHT);
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
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_RIGHT);
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_RIGHT);
                } else if (app.state === constants.STATE_EXIT) {
                    var $cancelButton = $('#button-cancel');
                    if (!$cancelButton.hasClass('selected')) {
                        app.clearSelection(app.$exitDialog);
                        $cancelButton.addClass('selected');
                    }
                }
                break;
            case keys.KEY_DOWN:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        app.navigateItems(keys.KEY_DOWN);
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        if (app.areas[constants.AREA_RESULTS].count > 0) {
                            app.activateItemsArea();
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_FILTERS].columns > 0) {
                            app.activateFiltersArea();
                        } else {
                            app.activateItemsArea();
                        }
                    }
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_DOWN);
                    } else if (app.activeArea == constants.AREA_GAME_SEARCH) {
                        if (app.areas[constants.AREA_GAME_RESULTS].columns > 0) {
                            app.$gameSearchInput.blur();
                            app.activateGameItemsArea();
                        }
                    } else if (app.activeArea == constants.AREA_GAME_CLEAR) {
                        app.activateGameSearchArea();
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_STREAM_TYPE) {
                    app.navigateStreamTypeItems(keys.KEY_DOWN);
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
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        app.selectCurrentFilter();
                    }
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_SEARCH) {
                        app.$gameSearchInput.focus();
                    } else if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        var $selectedItem = $('#game-item-' + app.areas[constants.AREA_GAME_RESULTS].x + '-' + app.areas[constants.AREA_GAME_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            app.selectGame($selectedItem.data('name'));
                            app.returnState();
                            app.refresh(true);
                        }
                    } else if (app.activeArea == constants.AREA_GAME_CLEAR) {
                        app.clearGame();
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNELS) {
                    if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                        app.$channelsSearchInput.focus();
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    var $selectedItem = $('#language-item-' + app.areas[constants.AREA_LANGUAGES].x + '-' + app.areas[constants.AREA_LANGUAGES].y);
                    if ($selectedItem.length > 0) {
                        app.toggleLanguage($selectedItem);
                        if (app.timeoutRefresh) {
                            clearTimeout(app.timeoutRefresh);
                        }
                        app.timeoutRefresh = setTimeout(function() {
                            app.timeoutRefresh = null;
                            app.refresh(true);
                        }, 500);
                    }
                } else if (app.state === constants.STATE_SELECT_STREAM_TYPE) {
                    var $selectedItem = $('#stream-type-item-' + app.areas[constants.AREA_STREAM_TYPE].x + '-' + app.areas[constants.AREA_STREAM_TYPE].y);
                    if ($selectedItem.length > 0) {
                        app.selectStreamType($selectedItem);
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_ERROR) {
                    app.returnState();
                } else if (app.state === constants.STATE_EXIT) {
                    var type = app.$exitDialog.find('.selected').data('type');
                    if (type === constants.BUTTON_TYPE_EXIT) {
                        if (window.tizen) {
                            tizen.application.getCurrentApplication().exit();
                        }
                    } else if (type === constants.BUTTON_TYPE_CANCEL) {
                        app.returnState();
                    }
                }
                break;
            case 27:
            case keys.KEY_RETURN:
                app.returnState();
                break;
            case keys.KEY_DONE:
            case keys.KEY_CANCEL:
                if (app.activeArea == constants.AREA_GAME_SEARCH) {
                    app.$gameSearchInput.blur();
                }
                if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                    app.$channelsSearchInput.blur();
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
    $(window).resize(function() {
        if (app.state === constants.STATE_SELECT_GAME) {
            app.$selectGame.css('z-index', 500);
            app.$gameItems.mCustomScrollbar('update');
        } else if (app.state === constants.STATE_SELECT_CHANNELS) {
            app.$selectChannels.css('z-index', 500);
            app.$channelsItems.mCustomScrollbar('update');
        }
        app.$items.mCustomScrollbar('update');
    });
};
app.getNewActiveCell = function(prefix, area, keyCode, initUpperArea) {
    switch (keyCode) {
        case keys.KEY_LEFT:
            var $newActiveCell, $activeCell = $('#' + prefix + '-' + app.areas[area].x + '-' + app.areas[area].y);
            if ($activeCell.length > 0 && app.areas[area].x > 0) {
                $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x - 1) + '-' + app.areas[area].y);
                if ($newActiveCell.length > 0) {
                    app.areas[area].x--;
                    return $newActiveCell;
                }
            }
            break;
        case keys.KEY_UP:
            var $newActiveCell, $activeCell = $('#' + prefix + '-' + app.areas[area].x + '-' + app.areas[area].y);
            if ($activeCell.length > 0 && app.areas[area].y > 0) {
                $newActiveCell = $('#' + prefix + '-' + app.areas[area].x + '-' + (app.areas[area].y - 1));
                if ($newActiveCell.length > 0) {
                    app.areas[area].y--;
                    return $newActiveCell;
                }
            } else if (typeof initUpperArea === 'function') {
                initUpperArea();
            }
            break;
        case keys.KEY_RIGHT:
            var $newActiveCell, $activeCell = $('#' + prefix + '-' + app.areas[area].x + '-' + app.areas[area].y);
            if ($activeCell.length > 0 && app.areas[area].x < app.areas[area].columns - 1) {
                $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x + 1) + '-' + app.areas[area].y);
                if ($newActiveCell.length > 0) {
                    app.areas[area].x++;
                    return $newActiveCell;
                }
            }
            break;
        case keys.KEY_DOWN:
            var $newActiveCell, $activeCell = $('#' + prefix + '-' + app.areas[area].x + '-' + app.areas[area].y);
            if ($activeCell.length > 0 && app.areas[area].y < app.areas[area].rows - 1) {
                $newActiveCell = $('#' + prefix + '-' + app.areas[area].x + '-' + (app.areas[area].y + 1));
                if ($newActiveCell.length > 0) {
                    app.areas[area].y++;
                    return $newActiveCell;
                }
            }
            break;
    }
    
    return null;
};
app.navigateItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('item', constants.AREA_RESULTS, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.showStreamItem($newActiveCell);
    }
};
app.navigateGameItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('game-item', constants.AREA_GAME_RESULTS, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.showGameItem($newActiveCell);
    }
};
app.navigateLanguageItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('language-item', constants.AREA_LANGUAGES, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectLanguage);
        $newActiveCell.addClass('selected');
    }
};
app.navigateStreamTypeItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('stream-type-item', constants.AREA_STREAM_TYPE, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectStreamType);
        $newActiveCell.addClass('selected');
    }
};
app.setState = function(state, callback) {
    app.returnStack.push({
        state: app.state,
        area: app.activeArea,
        callback: callback
    });
    app.state = state;
};
app.returnState = function() {
    if (app.returnStack.length > 0) {
        var obj = app.returnStack.pop();
        app.state = obj.state;
        app.activeArea = obj.area;
        if (typeof obj.callback === 'function') {
            obj.callback();
        }
    } else {
        app.$exitDialog.show();
        app.setState(constants.STATE_EXIT, app.hideExit);
    }
};
app.loadingStream = null;
app.loadingErrorHandler = function(xhr, textStatus, errorThrown) {
    if (errorThrown !== 'abort') {
        var message = messages.ERROR_LOADING_FAILED;
        if (xhr.status > 0) {
            try {
                var response = $.parseJSON(xhr.responseText);
                message = message + '<br>' + response.message;
            } catch (e) {
            }
        }
        app.showLoadingError(message);
    }
}
app.showLoadingError = function(message) {
    app.returnState();
    app.$player.hide();
    app.$loading.hide();
    app.showError(message);
};
app.playStream = function(channelName) {
    app.setState(constants.STATE_WATCH, app.stop);
    app.$player.show();
    app.showLoading(messages.LOADING);
    app.loadingStream = $.get('https://api.twitch.tv/kraken/streams/?channel=' + channelName + '&stream_type=all', 'json').always(function() {
        app.loadingStream = null;
    }).done(function(data) {
        if (data._total === 0) {
            app.showLoadingError(messages.ERROR_STREAM_IS_OFFLINE);
        } else {
            app.loadingStream = $.get('https://api.twitch.tv/api/channels/' + channelName + '/access_token', 'json').always(function() {
                app.loadingStream = null;
            }).done(function(data) {
                app.loadingStream = $.get('http://usher.twitch.tv/api/channel/hls/' + channelName + '.m3u8?player_backend=html5&type=any&sig=' + data.sig + '&token=' + escape(data.token) + '&allow_source=true&allow_spectre=true&allow_audio_only=true&p=' + Math.round(Math.random() * 1e7)).always(function() {
                    app.loadingStream = null;
                }).done(function(data) {
                    app.$loading.hide();
                    var qualities = extractQualities(data);
                    app.play(qualities[0].url);
                }).fail(app.loadingErrorHandler);
            }).fail(app.loadingErrorHandler);
        }
    }).fail(app.loadingErrorHandler);
};
app.playVideo = function(id) {
    app.setState(constants.STATE_WATCH, app.stop);
    app.$player.show();
    app.showLoading(messages.LOADING);
    app.loadingStream = $.get('https://api.twitch.tv/api/vods/' + id + '/access_token', 'json').always(function() {
        app.loadingStream = null;
    }).done(function(data) {
        app.loadingStream = $.get('http://usher.ttvnw.net/vod/' + id + '.m3u8?player_backend=html5&nauthsig=' + data.sig + '&nauth=' + encodeURIComponent(data.token) + '&allow_source=true&allow_spectre=true&p=' + Math.round(Math.random() * 1e7)).always(function() {
            app.loadingStream = null;
        }).done(function(data) {
            app.$loading.hide();
            var qualities = extractQualities(data);
            app.play(qualities[0].url);
        }).fail(app.loadingErrorHandler);
    }).fail(app.loadingErrorHandler);
};
app.play = function(url) {
    if (window.webapis) {
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
            oncurrentplaytime: function(currentTime) {
            },
            onevent: function(eventType, eventData) {
                console.log("event type: " + eventType + ", data: " + eventData);
                if (eventType == 'PLAYER_MSG_RESOLUTION_CHANGED') {
                    console.log("Mudou de Qualidade");
                }
            },
            onerror: function(error) {
                var message = messages.ERROR_LOADING_FAILED;
                if (error === 'PLAYER_ERROR_CONNECTION_FAILED') {
                    message = messages.ERROR_CONNECTION_FAIL;
                }
                app.returnState();
                app.showError(message);
            },
            onsubtitlechange: function(duration, text) {
            },
            ondrmevent: function(drmEvent, drmData) {
            },
            onstreamcompleted: function() {
                webapis.avplay.stop();
            }
        });
        webapis.avplay.setDisplayRect(0, 0, $(window).width(), $(window).height());
        webapis.avplay.prepare();
        webapis.avplay.play();
    }
};
app.stop = function() {
    if (window.webapis) {
        webapis.avplay.stop();
    }
    app.$player.hide();
    app.$loading.hide();
    if (app.loadingStream) {
        app.loadingStream.abort();
        app.loadingStream = null;
    }
};
app.showLoading = function(text) {
    app.$loadingText.text(text);
    app.$loading.show();
};
app.showError = function(text) {
    if (app.state !== constants.STATE_EXIT) {
        app.$errorText.html(text);
        app.$error.show();
        var height = app.$errorContent.height();
        app.$errorContent.css('margin-top', -Math.round(height / 2));
        app.setState(constants.STATE_ERROR, app.hideError);
        app.$buttonCloseError.addClass('selected');
    }
};
app.hideError = function() {
    app.$error.hide();
};
app.hideExit = function() {
    app.$exitDialog.hide();
};
app.hasMoreResults = true;
app.loadingMoreResults = null;
app.loadMore = function() {
    if (app.hasMoreResults && !app.loadingMoreResults) {
        if (app.page === constants.PAGE_LIVE_CHANNELS) {
            app.loadingMoreResults = app.getLiveChannels(66, app.areas[constants.AREA_RESULTS].count, function() {
                app.loadingMoreResults = null;
            });
        } else if (app.page === constants.PAGE_VIDEOS) {
            app.loadingMoreResults = app.getVideos(66, app.areas[constants.AREA_RESULTS].count, function() {
                app.loadingMoreResults = null;
            });
        }
    }
}
app.timeoutRefresh = null;
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
        app.showLoading(messages.LOADING);
        app.clearItems(app.$items, app.$itemsContainer);
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
    var url = 'https://api.twitch.tv/kraken/streams?limit=' + limit + '&offset=' + offset;
    if (app.filters.game) {
        url += '&game=' + encodeURIComponent(app.filters.game);
    }
    if (app.filters.channels) {
        url += '&channels=' + encodeURIComponent(app.filters.channels);
    }
    if (app.filters.languages.length > 0) {
        url += '&language=' + encodeURIComponent(app.filters.languages.join(','));
    }
    if (app.filters.streamType) {
        url += '&stream_type=' + encodeURIComponent(app.filters.streamType);
    }
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: url
    })).done(function(response) {
        console.log(response);
        if (response.streams.length > 0) {
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
                    app.showStreamItem($newCell);
                }
            }
            app.areas[constants.AREA_RESULTS].count += response.streams.length;
        } else if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$items.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$items);
        app.hasMoreResults = response.streams.length > 0;
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.getVideos = function(limit, offset, callback) {
    var url = 'https://api.twitch.tv/kraken/videos/top?limit=' + limit + '&offset=' + offset;
    if (app.filters.game) {
        url += '&game=' + encodeURIComponent(app.filters.game);
    }
    if (app.filters.period) {
        url += '&period=' + encodeURIComponent(app.filters.period);
    }
    if (app.filters.languages.length > 0) {
        url += '&language=' + encodeURIComponent(app.filters.languages.join(','));
    }
    if (app.filters.videoType) {
        url += '&type=' + encodeURIComponent(app.filters.videoType);
    }
    if (app.filters.sort) {
        url += '&sort=' + encodeURIComponent(app.filters.sort);
    }
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: url
    })).done(function(response) {
        console.log(response);
        if (response.vods.length > 0) {
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
                    app.showStreamItem($newCell);
                }
            }
            app.areas[constants.AREA_RESULTS].count += response.vods.length;
        } else if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$items.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$items);
        app.hasMoreResults = response.vods.length > 0;
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.getGames = function(callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/games/top?limit=100'
    })).done(function(response) {
        console.log(response);
        var i, x, y, game, $newCell, $newColumn;
        var countRows = app.areas[constants.AREA_GAME_RESULTS].rows;
        for (i = 0; i < response.top.length; i++) {
            if ((y = i % countRows) == 0) {
                $newColumn = $('<div class="column"/>');
                app.$gameItemsContainer.append($newColumn);
                app.areas[constants.AREA_GAME_RESULTS].columns++;
            }
            x = (i - y) / countRows;
            game = response.top[i];
            $newCell = $('<div class="cell game-cell" id="game-item-' + x + '-' + y + '">\
                <i class="fa fa-fw fa-twitch"></i>\
                <img src="' + game.game.box.large + '" onload="imageLoaded(this)" onerror="imageFailed(this)">\
                <div class="game-name ellipsed">' + game.game.name + '</div>\
            </div>');
            $newCell.data('viewers', game.viewers);
            $newCell.data('channels', game.channels);
            $newCell.data('name', game.game.name);
            $newColumn.append($newCell);
            if (i == 0 && app.activeArea == constants.AREA_GAME_RESULTS) {
                app.showGameItem($newCell);
            }
        }
        app.$gameItems.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$gameItems);
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.getGamesSearch = function(query, callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/search/games/?query=' + encodeURIComponent(query)
    })).done(function(response) {
        console.log(response);
        if (response.games) {
            var i, x, y, game, $newCell, $newColumn;
            var countRows = app.areas[constants.AREA_GAME_RESULTS].rows;
            for (i = 0; i < response.games.length; i++) {
                if ((y = i % countRows) == 0) {
                    $newColumn = $('<div class="column"/>');
                    app.$gameItemsContainer.append($newColumn);
                    app.areas[constants.AREA_GAME_RESULTS].columns++;
                }
                x = (i - y) / countRows;
                game = response.games[i];
                $newCell = $('<div class="cell game-cell" id="game-item-' + x + '-' + y + '">\
                    <i class="fa fa-fw fa-twitch"></i>\
                    <img src="' + game.box.large + '" onload="imageLoaded(this)" onerror="imageFailed(this)">\
                    <div class="game-name ellipsed">' + game.name + '</div>\
                </div>');
                $newCell.data('popularity', game.popularity);
                $newCell.data('name', game.name);
                $newColumn.append($newCell);
                if (i == 0 && app.activeArea == constants.AREA_GAME_RESULTS) {
                    app.showGameItem($newCell);
                }
            }
        } else {
            app.$gameItemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$gameItems.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$gameItems);
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.showStreamItem = function($element) {
    app.$selectBox.find('.stream-channel-name').html($element.data('channel-name'));
    app.$selectBox.find('.stream-viewers').html('<i class="fa fa-eye"></i> ' + $element.data('viewers').toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator));
    app.$selectBox.find('.game-name').html($element.data('game') || '&nbsp;');
    app.$selectBox.find('.channel-status').html($element.data('status') || '&nbsp;');
    app.showItem($element, app.$items, app.$itemsContainer, app.$selectBox);
};
app.showGameItem = function($element) {
    var data;
    if ((data = $element.data('viewers')) !== undefined) {
        app.$gameSelectBox.find('.game-viewers').html('<i class="fa fa-eye"></i> ' + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator));
    } else {
        app.$gameSelectBox.find('.game-viewers').html('');
    }
    if ((data = $element.data('channels')) !== undefined) {
        app.$gameSelectBox.find('.game-channels').html('<i class="fa fa-video-camera"></i> ' + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator));
    } else {
        app.$gameSelectBox.find('.game-channels').html('');
    }
    if ((data = $element.data('popularity')) !== undefined) {
        app.$gameSelectBox.find('.game-channels').html('<i class="fa fa-fire"></i> ' + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator));
    } else {
        app.$gameSelectBox.find('.game-popularity').html('');
    }
    app.$gameSelectBox.find('.game-name').html($element.data('name'));
    app.showItem($element, app.$gameItems, app.$gameItemsContainer, app.$gameSelectBox);
};
app.showItem = function($element, $items, $itemsContainer, $selectBox) {
    var vh = $(window).height() / 100;
    var scrollLeft = $itemsContainer.position().left;
    var left = -scrollLeft;
    if ($element.position().left - 2 * vh + scrollLeft < 0) {
        left = Math.round($element.position().left - 2 * vh);
    } else if ($element.position().left + scrollLeft + $element.width() + 2 * vh - $(window).width() > 0) {
        left = Math.round($element.position().left + $element.width() + 2 * vh - $(window).width());
    }
    left = Math.max(0, left);
    var change = Math.abs(left + scrollLeft);
    var selectPosition = $selectBox.offset();
    if (change > 0) {
        $items.mCustomScrollbar('scrollTo', left, {
            scrollInertia: 0,
            timeout: 0
        });
    }
    $selectBox.addClass('selected');
    $selectBox.width($element.width());
    $selectBox.height($element.height());
    var newOffset = $element.offset();
    newOffset.left -= left + scrollLeft;
    newOffset.top = Math.round(newOffset.top);
    $selectBox.offset(newOffset);
    app.autoHideScrollbar($items);
    app.clearSelection($items);
    $element.addClass('selected');
};
app.timeoutAutoHide = null;
app.autoHideScrollbar = function($items) {
    if (app.timeoutAutoHide) {
        clearTimeout(app.timeoutAutoHide);
        app.timeoutAutoHide = null;
    }
    $items.removeClass('mCS-autoHide');
    app.timeoutAutoHide = setTimeout(function() {
        $items.addClass('mCS-autoHide');
    }, 1500);
};
app.clearItems = function($items, $container) {
    $container.empty();
    $container.css('width', 0);
    $items.mCustomScrollbar('update');
};
app.selectPage = function(page) {
    app.page = page;
    app.clearItems(app.$items, app.$itemsContainer);
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
    if (app.activeArea === constants.AREA_FILTERS) {
        app.showCurrentFilter();
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
        app.clearSelection(app.$main);
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
    app.clearSelection(app.$main);
    var x = app.areas[constants.AREA_FILTERS].x;
    app.$filters.find('.filter').get(x).classList.add('selected');
}
app.loadingGames = null;
app.searchGameTimeout = null;
app.loadingChannels = null;
app.searchChannelTimeout = null;
app.selectCurrentFilter = function() {
    var x = app.areas[constants.AREA_FILTERS].x, type = app.$filters.find('.filter.selected').data('type');
    switch (type) {
        case 'game':
            app.$selectGame.show();
            app.setState(constants.STATE_SELECT_GAME, function() {
                if (app.searchGameTimeout) {
                    clearTimeout(searchGameTimeout);
                    app.searchGameTimeout = null;
                }
                if (app.loadingGames) {
                    app.loadingGames.abort();
                    app.loadingGames = null;
                }
                app.$selectGame.hide();
                app.$loading.hide();
            });
            app.activateGameSearchArea();
            app.$gameSearchInput.val('');
            if (!app.$selectGame.hasClass('init')) {
                app.$selectGame.addClass('init');
                app.$gameItems.mCustomScrollbar(app.customScrollbarOptions);
                app.$gameItemsContainer = app.$gameItems.find('.mCSB_container');
            }
            app.prepareGamesSearch();
            if (app.loadingGames) {
                app.loadingGames.abort();
            }
            app.loadingGames = app.getGames(function() {
                app.loadingGames = null;
            });
            break;
        case 'channels':
            app.$selectChannels.show();
            app.setState(constants.STATE_SELECT_CHANNELS, function() {
                if (app.refreshChannelsInterval) {
                    clearInterval(app.refreshChannelsInterval);
                    app.refreshChannelsInterval = null;
                }
                app.$selectChannels.hide();
                app.$loading.hide();
            });
            app.activateChannelsSearchArea();
            app.$channelsSearchInput.val('');
            if (!app.$selectChannels.hasClass('init')) {
                app.$selectChannels.addClass('init');
                app.$channelsItems.mCustomScrollbar(app.customScrollbarOptions);
                app.$channelsItemsContainer = app.$channelsItems.find('.mCSB_container');
            }
            app.clearItems(app.$channelsItems, app.$channelsItemsContainer);
            break;
        case 'languages':
            app.$selectLanguage.show();
            app.setState(constants.STATE_SELECT_LANGUAGE, function() {
                app.$selectLanguage.hide();
            });
            break;
        case 'stream-type':
            app.$selectStreamType.show();
            app.setState(constants.STATE_SELECT_STREAM_TYPE, function() {
                app.$selectStreamType.hide();
            });
            break;
    }
};
app.toggleLanguage = function($selectedItem) {
    var code = $selectedItem.data('code');
    if (code === 'clear') {
        app.filters.languages = [];
        var $active = app.$selectLanguage.find('.active').each(function() {
            $(this).removeClass('active');
            $(this).find('input').prop('checked', false);
        });
        $('.filter-languages').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_LANGUAGES);
    } else {
        var $input = $selectedItem.find('input');
        if ($selectedItem.hasClass('active')) {
            $selectedItem.removeClass('active');
            $input.prop('checked', false);
            while ((x = app.filters.languages.indexOf(code)) !== -1) {
                app.filters.languages.splice(x, 1);
            }
        } else {
            $selectedItem.addClass('active');
            $input.prop('checked', true);
            app.filters.languages.push(code);
        }
    }
    if (app.filters.languages.length > 0) {
        $('.filter-languages').addClass('chosen').find('.text').text('(' + app.filters.languages.length + ') ' + messages.FILTER_STREAM_LANGUAGES);
    } else {
        $('.filter-languages').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_LANGUAGES);
    }
};
app.selectStreamType = function($selectedItem) {
    var type = $selectedItem.data('type');
    app.$selectStreamType.find('.active').removeClass('active');
    $selectedItem.addClass('active');
    if (type === 'live') {
        app.filters.streamType = null;
        $('#stream-filter-type').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_TYPE);
    } else {
        app.filters.streamType = type;
        $('#stream-filter-type').addClass('chosen').find('.text').text($selectedItem.text());
    }
};
app.selectGame = function(game) {
    app.filters.game = game;
    $('.filter-game').addClass('chosen').find('.text').text(game);
    app.$gameClear.show().find('.text').text(game);
};
app.clearGame = function() {
    app.filters.game = null;
    $('.filter-game').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_GAME);
    app.$gameClear.hide();
};
app.prepareGamesSearch = function() {
    app.showLoading(messages.LOADING);
    app.clearItems(app.$gameItems, app.$gameItemsContainer);
    app.areas[constants.AREA_GAME_RESULTS].columns = 0;
    app.areas[constants.AREA_GAME_RESULTS].x = 0;
    app.areas[constants.AREA_GAME_RESULTS].y = 0;
};
app.activateItemsArea = function() {
    app.activeArea = constants.AREA_RESULTS;
    app.clearSelection(app.$main);
    var $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
    app.showStreamItem($activeCell);
};
app.activateGameItemsArea = function() {
    app.activeArea = constants.AREA_GAME_RESULTS;
    app.clearSelection(app.$selectGame);
    var $activeCell = $('#game-item-' + app.areas[constants.AREA_GAME_RESULTS].x + '-' + app.areas[constants.AREA_GAME_RESULTS].y);
    app.showGameItem($activeCell);
};
app.activateGameSearchArea = function() {
    app.activeArea = constants.AREA_GAME_SEARCH;
    app.clearSelection(app.$selectGame);
    app.$gameSearchInput.addClass('selected');
};
app.activateGameClearArea = function() {
    app.activeArea = constants.AREA_GAME_CLEAR;
    app.clearSelection(app.$selectGame);
    app.$gameClear.addClass('selected');
};
app.activateChannelsSearchArea = function() {
    app.activeArea = constants.AREA_CHANNELS_SEARCH;
    app.clearSelection(app.$selectChannels);
    app.$channelsSearchInput.addClass('selected');
};
app.clearSelection = function($parent) {
    $('.selected', $parent).removeClass('selected');
};

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

if (window.tizen) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("ColorF0Red");
    tizen.tvinputdevice.registerKey("ColorF1Green");
    tizen.tvinputdevice.registerKey("ColorF2Yellow");
    tizen.tvinputdevice.registerKey("ColorF3Blue");
}

window.onload = app.init;