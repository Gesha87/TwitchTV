﻿var app = {}
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
app.areas[constants.AREA_FOLLOWED_FILTERS] = {
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
app.areas[constants.AREA_CHANNELS_RESULTS] = {
    columns: 0,
    rows: 5,
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
app.areas[constants.AREA_VIDEO_TYPE] = {
    columns: 1,
    rows: 4,
    x: 0,
    y: 1
};
app.areas[constants.AREA_PERIOD] = {
    columns: 1,
    rows: 3,
    x: 0,
    y: 0
};
app.areas[constants.AREA_SORT] = {
    columns: 1,
    rows: 2,
    x: 0,
    y: 0
};
app.areas[constants.AREA_CHANNEL_SORT] = {
    columns: 1,
    rows: 2,
    x: 0,
    y: 0
};
app.areas[constants.AREA_PLAYER_CONTROLS] = {
    columns: 5,
    rows: 1,
    x: 1,
    y: 0
};
app.areas[constants.AREA_PLAYER_QUALITY] = {
    columns: 1,
    rows: 0,
    x: 0,
    y: 0
};
app.filters = {
    game: null,
    channels: {},
    channel: null,
    languages: [],
    streamType: null,
    period: null,
    videoTypes: [],
    sort: null,
    videosChannel: null,
    channelSort: null,
    followedChannel: null,
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
            var index = app.filters.languages.indexOf(code);
            var divClass = index === -1 ? '' : 'active';
            var checked = index === -1 ? '' : 'checked="checked"';
            $newCell = $('<div class="filter-list-item ' + divClass + '" id="language-item-' + x + '-' + y + '">\
                <input type="checkbox" ' + checked + '>\
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
    if (app.filters.languages.length > 0) {
        $('.filter-languages').addClass('chosen').find('.text').text('(' + app.filters.languages.length + ') ' + messages.FILTER_STREAM_LANGUAGES);
    }
};
app.initGameFiler = function() {
    if (app.filters.game) {
        $('.filter-game').addClass('chosen').find('.text').text(app.filters.game);
    }
    if (app.filters.videosChannel) {
        $('#video-filter-game').addClass('unused');
    }
};
app.initFollowedChannelFiler = function() {
    if (app.filters.followedChannel) {
        $('#followed-filter-channel').addClass('chosen').find('.text').text(app.filters.followedChannel.name);
    }
};
app.initChannelsFiler = function() {
    var count = Object.keys(app.filters.channels).length;
    if (count > 0) {
        $('#stream-filter-channels').addClass('chosen').find('.text').text('(' + count + ') ' + messages.FILTER_STREAM_CHANNELS);
    }
};
app.initChannelFiler = function() {
    if (app.filters.videosChannel) {
        $('#video-filter-channel').addClass('chosen').find('.text').text(app.filters.videosChannel.name);
    }
};
app.initStreamTypeFilter = function() {
    if (app.filters.streamType) {
        var text = messages.FILTER_STREAM_TYPE;
        if (app.filters.streamType === 'playlist') {
            text = messages.STREAM_TYPE_PLAYLIST;
        } else if (app.filters.streamType === 'all') {
            text = messages.STREAM_TYPE_ALL;
        }
        $('#stream-filter-type').addClass('chosen').find('.text').text(text);
        app.$selectStreamType.find('.active').removeClass('active');
        app.$selectStreamType.find('.stream-type-' + app.filters.streamType).addClass('active');
    }
};
app.initPeriodFilter = function() {
    var $videoFilterPeriod = $('#video-filter-period');
    if (app.filters.period) {
        var text = messages.FILTER_VIDEO_PERIOD;
        if (app.filters.period === 'month') {
            text = messages.PERIOD_MONTH;
        } else if (app.filters.period === 'all') {
            text = messages.PERIOD_ALL;
        }
        $videoFilterPeriod.addClass('chosen').find('.text').text(text);
        app.$selectPeriod.find('.active').removeClass('active');
        app.$selectPeriod.find('.period-' + app.filters.period).addClass('active');
    }
    if (app.filters.videosChannel) {
        $videoFilterPeriod.addClass('unused');
    }
};
app.initSortFilter = function() {
    var $videoFilterSort = $('#video-filter-sort');
    if (app.filters.videosChannel) {
        if (app.filters.channelSort === 'views') {
            $videoFilterSort.addClass('chosen').find('.text').text(messages.CHANNEL_SORT_VIEWS);
            app.$selectChannelSort.find('.active').removeClass('active');
            app.$selectChannelSort.find('.sort-' + app.filters.channelSort).addClass('active');
        } else {
            $videoFilterSort.removeClass('chosen').find('.text').text(messages.FILTER_VIDEO_SORT);
        }
    } else {
        if (app.filters.sort === 'time') {
            $videoFilterSort.addClass('chosen').find('.text').text(messages.SORT_TIME);
            app.$selectSort.find('.active').removeClass('active');
            app.$selectSort.find('.sort-' + app.filters.sort).addClass('active');
        } else {
            $videoFilterSort.removeClass('chosen').find('.text').text(messages.FILTER_VIDEO_SORT);
        }
    }
};
app.initVideoTypeFilter = function() {
    if (app.filters.videoTypes.length > 0) {
        $('#video-filter-type').addClass('chosen').find('.text').text('(' + app.filters.videoTypes.length + ') ' + messages.FILTER_VIDEO_TYPE);
        for (i in app.filters.videoTypes) {
            var type = app.filters.videoTypes[i];
            app.$selectVideoType.find('.video-type-' + type).addClass('active').find('input').prop('checked', true);
        }
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
    $('#page-followed').find('.text').text(messages.PAGE_SUBSCRIPTIONS);
    // stream filters
    $('#stream-filter-game').find('.text').text(messages.FILTER_STREAM_GAME);
    $('#stream-filter-channels').find('.text').text(messages.FILTER_STREAM_CHANNELS);
    $('#stream-filter-languages').find('.text').text(messages.FILTER_STREAM_LANGUAGES);
    $('#stream-filter-type').find('.text').text(messages.FILTER_STREAM_TYPE);
    $('#stream-filter-presets').find('.text').text(messages.FILTER_PRESETS);
    $('#stream-filter-search').find('.text').text(messages.FILTER_SEARCH);
    // video filters
    $('#video-filter-channel').find('.text').text(messages.FILTER_VIDEO_CHANNEL);
    $('#video-filter-game').find('.text').text(messages.FILTER_VIDEO_GAME);
    $('#video-filter-period').find('.text').text(messages.FILTER_VIDEO_PERIOD);
    $('#video-filter-languages').find('.text').text(messages.FILTER_VIDEO_LANGUAGES);
    $('#video-filter-type').find('.text').text(messages.FILTER_VIDEO_TYPE);
    $('#video-filter-sort').find('.text').text(messages.FILTER_VIDEO_SORT);
    $('#video-filter-presets').find('.text').text(messages.FILTER_PRESETS);
    $('#video-filter-search').find('.text').text(messages.FILTER_SEARCH);
    // followed filters
    $('#followed-filter-channel').find('.text').text(messages.FILTER_FOLLOWED_CHANNEL);
    // hints
    $('#hint-live').find('.text').text(messages.HINT_LIVE_CHANNELS);
    $('#hint-videos').find('.text').text(messages.HINT_VIDEOS);
    $('#hint-subscriptions').find('.text').text(messages.HINT_SUBSCRIPTIONS);
    $('#hint-search').find('.text').text(messages.HINT_SEARCH);
    $('#hint-support').find('.text').text(messages.HINT_SUPPORT);
    // buttons
    $('#button-exit').text(messages.BUTTON_EXIT);
    $('#button-cancel').text(messages.BUTTON_CANCEL);
    $('#button-close').text(messages.BUTTON_CLOSE);
    $('#button-close-support').text(messages.BUTTON_CLOSE);
    // select game
    app.$selectGame.find('.caption > .text').text(messages.GAME_SELECT);
    app.$gameSearchInput.attr('placeholder', messages.GAME_SEARCH);
    // select channels
    app.$selectChannels.find('.caption > .text').text(messages.CHANNELS_SELECT);
    app.$channelsSearchInput.attr('placeholder', messages.CHANNELS_SEARCH);
    $('#channels-clear').find('.text').text(messages.CHANNELS_CLEAR);
    // select channel
    app.$selectChannel.find('.caption > .text').text(messages.CHANNEL_SELECT);
    app.$channelSearchInput.attr('placeholder', messages.CHANNEL_SEARCH);
    $('#channel-clear').find('.text').text(messages.CHANNEL_CLEAR);
    // select stream type
    app.$selectStreamType.find('.caption > .text').text(messages.STREAM_TYPE_SELECT);
    $('#stream-type-item-0-0').text(messages.STREAM_TYPE_LIVE);
    $('#stream-type-item-0-1').text(messages.STREAM_TYPE_PLAYLIST);
    $('#stream-type-item-0-2').text(messages.STREAM_TYPE_ALL);
    // select video type
    app.$selectVideoType.find('.caption > .text').text(messages.VIDEO_TYPE_SELECT);
    $('#video-type-item-0-0').find('.text').text(messages.VIDEO_TYPE_CLEAR);
    $('#video-type-item-0-1').find('.text').text(messages.VIDEO_TYPE_UPLOAD);
    $('#video-type-item-0-2').find('.text').text(messages.VIDEO_TYPE_ARCHIVE);
    $('#video-type-item-0-3').find('.text').text(messages.VIDEO_TYPE_HIGHLIGHT);
    // select period
    app.$selectPeriod.find('.caption > .text').text(messages.PERIOD_SELECT);
    $('#period-item-0-0').text(messages.PERIOD_WEEK);
    $('#period-item-0-1').text(messages.PERIOD_MONTH);
    $('#period-item-0-2').text(messages.PERIOD_ALL);
    // select sort
    app.$selectSort.find('.caption > .text').text(messages.SORT_SELECT);
    $('#sort-item-0-0').text(messages.SORT_VIEWS);
    $('#sort-item-0-1').text(messages.SORT_TIME);
    // select channel sort
    app.$selectChannelSort.find('.caption > .text').text(messages.CHANNEL_SORT_SELECT);
    $('#channel-sort-item-0-0').text(messages.CHANNEL_SORT_TIME);
    $('#channel-sort-item-0-1').text(messages.CHANNEL_SORT_VIEWS);
    // select language
    app.$selectLanguage.find('.caption > .text').text(messages.LANGUAGE_SELECT);
    // select quality
    app.$selectQuality.find('.caption > .text').text(messages.QUALITY_SELECT);
    // support
    $('#support-dialog-text').html(messages.SUPPORT_TEXT);
    // chat
    $('#chat-control-toggle').html(messages.CHAT_CONTROLL_TOGGLE);
    $('#chat-control-close').html(messages.CHAT_CONTROLL_CLOSE);
    $('#chat-control-mode').html(messages.CHAT_CONTROLL_MODE);
    $('#chat-control-scroll').html(messages.CHAT_CONTROLL_SCROLL);
    $('#chat-control-font').html(messages.CHAT_CONTROLL_FONT);
    $('#chat-control-last').html(messages.CHAT_CONTROLL_LAST);
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
app.$buttonCloseSupport = null;
app.$exitDialog = null;
app.$selectBox = null;
app.$chat = null;
app.$chatLoading = null;
app.$chatContent = null;
app.$chatControlsBottom = null;
app.$player = null;
app.$playerTime = null;
app.$items = null;
app.$itemsContainer = null;
app.$filters = null;
app.$streamFilters = null;
app.$videoFilters = null;
app.$followedFilters = null;
app.$pages = null;
app.$liveChannelsPage = null;
app.$videosPage = null;
app.$subscriptionsPage = null;
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
app.$channelsSelectBox = null;
app.$selectChannel = null;
app.$channelItems = null;
app.$channelItemsContainer = null;
app.$channelSearchInput = null;
app.$channelSelectBox = null;
app.$channelsClear = null;
app.$selectVideoType = null;
app.$selectPeriod = null;
app.$selectSort = null;
app.$selectChannelSort = null;
app.$controlBackward = null;
app.$controlPlayPause = null;
app.$controlForward = null;
app.$selectQuality = null;
app.$playerProgress = null;
app.$playerProgressBar = null;
app.$playerProgressSelect = null;
app.$playerProgressSlider = null;
app.$videoFilterChannel = null;
app.$followedFilterChannel = null;
app.init = function() {
    app.$main = $('#main');
    app.$loading = $('#loading-wrapper');
    app.$error = $('#error-dialog');
    app.$errorContent = $('#error-dialog').find('.content');
    app.$errorText = $('#error-dialog-text');
    app.$buttonCloseError = $('#button-close');
    app.$buttonCloseSupport = $('#button-close-support');
    app.$exitDialog = $('#exit-dialog');
    app.$loadingText = app.$loading.find('.text');
    app.$selectBox = $('#select-box');
    app.$chat = $('#chat');
    app.$chatContent = $('#chat-content');
    app.$chatLoading = $('#chat-loading');
    app.$chatControlsBottom = $('#chat-controls-bottom');
    app.$player = $('#av-player');
    app.$playerTime = $('#player-time');
    app.$items = $('#items');
    app.$pages = $('#pages');
    app.$liveChannelsPage = $('#page-live-channels');
    app.$videosPage = $('#page-videos');
    app.$subscriptionsPage = $('#page-followed');
    app.$streamFilters = $('#stream-filters');
    app.$videoFilters = $('#video-filters');
    app.$followedFilters = $('#followed-filters');
    app.$filters = app.$streamFilters;
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
    app.$channelsSelectBox = $('#select-channel-box');
    app.$channelsClear = $('#channels-clear');
    app.$selectChannel = $('#select-channel');
    app.$channelItems = $('#channel-items');
    app.$channelSearchInput = $('#channel-search-input');
    app.$channelSelectBox = $('#select-video-channel-box');
    app.$channelClear = $('#channel-clear');
    app.$selectVideoType = $('#select-video-type');
    app.$selectPeriod = $('#select-period');
    app.$selectSort = $('#select-sort');
    app.$selectChannelSort = $('#select-channel-sort');
    app.$controlBackward = $('#control-item-0-0');
    app.$controlPlayPause = $('#control-item-1-0');
    app.$controlForward = $('#control-item-2-0');
    app.$selectQuality  = $('#select-quality');
    app.$playerProgress = $('#player-progress');
    app.$playerProgressBar = $('#player-progress-bar');
    app.$playerProgressSelect = $('#player-progress-select');
    app.$playerProgressSlider = $('#player-progress-slider');
    app.$videoFilterChannel = $('#video-filter-channel');
    app.$followedFilterChannel = $('#followed-filter-channel');
    app.$playerProgressSlider.popover({placement: 'top', content: app.timeFormat(0)});
    //app.$videoFilterChannel.popover({placement: 'bottom', content: messages.FILTER_VIDEO_CHANNEL_NOTICE});
    app.restoreFilters();
    app.translateLayout();
    app.initGameFiler();
    app.initChannelsFiler();
    app.initChannelFiler();
    app.initFollowedChannelFiler();
    app.initLangugesFilter();
    app.initStreamTypeFilter();
    app.initVideoTypeFilter();
    app.initPeriodFilter();
    app.initSortFilter();
    app.setUnderscore();
    app.areas[constants.AREA_PAGES].columns = app.$pages.find('.page').length;
    app.areas[constants.AREA_STREAM_FILTERS].columns = app.$streamFilters.find('.filter').length;
    app.areas[constants.AREA_VIDEO_FILTERS].columns = app.$videoFilters.find('.filter').length;
    app.areas[constants.AREA_FOLLOWED_FILTERS].columns = app.$followedFilters.find('.filter').length;
    $('body').addClass('init');
    app.$items.mCustomScrollbar($.extend({}, app.customScrollbarOptions, {
        callbacks: {
            onTotalScroll: app.loadMore,
            onTotalScrollOffset: $(window).width() * 0.5
        }
    }));
    app.$itemsContainer = app.$items.find('.mCSB_container');
    var lastGameQuery = '';
    app.$gameSearchInput.on('keyup', function(e) {
        if (e.keyCode == keys.KEY_RETURN) {
            app.$gameSearchInput.blur();
            return;
        }
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
    var lastChannelsQuery = '';
    app.$channelsSearchInput.on('keyup', function(e) {
        if (e.keyCode == keys.KEY_RETURN) {
            app.$channelsSearchInput.blur();
            return;
        }
        var query = $.trim(app.$channelsSearchInput.val());
        if (query == lastChannelsQuery) return;
        lastChannelsQuery = query;
        if (query) {
            if (app.searchChannelTimeout) {
                clearTimeout(app.searchChannelTimeout);
            }
            if (app.loadingChannels) {
                app.loadingChannels.abort();
                app.loadingChannels = null;
            }
            app.searchChannelTimeout = setTimeout(function() {
                app.searchChannelTimeout = null;
                app.prepareChannelsSearch();
                app.showLoading(messages.LOADING);
                app.loadingChannels = app.getChannelsSearch(query, function() {
                    app.loadingChannels = null;
                });
            }, 500);
        } else {
        	app.clearItems(app.$channelsItems, app.$channelsItemsContainer);
            app.$channelsItemsContainer.append($('<div class="column text"/>').text(messages.CHANNELS_TYPE_TO_SEARCH));
        }
    });
    var lastChannelQuery = '';
    app.$channelSearchInput.on('keyup', function(e) {
        if (e.keyCode == keys.KEY_RETURN) {
            app.$channelSearchInput.blur();
            return;
        }
        var query = $.trim(app.$channelSearchInput.val());
        if (query == lastChannelQuery) return;
        lastChannelQuery = query;
        if (query) {
            if (app.searchChannelTimeout) {
                clearTimeout(app.searchChannelTimeout);
            }
            if (app.loadingChannels) {
                app.loadingChannels.abort();
                app.loadingChannels = null;
            }
            app.searchChannelTimeout = setTimeout(function() {
                app.searchChannelTimeout = null;
                app.prepareChannelSearch();
                app.showLoading(messages.LOADING);
                app.loadingChannels = app.getChannelSearch(query, function() {
                    app.loadingChannels = null;
                });
            }, 500);
        } else {
            app.clearItems(app.$channelsItems, app.$channelsItemsContainer);
            app.$channelsItemsContainer.append($('<div class="column text"/>').text(messages.CHANNELS_TYPE_TO_SEARCH));
        }
    });
    document.addEventListener('visibilitychange', function() {
        if (window.webapis && 
                (app.state == constants.STATE_WATCH || 
                 app.state == constants.STATE_SELECT_QUALITY || 
                 app.state == constants.STATE_WATCH_CONTROLS)
        ) {
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
                            app.showCurrentFilter(-1);
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_PAGES].x > 0) {
                            app.areas[constants.AREA_PAGES].x--;
                            app.showCurrentPage(true);
                            app.storeCurrentPage();
                        }
                    }
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_LEFT);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNELS) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateChannelItems(keys.KEY_LEFT);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL ||
                        app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateVideosChannelItems(keys.KEY_LEFT);
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_LEFT);
                } else if (app.state === constants.STATE_WATCH) {
                    app.controlBackward();
                } else if (app.state === constants.STATE_WATCH_CONTROLS) {
                    if (app.activeArea === constants.AREA_PLAYER_CONTROLS) {
                        app.navigateControlItems(keys.KEY_LEFT);
                    } else if (app.activeArea === constants.AREA_PLAYER_PROGRESS) {
                        var select = app.$playerProgress.data('select');
                        select = Math.max(0, select - 30);
                        app.$playerProgress.data('select', select);
                        app.updateProgressSelectPosition();
                    }
                    app.autoHideControls();
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
                } else if (app.state === constants.STATE_SELECT_CHANNELS) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateChannelItems(keys.KEY_UP, function() {
                            app.activateChannelsSearchArea();
                        });
                    } else if (app.activeArea == constants.AREA_CHANNELS_SEARCH && app.filters.channel) {
                        app.$channelsSearchInput.blur();
                        app.activateChannelsClearArea();
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL ||
                        app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateVideosChannelItems(keys.KEY_UP, function() {
                            app.activateChannelSearchArea();
                        });
                    } else if (app.activeArea == constants.AREA_CHANNELS_SEARCH && 
                            ((app.filters.videosChannel && app.state === constants.STATE_SELECT_CHANNEL) || 
                             (app.filters.followedChannel && app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL))) {
                        app.$channelSearchInput.blur();
                        app.activateChannelClearArea();
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_STREAM_TYPE) {
                    app.navigateStreamTypeItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_VIDEO_TYPE) {
                    app.navigateVideoTypeItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_PERIOD) {
                    app.navigatePeriodItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_SORT) {
                    app.navigateSortItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_CHANNEL_SORT) {
                    app.navigateChannelSortItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_SELECT_QUALITY) {
                    app.navigateQualityItems(keys.KEY_UP);
                } else if (app.state === constants.STATE_WATCH_CONTROLS) {
                    if (app.activeArea == constants.AREA_PLAYER_PROGRESS) {
                        app.activatePlayerControlsArea(false);
                    }
                    app.autoHideControls();
                } else if (app.state === constants.STATE_WATCH && app.chatIsActive) {
                    var oldScrollTop = app.$chat.get(0).scrollTop;
                    if (oldScrollTop > 0) {
                        app.$chat.get(0).scrollTop -= app.chatScrollStep;
                        app.chatAutoScroll = false;
                        app.$chatControlsBottom.show();
                    }
                }
                break;
            case keys.KEY_RIGHT:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        app.navigateItems(keys.KEY_RIGHT);
                    } else if (app.activeArea == constants.AREA_FILTERS) {
                        if (app.areas[constants.AREA_FILTERS].x < app.areas[constants.AREA_FILTERS].columns - 1) {
                            app.areas[constants.AREA_FILTERS].x++;
                            app.showCurrentFilter(1);
                        }
                    } else if (app.activeArea == constants.AREA_PAGES) {
                        if (app.areas[constants.AREA_PAGES].x < app.areas[constants.AREA_PAGES].columns - 1) {
                            app.areas[constants.AREA_PAGES].x++;
                            app.showCurrentPage(true);
                            app.storeCurrentPage();
                        }
                    }
                } else if (app.state === constants.STATE_SELECT_GAME) {
                    if (app.activeArea == constants.AREA_GAME_RESULTS) {
                        app.navigateGameItems(keys.KEY_RIGHT);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNELS) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateChannelItems(keys.KEY_RIGHT);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL ||
                        app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateVideosChannelItems(keys.KEY_RIGHT);
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_RIGHT);
                } else if (app.state === constants.STATE_WATCH) {
                    app.controlForward();
                } else if (app.state === constants.STATE_WATCH_CONTROLS) {
                    if (app.activeArea === constants.AREA_PLAYER_CONTROLS) {
                        app.navigateControlItems(keys.KEY_RIGHT);
                    } else if (app.activeArea === constants.AREA_PLAYER_PROGRESS) {
                        var select = app.$playerProgress.data('select');
                        var length = app.$playerProgress.data('length');
                        select = Math.min(length, select + 30);
                        app.$playerProgress.data('select', select);
                        app.updateProgressSelectPosition();
                    }
                    app.autoHideControls();
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
                } else if (app.state === constants.STATE_SELECT_CHANNELS) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateChannelItems(keys.KEY_DOWN);
                    } else if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                        if (app.areas[constants.AREA_CHANNELS_RESULTS].columns > 0) {
                            app.$channelsSearchInput.blur();
                            app.activateChannelItemsArea();
                        }
                    } else if (app.activeArea == constants.AREA_CHANNELS_CLEAR) {
                        app.activateChannelsSearchArea();
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL ||
                        app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        app.navigateVideosChannelItems(keys.KEY_DOWN);
                    } else if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                        if (app.areas[constants.AREA_CHANNELS_RESULTS].columns > 0) {
                            app.$channelSearchInput.blur();
                            app.activateVideosChannelItemsArea();
                        }
                    } else if (app.activeArea == constants.AREA_CHANNELS_CLEAR) {
                        app.activateChannelSearchArea();
                    }
                } else if (app.state === constants.STATE_SELECT_LANGUAGE) {
                    app.navigateLanguageItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_STREAM_TYPE) {
                    app.navigateStreamTypeItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_VIDEO_TYPE) {
                    app.navigateVideoTypeItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_PERIOD) {
                    app.navigatePeriodItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_SORT) {
                    app.navigateSortItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_CHANNEL_SORT) {
                    app.navigateChannelSortItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_SELECT_QUALITY) {
                    app.navigateQualityItems(keys.KEY_DOWN);
                } else if (app.state === constants.STATE_WATCH) {
                    if (app.chatIsActive) {
                        var oldScrollTop = app.$chat.get(0).scrollTop; 
                        app.$chat.get(0).scrollTop += app.chatScrollStep;
                        if (app.$chat.get(0).scrollTop > 0 && app.$chat.get(0).scrollTop == oldScrollTop) {
                            app.chatAutoScroll = true;
                            app.$chatControlsBottom.hide();
                        }
                    } else {
                        $('#player-controls').show();
                        $('#player-info').show();
                        if (app.$playerProgress.hasClass('hidden')) {
                            app.activatePlayerControlsArea(true);
                        } else {
                            app.activatePlayerProgressArea();
                        }
                        app.setState(constants.STATE_WATCH_CONTROLS, function() {
                            $('#player-controls').hide();
                            $('#player-info').hide();
                            app.$playerProgressSlider.popover('hide');
                        });
                        app.autoHideControls();
                    }
                } else if (app.state === constants.STATE_WATCH_CONTROLS) {
                    if (app.activeArea == constants.AREA_PLAYER_CONTROLS && !app.$playerProgress.hasClass('hidden')) {
                        app.activatePlayerProgressArea();
                    }
                    app.autoHideControls();
                }
                break;
            case keys.KEY_ENTER:
                if (app.state === constants.STATE_BROWSE) {
                    if (app.activeArea == constants.AREA_RESULTS) {
                        var $selectedItem = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            if (app.page == constants.PAGE_LIVE_CHANNELS ||
                                    app.page == constants.PAGE_FOLLOWED) {
                            	if ($selectedItem.data('channel-logo')) {
                            		$('#player-stream-logo').attr('src', $selectedItem.data('channel-logo')).show();
                            	} else {
                            		$('#player-stream-logo').hide();
                            	}
                            	app.chatRoom = $selectedItem.data('channel');
                                $('#player-stream-name').text($selectedItem.data('channel-name'));
                                $('#player-stream-status').text($selectedItem.data('status'));
                                $('#player-stream-game').text($selectedItem.data('game'));
                                $('#player-length').hide();
                                $('#player-time').hide();
                                app.$controlBackward.addClass('hidden');
                                app.$controlForward.addClass('hidden');
                                app.$playerProgress.addClass('hidden');
                                if (app.refreshStreamInfoInterval) {
                                	clearInterval(app.refreshStreamInfoInterval);
                                	app.refreshStreamInfoInterval = null;
                                }
                                app.refreshStreamInfoInterval = setInterval(function() {
                                	$.ajax($.extend({}, app.twitchApiOptions, {
                                        url: 'https://api.twitch.tv/kraken/channels/' + $selectedItem.data('channel-id')
                                    })).done(function(response) {
                                    	//console.log(response);
                                        if (response) {
                                        	if (response.logo) {
                                        		$('#player-stream-logo').attr('src', response.logo).show();
                                        	} else {
                                        		$('#player-stream-logo').hide();
                                        	}
                                            $('#player-stream-name').text(response.display_name);
                                            $('#player-stream-status').text(response.status);
                                            $('#player-stream-game').text(response.game);
                                        }
                                    });
                                }, 30000);
                                app.playStream($selectedItem.data('channel'));
                            } else if (app.page == constants.PAGE_VIDEOS) {
                            	$('#player-stream-logo').hide();
                            	$.ajax($.extend({}, app.twitchApiOptions, {
                                    url: 'https://api.twitch.tv/kraken/channels/' + $selectedItem.data('channel-id')
                                })).done(function(response) {
                                    //console.log(response);
                                    if (response) {
                                    	$('#player-stream-logo').attr('src', response.logo).show();
                                    }
                                });
                            	app.chatRoom = null;
                            	$('#player-stream-name').text($selectedItem.data('channel-name'));
                                $('#player-stream-status').text($selectedItem.data('status'));
                                $('#player-stream-game').text($selectedItem.data('game'));
                                $('#player-time').show();
                                $('#player-length').show().text('/ ' + ($selectedItem.data('length') > 0 ? app.timeFormat($selectedItem.data('length')) : '?'));
                                app.$playerProgress.data('length', $selectedItem.data('length'));
                                app.$controlBackward.removeClass('hidden');
                                app.$controlForward.removeClass('hidden');
                                app.$playerProgress.removeClass('hidden');
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
                    } else if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        var $selectedItem = $('#channel-item-' + app.areas[constants.AREA_CHANNELS_RESULTS].x + '-' + app.areas[constants.AREA_CHANNELS_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            if (app.toggleChannel($selectedItem)) {
                                if (app.timeoutRefresh) {
                                    clearTimeout(app.timeoutRefresh);
                                }
                                app.timeoutRefresh = setTimeout(function() {
                                    app.timeoutRefresh = null;
                                    app.refresh(true);
                                }, 500);
                            }
                        }
                    } else if (app.activeArea == constants.AREA_CHANNELS_CLEAR) {
                        app.clearChannels();
                        app.activateChannelsSearchArea();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                        app.$channelSearchInput.focus();
                    } else if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        var $selectedItem = $('#videos-channel-item-' + app.areas[constants.AREA_CHANNELS_RESULTS].x + '-' + app.areas[constants.AREA_CHANNELS_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            app.selectChannel({
                                id: $selectedItem.data('id'), 
                                name: $selectedItem.data('display-name')
                            });
                            app.returnState();
                            app.refresh(true);
                        }
                    } else if (app.activeArea == constants.AREA_CHANNELS_CLEAR) {
                        app.clearChannel();
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
                    if (app.activeArea == constants.AREA_CHANNELS_SEARCH) {
                        app.$channelSearchInput.focus();
                    } else if (app.activeArea == constants.AREA_CHANNELS_RESULTS) {
                        var $selectedItem = $('#videos-channel-item-' + app.areas[constants.AREA_CHANNELS_RESULTS].x + '-' + app.areas[constants.AREA_CHANNELS_RESULTS].y);
                        if ($selectedItem.length > 0) {
                            app.selectFollowedChannel({
                                id: $selectedItem.data('id'), 
                                name: $selectedItem.data('display-name')
                            });
                            app.returnState();
                            app.refresh(true);
                        }
                    } else if (app.activeArea == constants.AREA_CHANNELS_CLEAR) {
                        app.clearFollowedChannel();
                        app.returnState();
                        app.refresh(true);
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
                } else if (app.state === constants.STATE_SELECT_VIDEO_TYPE) {
                    var $selectedItem = $('#video-type-item-' + app.areas[constants.AREA_VIDEO_TYPE].x + '-' + app.areas[constants.AREA_VIDEO_TYPE].y);
                    if ($selectedItem.length > 0) {
                        app.toggleVideoType($selectedItem);
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
                } else if (app.state === constants.STATE_SELECT_PERIOD) {
                    var $selectedItem = $('#period-item-' + app.areas[constants.AREA_PERIOD].x + '-' + app.areas[constants.AREA_PERIOD].y);
                    if ($selectedItem.length > 0) {
                        app.selectPeriod($selectedItem);
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_SORT) {
                    var $selectedItem = $('#sort-item-' + app.areas[constants.AREA_SORT].x + '-' + app.areas[constants.AREA_SORT].y);
                    if ($selectedItem.length > 0) {
                        app.selectSort($selectedItem);
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_CHANNEL_SORT) {
                    var $selectedItem = $('#channel-sort-item-' + app.areas[constants.AREA_CHANNEL_SORT].x + '-' + app.areas[constants.AREA_CHANNEL_SORT].y);
                    if ($selectedItem.length > 0) {
                        app.selectChannelSort($selectedItem);
                        app.returnState();
                        app.refresh(true);
                    }
                } else if (app.state === constants.STATE_SELECT_QUALITY) {
                    var $selectedItem = $('#quality-item-' + app.areas[constants.AREA_PLAYER_QUALITY].x + '-' + app.areas[constants.AREA_PLAYER_QUALITY].y);
                    if ($selectedItem.length > 0) {
                        app.returnState();
                        if (app.state === constants.STATE_WATCH_CONTROLS) {
                            app.returnState();
                        }
                        setTimeout(function() {
                            app.selectQuality($selectedItem);
                        }, 0);
                    }
                } else if (app.state === constants.STATE_WATCH) {
                    app.showControls();
                } else if (app.state === constants.STATE_WATCH_CONTROLS) {
                    if (app.activeArea == constants.AREA_PLAYER_CONTROLS) {
                        var $selectedItem = $('#control-item-' + app.areas[constants.AREA_PLAYER_CONTROLS].x + '-' + app.areas[constants.AREA_PLAYER_CONTROLS].y);
                        if ($selectedItem.length > 0) {
                            switch ($selectedItem.data('type')) {
                                case 'backward':
                                    app.controlBackward();
                                    break;
                                case 'forward':
                                    app.controlForward();
                                    break;
                                case 'play-pause':
                                    app.controlPlayPause();
                                    break;
                                case 'options':
                                    app.controlOptions();
                                    break;
                                case 'chat':
                                    app.returnState();
                                    app.toggleChat();
                                    break;
                            }
                        }
                    } else if (app.activeArea == constants.AREA_PLAYER_PROGRESS) {
                        app.controlSeek(app.$playerProgress.data('select'));
                    }
                    app.autoHideControls();
                } else if (app.state === constants.STATE_ERROR) {
                    app.returnState();
                } else if (app.state === constants.STATE_SUPPORT) {
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
            //case keys.KEY_1:
            case keys.KEY_RED:
                if (app.state == constants.STATE_BROWSE) {
                    app.selectActiveChannelsPage();
                } else if (app.state == constants.STATE_WATCH) {
                    app.toggleChat();
                }
                break;
            //case keys.KEY_2:
            case keys.KEY_GREEN:
                if (app.state == constants.STATE_BROWSE) {
                    app.selectVideosPage();
                } else if (app.state == constants.STATE_WATCH && app.chatIsActive) {
                    app.closeChat();
                    app.updateDisplayRect();
                }
                break;
            //case keys.KEY_3:
            case keys.KEY_YELLOW:
                if (app.state == constants.STATE_BROWSE) {
                    app.selectSubscriptionsPage();
                } else if (app.state == constants.STATE_WATCH && app.chatIsActive) {
                    app.toggleChatMode();
                }
                break;
            //case keys.KEY_4:
            case keys.KEY_BLUE:
                if (app.state == constants.STATE_BROWSE) {
                    app.showSupportInfo();
                } else if (app.state == constants.STATE_WATCH && app.chatIsActive) {
                    app.chatAutoScroll = true;
                    app.$chatControlsBottom.hide();
                    app.$chat.scrollTo(app.$chatContent.find('div:last'));
                }
                break;
            case keys.KEY_STOP:
                if (app.state == constants.STATE_WATCH_CONTROLS) {
                    app.returnState();
                }
                if (app.state == constants.STATE_WATCH) {
                    app.returnState();
                }
                break;
            case keys.KEY_PAUSE:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                    app.controlPause();
                    app.showControls();
                }
                break;
            case keys.KEY_PLAY:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                    app.controlPlay();
                    app.showControls();
                }
                break;
            case keys.KEY_PLAY_PAUSE:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                    app.controlPlayPause();
                    app.showControls();
                }
                break;
            case keys.KEY_PREVIOUS:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                	app.controlBackward();
                	app.showControls();
                }
                break;
            case keys.KEY_NEXT:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                    app.controlForward();
                    app.showControls();
                }
                break;
            case keys.KEY_TOOLS:
                if (app.state == constants.STATE_WATCH || app.state == constants.STATE_WATCH_CONTROLS) {
                    app.controlOptions();
                } else if (app.state == constants.STATE_SELECT_QUALITY) {
                    app.returnState();
                }
                break;
            //case keys.KEY_1:
            case keys.KEY_CHANNELUP:
                if (app.state == constants.STATE_WATCH && app.chatIsActive) {
                    app.increaseChatFontSize();
                }
                break;
            //case keys.KEY_2:
            case keys.KEY_CHANNELDOWN:
                if (app.state == constants.STATE_WATCH && app.chatIsActive) {
                    app.decreaseChatFontSize();
                }
                break;
            default:
                //console.log("Key code : " + e.keyCode);
                break;
        }
    });
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Client-ID', 'q5ix3v5d0ot12koqr7paerntdo5gz9');
        },
        timeout: 10000,
    });
    app.areas[constants.AREA_PAGES].x = localStorage.page || 0;
    app.showCurrentPage(true);
    $(window).resize(function() {
        if (app.state === constants.STATE_SELECT_GAME) {
            app.$selectGame.css('z-index', 500);
            app.$gameItems.mCustomScrollbar('update');
        } else if (app.state === constants.STATE_SELECT_CHANNELS) {
            app.$selectChannels.css('z-index', 500);
            app.$channelsItems.mCustomScrollbar('update');
        } else if (app.state === constants.STATE_SELECT_CHANNEL ||
                   app.state === constants.STATE_SELECT_FOLLOWED_CHANNEL) {
            app.$selectChannel.css('z-index', 500);
            app.$channelItems.mCustomScrollbar('update');
        }
        app.$items.mCustomScrollbar('update');
    });
    app.updateChatFontSize();
    /*app.isVideo = true;
    comments.videoId = '213245808';
    comments.open(2400);
    //chat.open('a1taoda');
    //app.chatRoom = 'a1taoda';
    app.state = constants.STATE_WATCH;
    app.chatIsActive = true;*/
};
app.chatIsActive = false;
app.chatRoom = null;
app.updateDisplayRect = function() {
    if (window.webapis) {
        if (app.chatIsActive && app.chatMode == 1) {
            var width = Math.ceil($(window).width() - 0.44 * $(window).height());
            var height = Math.ceil($(window).height() * width / $(window).width());
            webapis.avplay.setDisplayRect(0, Math.ceil(($(window).height() - height) / 2), width, height);
        } else {
            webapis.avplay.setDisplayRect(0, 0, $(window).width(), $(window).height());
        }
    }
    if (app.chatMode == 3) {
        app.$chat.addClass('transparent');
    } else {
        app.$chat.removeClass('transparent');
    }
};
app.toggleChat = function() {
    if (app.chatIsActive) {
        app.hideChat();
    } else {
        app.showChat();
    }
    app.updateDisplayRect();
};
app.hideChat = function() {
    app.chatIsActive = false;
    app.$chat.hide();
};
app.chatAutoScroll = true;
app.chatScrollStep = 15;
app.showChat = function() {
    app.chatIsActive = true;
    app.$chat.show();
    if (app.chatAutoScroll) {
        app.$chat.scrollTo(app.$chatContent.find('div:last'));
    }
    if (!app.isVideo && !chat.ws && app.chatRoom) {
        app.$chatLoading.show();
        app.$chatContent.hide();
        chat.open(app.chatRoom);
        app.chatAutoScroll = true;
        app.$chatControlsBottom.hide();
    }
    if (app.isVideo && !comments.active && comments.videoId) {
        app.initComments();
    }
};
app.initComments = function() {
    app.$chatLoading.show();
    app.$chatContent.hide();
    comments.open(webapis.avplay.getCurrentTime() / 1000);
    app.chatAutoScroll = true;
    app.$chatControlsBottom.hide();
};
app.closeChat = function() {
    app.hideChat();
    chat.close();
    comments.close();
    app.$chatLoading.hide();
    app.$chatContent.empty().show();
};
app.chatMode = localStorage.chatMode || 1;
app.toggleChatMode = function() {
    if (app.chatMode == 1) {
        app.chatMode = 2;
    } else if (app.chatMode == 2) {
        app.chatMode = 3;
    } else {
        app.chatMode = 1;
    }
    localStorage.chatMode = app.chatMode;
    app.updateDisplayRect();
};
app.chatFontSize = localStorage.chatFontSize || 1;
app.increaseChatFontSize = function() {
    if (app.chatFontSize < 3) {
        app.chatFontSize++;
        localStorage.chatFontSize = app.chatFontSize;
        app.updateChatFontSize();
    }
};
app.decreaseChatFontSize = function() {
    if (app.chatFontSize > 1) {
        app.chatFontSize--;
        localStorage.chatFontSize = app.chatFontSize;
        app.updateChatFontSize();
    }
};
app.updateChatFontSize = function() {
    if (app.chatFontSize == 1) {
        app.$chat.removeClass('big').removeClass('big2').removeClass('big3');
    } else if(app.chatFontSize == 2) {
        app.$chat.addClass('big').removeClass('big2').removeClass('big3');
    } else if(app.chatFontSize == 3) {
        app.$chat.removeClass('big').addClass('big2').removeClass('big3');
    } else if(app.chatFontSize == 4) {
        app.$chat.removeClass('big').removeClass('big2').addClass('big3');
    }
};
app.showSupportInfo = function() {
    if (app.state !== constants.STATE_EXIT) {
        $('#support-dialog').show();
        app.setState(constants.STATE_SUPPORT, function() {
            $('#support-dialog').hide();
        });
        app.$buttonCloseSupport.addClass('selected');
    }
};
app.timeoutAutoHideControls = null;
app.showControls = function() {
    if (app.state === constants.STATE_WATCH) {
        $('#player-controls').show();
        $('#player-info').show();
        app.activatePlayerControlsArea(true);
        app.setState(constants.STATE_WATCH_CONTROLS, function() {
            $('#player-controls').hide();
            $('#player-info').hide();
            app.$playerProgressSlider.popover('hide');
        });
    }
    app.autoHideControls();
};
app.autoHideControls = function() {
    if (app.timeoutAutoHideControls) {
        clearTimeout(app.timeoutAutoHideControls);
        app.timeoutAutoHideControls = null;
    }
    app.timeoutAutoHideControls = setTimeout(function() {
        if (app.state === constants.STATE_WATCH_CONTROLS) {
            app.returnState();
        }
    }, 5000);
};
app.isPaused = false;
app.controlPlayPause = function() {
    if (window.webapis) {
        if (!app.isPaused) {
            webapis.avplay.pause();
            app.$controlPlayPause.find('i').removeClass('fa-pause').addClass('fa-play');
            app.isPaused = true;
        } else {
            webapis.avplay.play();
            app.$controlPlayPause.find('i').removeClass('fa-play').addClass('fa-pause');
            app.isPaused = false;
        }
    }
};
app.controlPlay = function() {
    if (window.webapis) {
        if (app.isPaused) {
            webapis.avplay.play();
            app.$controlPlayPause.find('i').removeClass('fa-play').addClass('fa-pause');
            app.isPaused = false;
        }
    }
};
app.controlPause = function() {
    if (window.webapis) {
        if (!app.isPaused) {
            webapis.avplay.pause();
            app.$controlPlayPause.find('i').removeClass('fa-pause').addClass('fa-play');
            app.isPaused = true;
        }
    }
};
app.controlBackward = function() {
	if (window.webapis) {
		webapis.avplay.jumpBackward(30000);
		app.updateProgressPosition();
		if (comments.active) {
		    app.initComments();
		}
    }
};
app.controlForward = function() {
	if (window.webapis) {
		webapis.avplay.jumpForward(30000);
		app.updateProgressPosition();
		if (comments.active) {
            app.initComments();
        }
    }
};
app.controlSeek = function(seconds) {
    if (window.webapis) {
        webapis.avplay.seekTo(seconds * 1000);
        app.updateProgressPosition();
        if (comments.active) {
            app.initComments();
        }
    }
};
app.controlOptions = function() {
    if (app.state === constants.STATE_WATCH_CONTROLS) {
        app.returnState();
    }
    app.$selectQuality.show();
    app.setState(constants.STATE_SELECT_QUALITY, function() {
        app.$selectQuality.hide();
    });
};
app.getNewActiveCell = function(prefix, area, keyCode, initUpperArea) {
    switch (keyCode) {
        case keys.KEY_LEFT:
            var $newActiveCell, $activeCell = $('#' + prefix + '-' + app.areas[area].x + '-' + app.areas[area].y);
            if ($activeCell.length > 0 && app.areas[area].x > 0) {
                var minus = 1;
                $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x - minus) + '-' + app.areas[area].y);
                while ($newActiveCell.length > 0 && $newActiveCell.hasClass('hidden')) {
                    $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x - ++minus) + '-' + app.areas[area].y);
                }
                if ($newActiveCell.length > 0) {
                    app.areas[area].x -= minus;
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
                var plus = 1;
                $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x + plus) + '-' + app.areas[area].y);
                while ($newActiveCell.length > 0 && $newActiveCell.hasClass('hidden')) {
                    $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x + ++plus) + '-' + app.areas[area].y);
                }
                if ($newActiveCell.length > 0) {
                    app.areas[area].x += plus;
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
            } else if ($activeCell.length > 0 && app.areas[area].x < app.areas[area].columns - 1) {
                $newActiveCell = $('#' + prefix + '-' + (app.areas[area].x + 1) + '-0');
                if ($newActiveCell.length > 0) {
                    app.areas[area].x++;
                    app.areas[area].y = 0;
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
app.navigateChannelItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('channel-item', constants.AREA_CHANNELS_RESULTS, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.showChannelItem($newActiveCell);
    }
};
app.navigateVideosChannelItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('videos-channel-item', constants.AREA_CHANNELS_RESULTS, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.showVideosChannelItem($newActiveCell);
    }
};
app.navigateLanguageItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('language-item', constants.AREA_LANGUAGES, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectLanguage);
        $newActiveCell.addClass('selected');
    }
};
app.navigateVideoTypeItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('video-type-item', constants.AREA_VIDEO_TYPE, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectVideoType);
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
app.navigatePeriodItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('period-item', constants.AREA_PERIOD, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectPeriod);
        $newActiveCell.addClass('selected');
    }
};
app.navigateSortItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('sort-item', constants.AREA_SORT, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectSort);
        $newActiveCell.addClass('selected');
    }
};
app.navigateChannelSortItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('channel-sort-item', constants.AREA_CHANNEL_SORT, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectChannelSort);
        $newActiveCell.addClass('selected');
    }
};
app.navigateControlItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('control-item', constants.AREA_PLAYER_CONTROLS, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection($('#player-controls'));
        $newActiveCell.addClass('selected');
    }
};
app.navigateQualityItems = function(keyCode, initUpperArea) {
    var $newActiveCell = app.getNewActiveCell('quality-item', constants.AREA_PLAYER_QUALITY, keyCode, initUpperArea);
    if ($newActiveCell) {
        app.clearSelection(app.$selectQuality);
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
app.refreshStreamInfoInterval = null;
app.loadingStream = null;
app.loadingStreamErrorHandler = function(xhr, textStatus, errorThrown) {
    if (errorThrown !== 'abort') {
        app.returnState();
        app.loadingErrorHandler(xhr, textStatus, errorThrown);
    }
};
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
    app.$loading.hide();
    app.showError(message);
};
app.qualityList = [];
app.initQualities = function() {
    var $items = $('#quality-items');
    $items.empty();
    app.areas[constants.AREA_PLAYER_QUALITY].y = 0;
    app.areas[constants.AREA_PLAYER_QUALITY].rows = app.qualityList.length;
    if (app.qualityList.length > 0) {
        var selected = 0;
        for (var i = 0; i < app.qualityList.length; i++) {
            var item = app.qualityList[i];
            var $item = $('<div class="filter-list-item" id="quality-item-0-' + i + '">' + item.name + '</div>');
            $item.data('url', item.url);
            $item.data('quality', item.name);
            if (i == selected) {
                $item.addClass('selected active');
                app.selectQuality($item);
            }
            $items.append($item);
        }
        app.areas[constants.AREA_PLAYER_QUALITY].y = selected;
    } else {
        app.returnState();
        app.showLoadingError(messages.ERROR_QUALITY_LIST_IS_EMPTY);
    }
};
app.isVideo = false;
app.playStream = function(channelName) {
	app.setState(constants.STATE_LOADING, app.stopLoading);
    app.$player.show();
    app.showLoading(messages.LOADING);
    app.loadingStream = $.get('https://api.twitch.tv/kraken/streams/?channel=' + channelName + '&stream_type=all', 'json').always(function() {
        app.loadingStream = null;
    }).done(function(data) {
        if (data._total === 0) {
            app.returnState();
            app.showLoadingError(messages.ERROR_STREAM_IS_OFFLINE);
        } else {
            app.loadingStream = $.get('https://api.twitch.tv/api/channels/' + channelName + '/access_token', 'json').always(function() {
                app.loadingStream = null;
            }).done(function(data) {
                app.loadingStream = $.get('http://usher.twitch.tv/api/channel/hls/' + channelName + '.m3u8?player_backend=html5&type=any&sig=' + data.sig + '&token=' + escape(data.token) + '&allow_source=true&allow_spectre=true&p=' + Math.round(Math.random() * 1e7)).always(function() {
                    app.loadingStream = null;
                }).done(function(data) {
                    app.isPaused = false;
                    app.isVideo = false;
                    comments.videoId = null;
                	app.setState(constants.STATE_WATCH, app.stop);
                    app.$loading.hide();
                    app.qualityList = m3u8.getStreamList(data);
                    app.initQualities();
                }).fail(app.loadingStreamErrorHandler);
            }).fail(app.loadingStreamErrorHandler);
        }
    }).fail(app.loadingStreamErrorHandler);
};
app.playVideo = function(id) {
    app.setState(constants.STATE_LOADING, app.stopLoading);
    app.$player.show();
    app.$playerTime.text(app.timeFormat(0));
    app.$playerProgress.data('current', 0);
    app.$playerProgressBar.css('width', '0%');
    $('#stream-quality').text('');
    app.showLoading(messages.LOADING);
    app.loadingStream = $.get('https://api.twitch.tv/api/vods/' + id + '/access_token', 'json').always(function() {
        app.loadingStream = null;
    }).done(function(data) {
        app.loadingStream = $.get('http://usher.ttvnw.net/vod/' + id + '.m3u8?player_backend=html5&nauthsig=' + data.sig + '&nauth=' + encodeURIComponent(data.token) + '&allow_source=true&allow_spectre=true&p=' + Math.round(Math.random() * 1e7)).always(function() {
            app.loadingStream = null;
        }).done(function(data) {
            app.isPaused = false;
            app.isVideo = true;
            comments.videoId = id;
        	app.setState(constants.STATE_WATCH, app.stop);
            app.$loading.hide();
            app.qualityList = m3u8.getStreamList(data);
            app.initQualities();
        }).fail(app.loadingStreamErrorHandler);
    }).fail(app.loadingStreamErrorHandler);
};
app.playerIsActive = function() {
    return app.state === constants.STATE_WATCH || 
        app.state === constants.STATE_WATCH_CONTROLS ||
        app.state === constants.STATE_SELECT_QUALITY;
};
app.play = function(url, saveState) {
    if (window.webapis) {
        var state = webapis.avplay.getState();
        webapis.avplay.stop();
        webapis.avplay.open(url);
        webapis.avplay.setListener({
            onbufferingstart: function() {
                if (app.playerIsActive()) {
                    app.showLoading(messages.BUFFERING + ' 0%');
                }
            },
            onbufferingprogress: function(percent) {
                if (app.playerIsActive()) {
                    app.showLoading(messages.BUFFERING + ' ' + percent + '%');
                }
            },
            onbufferingcomplete: function() {
                if (app.playerIsActive()) {
                    app.$loading.hide();
                    if (app.isPaused) {
                        try {
                            webapis.avplay.pause();
                        } catch (e) {}
                    } else {
                        try {
                            webapis.avplay.play();
                        } catch (e) {}
                    }
                }
            },
            oncurrentplaytime: function(currentTime) {
                if (currentTime > 0) {
                    app.updateProgressPosition(currentTime);
                    if (app.isVideo && comments.active) {
                        comments.show(currentTime / 1000);
                    }
                }
            },
            onevent: function(eventType, eventData) {},
            onerror: function(errorType) {
                if (app.state === constants.STATE_SELECT_QUALITY) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH_CONTROLS) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH) {
                    var message = messages.ERROR_LOADING_FAILED;
                    if (errorType === 'PLAYER_ERROR_CONNECTION_FAILED') {
                        message = messages.ERROR_CONNECTION_FAILED;
                    }
                    app.returnState();
                    app.showError(message);
                }
            },
            onstreamcompleted: function() {
                webapis.avplay.stop();
                app.isPaused = false;
                app.closeChat();
                if (app.state === constants.STATE_SELECT_QUALITY) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH_CONTROLS) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH) {
                    app.returnState();
                }
            }
        });
        app.updateDisplayRect();
        webapis.avplay.prepare();
        if (!saveState || !app.isPaused) {
            try {
                webapis.avplay.play();
                app.$controlPlayPause.find('i').removeClass('fa-play').addClass('fa-pause');
            } catch (e) {}
        }
    }
};
app.stopLoading = function() {
    app.$player.hide();
    app.$loading.hide();
    if (app.loadingStream) {
        app.loadingStream.abort();
        app.loadingStream = null;
    }
    if (app.refreshStreamInfoInterval) {
    	clearInterval(app.refreshStreamInfoInterval);
    	app.refreshStreamInfoInterval = null;
    }
};
app.stop = function() {
    if (window.webapis) {
        webapis.avplay.stop();
    }
    app.isPaused = false;
    app.closeChat();
    app.returnState();
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
    if (app.hasMoreResults && !app.loadingMoreResults && app.areas[constants.AREA_RESULTS].count < 900) {
        if (app.page === constants.PAGE_LIVE_CHANNELS) {
            app.loadingMoreResults = app.getLiveChannels(66, app.areas[constants.AREA_RESULTS].count, function() {
                app.loadingMoreResults = null;
            });
        } else if (app.page === constants.PAGE_VIDEOS) {
            app.loadingMoreResults = app.getVideos(66, app.areas[constants.AREA_RESULTS].count, function() {
                app.loadingMoreResults = null;
            });
        } else if (app.page === constants.PAGE_FOLLOWED) {
            app.loadingMoreResults = app.getFollowed(99, app.areas[constants.AREA_RESULTS].count, function() {
                app.loadingMoreResults = null;
            }, 'loadingMoreResults');
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
        } else if (app.page == constants.PAGE_FOLLOWED) {
            app.refreshing = app.getFollowed(99, 0, function() {
                app.refreshing = null;
            }, 'refreshing');
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
app.getLiveChannels = function(limit, offset, callback, filters) {
    var url = 'https://api.twitch.tv/kraken/streams?limit=' + limit + '&offset=' + offset;
    filters = filters || app.filters;
    if (filters.game) {
        url += '&game=' + encodeURIComponent(filters.game);
    }
    if (filters.channel) {
        url += '&channel=' + encodeURIComponent(filters.channel);
    }
    if (filters.languages && filters.languages.length > 0) {
        url += '&language=' + encodeURIComponent(filters.languages.join(','));
    }
    if (filters.streamType) {
        url += '&stream_type=' + encodeURIComponent(filters.streamType);
    }
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: url
    })).done(function(response) {
        //console.log(response);
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
	                <img src="' + stream.preview.large + '" onload="img.imageLoaded(this)" onerror="img.imageFailed(this)">\
	                <div class="stream-channel-name">' + stream.channel.display_name + '</div>\
	            </div>');
                $newCell.data('channel', stream.channel.name);
                $newCell.data('channel-id', stream.channel._id);
                $newCell.data('channel-name', stream.channel.display_name);
                $newCell.data('channel-logo', stream.channel.logo);
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
    }).fail(app.loadingErrorHandler).fail(function() {
        if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.RELOAD_RESULTS));
        }
    }).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.followedChannels = [];
app.getFollowedChannels = function(limit, offset, limit2, offset2, callback, variable) {
    var url = 'https://api.twitch.tv/kraken/users/' + app.filters.followedChannel.id + '/follows/channels?limit=' + limit + '&offset=' + offset;
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: url
    })).done(function(response) {
        if (response.follows.length > 0) {
            for (i = 0; i < response.follows.length; i++) {
                var user = response.follows[i];
                app.followedChannels.push(user.channel._id);
            }
            if (response._total > app.followedChannels.length) {
                app[variable] = app.getFollowedChannels(limit, offset + limit, limit2, offset2, callback, variable);
                return;
            }
        } else if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
            app.$loading.hide();
            app[variable] = null;
            return;
        }
        app[variable] = app.getLiveChannels(limit2, offset2, callback, {channel: app.followedChannels.join(',')});
    }).fail(app.loadingErrorHandler).fail(function() {
        if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.RELOAD_RESULTS));
        }
    });
};
app.getFollowed = function(limit, offset, callback, variable) {
    if (app.filters.followedChannel) {
        app.followedChannels = [];
        return app.getFollowedChannels(100, 0, limit, offset, callback, variable);
    } else {
        app.$itemsContainer.append($('<div class="column text"/>').text(messages.SELECT_CHANNEL));
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    }
};
app.getVideos = function(limit, offset, callback) {
    var name = 'vods';
    if (app.filters.videosChannel) {
        var url = 'https://api.twitch.tv/kraken/channels/' + app.filters.videosChannel.id + '/videos?limit=' + limit + '&offset=' + offset;
        if (app.filters.channelSort) {
            url += '&sort=' + encodeURIComponent(app.filters.channelSort);
        }
        name = 'videos';
    } else {
        var url = 'https://api.twitch.tv/kraken/videos/top?limit=' + limit + '&offset=' + offset;
        if (app.filters.game) {
            url += '&game=' + encodeURIComponent(app.filters.game);
        }
        if (app.filters.period) {
            url += '&period=' + encodeURIComponent(app.filters.period);
        }
        if (app.filters.sort) {
            url += '&sort=' + encodeURIComponent(app.filters.sort);
        }
    }
    if (app.filters.languages.length > 0) {
        url += '&language=' + encodeURIComponent(app.filters.languages.join(','));
    }
    if (app.filters.videoTypes.length > 0) {
        url += '&broadcast_type=' + encodeURIComponent(app.filters.videoTypes.join(','));
    }
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: url
    })).done(function(response) {
        //console.log(response);
        if (response[name].length > 0) {
            var i, ii, x, y, vod, $newCell;
            var countResults = app.areas[constants.AREA_RESULTS].count;
            var countRows = app.areas[constants.AREA_RESULTS].rows;
            var $newColumn = app.$itemsContainer.find('.column:last-child');
            for (i = 0; i < response[name].length; i++) {
                ii = i + countResults;
                if ((y = ii % countRows) == 0) {
                    $newColumn = $('<div class="column"/>');
                    app.$itemsContainer.append($newColumn);
                    app.areas[constants.AREA_RESULTS].columns++;
                }
                x = (ii - y) / countRows;
                vod = response[name][i];
                $newCell = $('<div class="cell" id="item-' + x + '-' + y + '">\
	                <i class="fa fa-fw fa-twitch"></i>\
	                <img src="' + vod.preview.large + '" onload="img.imageLoaded(this)" onerror="img.imageFailed(this)">\
	                <div class="stream-channel-name">' + vod.channel.display_name + '</div>\
	                <div class="stream-info">\
	                    <div class="channel-status ellipsed">' + vod.title + '</div>\
	                </div>\
	            </div>');
                $newCell.data('channel', vod.channel.name);
                $newCell.data('channel-id', vod.channel._id);
                $newCell.data('channel-name', vod.channel.display_name);
                $newCell.data('viewers', vod.views);
                $newCell.data('length', vod.status == 'recording' ? 0 : vod.length);
                $newCell.data('game', vod.game);
                $newCell.data('status', vod.title);
                $newCell.data('created', vod.created_at);
                $newCell.data('vod-id', vod._id.toString().replace(/[^0-9]/g, ''));
                $newColumn.append($newCell);
                if (ii == 0 && app.activeArea == constants.AREA_RESULTS) {
                    app.showStreamItem($newCell);
                }
            }
            app.areas[constants.AREA_RESULTS].count += response[name].length;
        } else if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$items.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$items);
        app.hasMoreResults = response[name].length > 0;
    }).fail(app.loadingErrorHandler).fail(function() {
        if (offset == 0) {
            app.$itemsContainer.append($('<div class="column text"/>').text(messages.RELOAD_RESULTS));
        }
    }).always(function() {
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
        //console.log(response);
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
                <img src="' + game.game.box.large + '" onload="img.imageLoaded(this)" onerror="img.imageFailed(this)">\
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
        //console.log(response);
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
                    <img src="' + game.box.large + '" onload="img.imageLoaded(this)" onerror="img.imageFailed(this)">\
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
app.getChannelsSearch = function(query, callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/search/channels/?limit=100&query=' + encodeURIComponent(query)
    })).done(function(response) {
        //console.log(response);
        if (response.channels.length > 0) {
            app.fillChannelsContainer(response.channels);
        } else {
            app.$channelsItemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$channelsItems.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$channelsItems);
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.getChannelSearch = function(query, callback) {
    return $.ajax($.extend({}, app.twitchApiOptions, {
        url: 'https://api.twitch.tv/kraken/search/channels/?limit=100&query=' + encodeURIComponent(query)
    })).done(function(response) {
        //console.log(response);
        if (response.channels.length > 0) {
            app.fillChannelContainer(response.channels);
        } else {
            app.$channelItemsContainer.append($('<div class="column text"/>').text(messages.EMPTY_RESULTS));
        }
        app.$channelItems.mCustomScrollbar('update');
        app.autoHideScrollbar(app.$channelItems);
    }).fail(app.loadingErrorHandler).always(function() {
        app.$loading.hide();
        if (typeof callback == 'function') {
            callback();
        }
    });
};
app.getComments = function(id, offset) {
    offset = offset || 0;
    var url = 'https://api.twitch.tv/v5/videos/' + id + '/comments?content_offset_seconds=' + offset;
};
app.fillChannelsContainer = function(channels) {
    var i, x, y, game, $newCell, $newColumn;
    var countRows = app.areas[constants.AREA_CHANNELS_RESULTS].rows;
    for (i = 0; i < channels.length; i++) {
        if ((y = i % countRows) == 0) {
            $newColumn = $('<div class="column"/>');
            app.$channelsItemsContainer.append($newColumn);
            app.areas[constants.AREA_CHANNELS_RESULTS].columns++;
        }
        x = (i - y) / countRows;
        channel = channels[i];
        var src = channel.logo ? channel.logo : '';
        var onError = channel.logo ? 'onerror="img.imageFailed(this)' : '';
        var checked = app.filters.channels[channel.name] !== undefined;
        var checkboxClass = checked ? 'fa-check-square-o' : 'fa-square-o';
        var divClass = checked ? 'active' : '';
        $newCell = $('<div class="cell channel-cell ' + divClass + '" id="channel-item-' + x + '-' + y + '">\
            <i class="fa fa-fw fa-twitch"></i>\
            <img src="' + src + '" onload="img.imageLoaded(this)" ' + onError + '"><img src="images/TwitchApp.png" style="width: 30vh;">\
            <div class="checkbox"><i class="fa ' + checkboxClass + '"></i></div>\
            <div class="channel-info">\
                <div class="channel-name ellipsed">' + channel.display_name + '</div>\
                <div class="channel-counter"><i class="fa fa-fw fa-user"></i> ' + app.numberFormat(channel.followers) + '</div>\
                <div class="channel-counter"><i class="fa fa-fw fa-eye"></i> ' + app.numberFormat(channel.views) + '</div>\
            </div>\
            <div class="clear">&nbsp;</div>\
        </div>');
        $newCell.data('id', channel._id);
        $newCell.data('display-name', channel.display_name);
        $newCell.data('name', channel.name);
        $newCell.data('views', channel.views);
        $newCell.data('followers', channel.followers);
        $newCell.data('avatar', channel.logo);
        $newColumn.append($newCell);
    }
};
app.fillChannelContainer = function(channels) {
    var i, x, y, game, $newCell, $newColumn;
    var countRows = app.areas[constants.AREA_CHANNELS_RESULTS].rows;
    for (i = 0; i < channels.length; i++) {
        if ((y = i % countRows) == 0) {
            $newColumn = $('<div class="column"/>');
            app.$channelItemsContainer.append($newColumn);
            app.areas[constants.AREA_CHANNELS_RESULTS].columns++;
        }
        x = (i - y) / countRows;
        channel = channels[i];
        var src = channel.logo ? channel.logo : '';
        var onError = channel.logo ? 'onerror="img.imageFailed(this)' : '';
        $newCell = $('<div class="cell channel-cell" id="videos-channel-item-' + x + '-' + y + '">\
            <i class="fa fa-fw fa-twitch"></i>\
            <img src="' + src + '" onload="img.imageLoaded(this)" ' + onError + '"><img src="images/TwitchApp.png" style="width: 30vh;">\
            <div class="channel-info">\
                <div class="channel-name ellipsed">' + channel.display_name + '</div>\
                <div class="channel-counter"><i class="fa fa-fw fa-user"></i> ' + app.numberFormat(channel.followers) + '</div>\
                <div class="channel-counter"><i class="fa fa-fw fa-eye"></i> ' + app.numberFormat(channel.views) + '</div>\
            </div>\
            <div class="clear">&nbsp;</div>\
        </div>');
        $newCell.data('id', channel._id);
        $newCell.data('display-name', channel.display_name);
        $newCell.data('name', channel.name);
        $newCell.data('views', channel.views);
        $newCell.data('followers', channel.followers);
        $newCell.data('avatar', channel.logo);
        $newColumn.append($newCell);
    }
};
app.showStreamItem = function($element) {
    var channelName = $element.data('channel-name');
    if ($element.data('created') !== undefined) {
        var date = new moment($element.data('created')).locale(navigator.language);
        channelName += '<br><small><small><small><i class="fa fa-calendar"></i> ' + date.format('L, LTS') + '</small></small></small>';
    }
    app.$selectBox.find('.stream-channel-name').html(channelName);
    var viewers = '<i class="fa fa-fw fa-eye"></i> ' + app.numberFormat($element.data('viewers'));
    if ($element.data('length') !== undefined) {
        viewers += '<br><i class="fa fa-fw fa-clock-o"></i> ' + ($element.data('length') > 0 ? app.timeFormat($element.data('length')) : '?');
    }
    app.$selectBox.find('.stream-viewers').html(viewers);
    app.$selectBox.find('.game-name').html($element.data('game') || '&nbsp;');
    app.$selectBox.find('.channel-status').html($element.data('status') || '&nbsp;');
    app.showItem($element, app.$items, app.$itemsContainer, app.$selectBox);
};
app.showChannelItem = function($element) {
    app.$channelsSelectBox.find('.channel-name').html($element.data('display-name'));
    app.$channelsSelectBox.find('.channel-followers').html('<i class="fa fa-fw fa-user"></i> ' + app.numberFormat($element.data('followers')));
    app.$channelsSelectBox.find('.channel-views').html('<i class="fa fa-fw fa-eye"></i> ' + app.numberFormat($element.data('views')));
    app.showItem($element, app.$channelsItems, app.$channelsItemsContainer, app.$channelsSelectBox);
};
app.showVideosChannelItem = function($element) {
    app.$channelSelectBox.find('.channel-name').html($element.data('display-name'));
    app.$channelSelectBox.find('.channel-followers').html('<i class="fa fa-fw fa-user"></i> ' + app.numberFormat($element.data('followers')));
    app.$channelSelectBox.find('.channel-views').html('<i class="fa fa-fw fa-eye"></i> ' + app.numberFormat($element.data('views')));
    app.showItem($element, app.$channelItems, app.$channelItemsContainer, app.$channelSelectBox);
};
app.showGameItem = function($element) {
    var data;
    if ((data = $element.data('viewers')) !== undefined) {
        app.$gameSelectBox.find('.game-viewers').html('<i class="fa fa-eye"></i> ' + app.numberFormat(data));
    } else {
        app.$gameSelectBox.find('.game-viewers').html('');
    }
    if ((data = $element.data('channels')) !== undefined) {
        app.$gameSelectBox.find('.game-channels').html('<i class="fa fa-video-camera"></i> ' + app.numberFormat(data));
    } else {
        app.$gameSelectBox.find('.game-channels').html('');
    }
    if ((data = $element.data('popularity')) !== undefined) {
        app.$gameSelectBox.find('.game-channels').html('<i class="fa fa-fire"></i> ' + app.numberFormat(data));
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
    if (change > 0) {
        $items.mCustomScrollbar('scrollTo', left, {
            scrollInertia: 0,
            timeout: 0
        });
    }
    if ($selectBox) {
        $selectBox.addClass('selected');
        $selectBox.width($element.width());
        $selectBox.height($element.height());
        var newOffset = $element.offset();
        newOffset.left -= left + scrollLeft;
        //newOffset.top = Math.floor(newOffset.top);
        $selectBox.offset(newOffset);
    }
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
    } else if (page === constants.PAGE_FOLLOWED) {
        app.$filters = app.$followedFilters;
        app.$followedFilters.show();
        app.areas[constants.AREA_FILTERS] = app.areas[constants.AREA_FOLLOWED_FILTERS];
    }
    if (app.activeArea === constants.AREA_FILTERS) {
        app.showCurrentFilter();
    }
    app.refresh(true);
};
app.activatePagesArea = function() {
    app.activeArea = constants.AREA_PAGES;
    app.showCurrentPage();
    //app.$videoFilterChannel.popover('hide');
};
app.activatePlayerControlsArea = function(reset) {
    app.activeArea = constants.AREA_PLAYER_CONTROLS;
    app.clearSelection(app.$player);
    if (reset) {
        app.areas[constants.AREA_PLAYER_CONTROLS].x = 1;
    }
    $('#control-item-' + app.areas[constants.AREA_PLAYER_CONTROLS].x + '-0').addClass('selected');
    app.$playerProgressSlider.popover('hide');
};
app.activatePlayerProgressArea = function() {
    app.activeArea = constants.AREA_PLAYER_PROGRESS;
    app.clearSelection(app.$player);
    app.$playerProgress.addClass('selected');
    var current = webapis.avplay.getCurrentTime() / 1000;
    app.$playerProgress.data('select', current);
    app.$playerProgressSlider.popover('show');
    app.updateProgressSelectPosition();
};
app.updateProgressSelectPosition = function() {
    var select = app.$playerProgress.data('select');
    var length = app.$playerProgress.data('length');
    var percent = Math.min(100, length > 0 ? select * 100 / length : 100);
    app.$playerProgressSelect.css('width', percent + '%');
    app.$playerProgressSlider.css('left', percent + '%');
    var popover = app.$playerProgressSlider.data('bs.popover');
    popover.options.content = app.timeFormat(select);
    app.$playerProgressSlider.popover('show');
};
app.updateProgressPosition = function(currentTime) {
    currentTime = currentTime || webapis.avplay.getCurrentTime();
    currentTime = currentTime / 1000;
    app.$playerTime.text(app.timeFormat(currentTime));
    var length = app.$playerProgress.data('length');
    app.$playerProgress.data('current', currentTime);
    var percent = length > 0 ? currentTime * 100 / length : 100;
    percent = Math.min(percent, 100);
    app.$playerProgressBar.css('width', percent + '%');
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
    app.storeCurrentPage();
};
app.selectVideosPage = function() {
    app.areas[constants.AREA_PAGES].x = 1;
    app.showPage(app.$videosPage, true);
    app.storeCurrentPage();
};
app.selectSubscriptionsPage = function() {
    app.areas[constants.AREA_PAGES].x = 2;
    app.showPage(app.$subscriptionsPage, true);
    app.storeCurrentPage();
};
app.storeCurrentPage = function() {
    localStorage.page = app.areas[constants.AREA_PAGES].x;
};
app.activateFiltersArea = function() {
    app.activeArea = constants.AREA_FILTERS;
    app.showCurrentFilter();
};
app.showCurrentFilter = function(direction) {
    app.clearSelection(app.$main);
    var x = app.areas[constants.AREA_FILTERS].x;
    var elem = app.$filters.find('.filter').get(x);
    if (elem.classList.contains('unused')) {
        app.areas[constants.AREA_FILTERS].x += direction;
        return app.showCurrentFilter(direction);
    }
    elem.classList.add('selected');
    /*if (elem.id == 'video-filter-channel' && !localStorage['hideVideoChannelPopover']) {
        app.$videoFilterChannel.popover('show');
    } else {
        app.$videoFilterChannel.popover('hide');
    }*/
};
app.loadingGames = null;
app.searchGameTimeout = null;
app.loadingChannels = null;
app.searchChannelTimeout = null;
app.selectCurrentFilter = function() {
    var x = app.areas[constants.AREA_FILTERS].x, type = app.$filters.find('.filter.selected').data('type');
    switch (type) {
        case 'game':
            app.$selectGame.show();
            if (app.filters.game) {
                app.$gameClear.show().find('.text').text(app.filters.game);
            } else {
                app.$gameClear.hide();
            }
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
            app.prepareChannelsSearch();
            if (Object.keys(app.filters.channels).length > 0) {
                app.fillChannelsContainer(Object.keys(app.filters.channels).map(function(key) {
                    return app.filters.channels[key];
                }));
                app.$channelsClear.show();
            } else {
                app.$channelsItemsContainer.append($('<div class="column text"/>').text(messages.CHANNELS_TYPE_TO_SEARCH));
                app.$channelsClear.hide();
            }
            app.$channelsItems.mCustomScrollbar('update');
            break;
        case 'channel':
            //app.$videoFilterChannel.popover('hide');
            localStorage['hideVideoChannelPopover'] = 1;
            app.$selectChannel.show();
            app.setState(constants.STATE_SELECT_CHANNEL, function() {
                app.$selectChannel.hide();
                app.$loading.hide();
            });
            app.activateChannelSearchArea();
            app.$channelSearchInput.val('');
            if (!app.$selectChannel.hasClass('init')) {
                app.$selectChannel.addClass('init');
                app.$channelItems.mCustomScrollbar(app.customScrollbarOptions);
                app.$channelItemsContainer = app.$channelItems.find('.mCSB_container');
            }
            app.prepareChannelSearch();
            if (app.filters.videosChannel) {
                app.$channelClear.show().find('.text').text(app.filters.videosChannel.name);
            } else {
                app.$channelClear.hide();
            }
            app.$channelItemsContainer.append($('<div class="column text"/>').text(messages.CHANNELS_TYPE_TO_SEARCH));
            app.$channelItems.mCustomScrollbar('update');
            break;
        case 'followed-channel':
            app.$selectChannel.show();
            app.setState(constants.STATE_SELECT_FOLLOWED_CHANNEL, function() {
                app.$selectChannel.hide();
                app.$loading.hide();
            });
            app.activateChannelSearchArea();
            app.$channelSearchInput.val('');
            if (!app.$selectChannel.hasClass('init')) {
                app.$selectChannel.addClass('init');
                app.$channelItems.mCustomScrollbar(app.customScrollbarOptions);
                app.$channelItemsContainer = app.$channelItems.find('.mCSB_container');
            }
            app.prepareChannelSearch();
            if (app.filters.followedChannel) {
                app.$channelClear.show().find('.text').text(app.filters.followedChannel.name);
            } else {
                app.$channelClear.hide();
            }
            app.$channelItemsContainer.append($('<div class="column text"/>').text(messages.CHANNELS_TYPE_TO_SEARCH));
            app.$channelItems.mCustomScrollbar('update');
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
        case 'video-type':
            app.$selectVideoType.show();
            app.setState(constants.STATE_SELECT_VIDEO_TYPE, function() {
                app.$selectVideoType.hide();
            });
            break;
        case 'period':
            app.$selectPeriod.show();
            app.setState(constants.STATE_SELECT_PERIOD, function() {
                app.$selectPeriod.hide();
            });
            break;
        case 'sort':
            if (app.filters.videosChannel) {
                app.$selectChannelSort.show();
                app.setState(constants.STATE_SELECT_CHANNEL_SORT, function() {
                    app.$selectChannelSort.hide();
                });
            } else {
                app.$selectSort.show();
                app.setState(constants.STATE_SELECT_SORT, function() {
                    app.$selectSort.hide();
                });
            }
            break;
    }
};
app.toggleLanguage = function($selectedItem) {
    var code = $selectedItem.data('code'), x;
    if (code === 'clear') {
        app.filters.languages = [];
        var $active = app.$selectLanguage.find('.active').each(function() {
            $(this).removeClass('active');
            $(this).find('input').prop('checked', false);
        });
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
    app.storeFilters();
};
app.toggleVideoType = function($selectedItem) {
    var type = $selectedItem.data('type'), x;
    if (type === 'clear') {
        app.filters.videoTypes = [];
        var $active = app.$selectVideoType.find('.active').each(function() {
            $(this).removeClass('active');
            $(this).find('input').prop('checked', false);
        });
    } else {
        var $input = $selectedItem.find('input');
        if ($selectedItem.hasClass('active')) {
            $selectedItem.removeClass('active');
            $input.prop('checked', false);
            while ((x = app.filters.videoTypes.indexOf(type)) !== -1) {
                app.filters.videoTypes.splice(x, 1);
            }
        } else {
            $selectedItem.addClass('active');
            $input.prop('checked', true);
            app.filters.videoTypes.push(type);
        }
    }
    if (app.filters.videoTypes.length > 0) {
        $('#video-filter-type').addClass('chosen').find('.text').text('(' + app.filters.videoTypes.length + ') ' + messages.FILTER_VIDEO_TYPE);
    } else {
        $('#video-filter-type').removeClass('chosen').find('.text').text(messages.FILTER_VIDEO_TYPE);
    }
    app.storeFilters();
};
app.toggleChannel = function($selectedItem) {
    var name = $selectedItem.data('name');
    var $checkbox = $selectedItem.find('.checkbox > i');
    var count = Object.keys(app.filters.channels).length;
    if ($selectedItem.hasClass('active')) {
        $selectedItem.removeClass('active');
        $checkbox.removeClass('fa-check-square-o').addClass('fa-square-o');
        delete app.filters.channels[name];
    } else {
        if (count >= 50) {
            return false;
        }
        $selectedItem.addClass('active');
        $checkbox.removeClass('fa-square-o').addClass('fa-check-square-o');
        app.filters.channels[name] = {
            _id: $selectedItem.data('id'),
            display_name: $selectedItem.data('display-name'),
            name: $selectedItem.data('name'),
            logo: $selectedItem.data('avatar'),
            followers: $selectedItem.data('followers'),
            views: $selectedItem.data('views')
        };
    }
    count = Object.keys(app.filters.channels).length;
    if (count > 0) {
        $('#stream-filter-channels').addClass('chosen').find('.text').text('(' + count + ') ' + messages.FILTER_STREAM_CHANNELS);
        var ids = [];
        for (i in app.filters.channels) {
            ids.push(app.filters.channels[i]._id);
        }
        app.filters.channel = ids.join(',');
        app.$channelsClear.show();
    } else {
        $('#stream-filter-channels').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_CHANNELS);
        app.filters.channel = null;
        app.$channelsClear.hide();
    }
    app.storeFilters();
    return true;
};
app.clearChannels = function() {
    app.filters.channels = {};
    app.filters.channel = null;
    $('#stream-filter-channels').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_CHANNELS);
    app.$channelsItemsContainer.find('.active').each(function() {
        var $checkbox = $(this).find('.checkbox > i');
        $(this).removeClass('active');
        $checkbox.removeClass('fa-check-square-o').addClass('fa-square-o');
    });
    app.$channelsClear.hide();
    app.storeFilters();
};
app.clearChannel = function() {
    app.filters.videosChannel = null;
    app.$videoFilterChannel.removeClass('chosen').find('.text').text(messages.FILTER_VIDEO_CHANNEL);
    app.$channelClear.hide();
    app.storeFilters();
    $('#video-filter-game').removeClass('unused');
    $('#video-filter-period').removeClass('unused');
    app.initSortFilter();
};
app.clearFollowedChannel = function() {
    app.filters.followedChannel = null;
    app.$followedFilterChannel.removeClass('chosen').find('.text').text(messages.FILTER_FOLLOWED_CHANNEL);
    app.$channelClear.hide();
    app.storeFilters();
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
    app.storeFilters();
};
app.selectPeriod = function($selectedItem) {
    var period = $selectedItem.data('period');
    app.$selectPeriod.find('.active').removeClass('active');
    $selectedItem.addClass('active');
    if (period === 'week') {
        app.filters.period = null;
        $('#video-filter-period').removeClass('chosen').find('.text').text(messages.FILTER_VIDEO_PERIOD);
    } else {
        app.filters.period = period;
        $('#video-filter-period').addClass('chosen').find('.text').text($selectedItem.text());
    }
    app.storeFilters();
};
app.selectSort = function($selectedItem) {
    var sort = $selectedItem.data('sort');
    app.$selectSort.find('.active').removeClass('active');
    $selectedItem.addClass('active');
    if (sort === 'views') {
        app.filters.sort = null;
    } else {
        app.filters.sort = sort;
    }
    app.initSortFilter();
    app.storeFilters();
};
app.selectChannelSort = function($selectedItem) {
    var sort = $selectedItem.data('sort');
    app.$selectChannelSort.find('.active').removeClass('active');
    $selectedItem.addClass('active');
    if (sort === 'recent') {
        app.filters.channelSort = null;
    } else {
        app.filters.channelSort = sort;
    }
    app.initSortFilter();
    app.storeFilters();
};
app.selectQuality = function($selectedItem) {
    var url = $selectedItem.data('url');
    app.$selectQuality.find('.active').removeClass('active');
    $selectedItem.addClass('active');
    $('#stream-quality').text($selectedItem.data('quality'));
    var currentTime = webapis.avplay.getCurrentTime();
    app.play(url, true);
    if (currentTime) {
        webapis.avplay.seekTo(currentTime);
    }
};
app.selectGame = function(game) {
    app.filters.game = game;
    $('.filter-game').addClass('chosen').find('.text').text(game);
    app.$gameClear.show().find('.text').text(game);
    app.storeFilters();
};
app.selectChannel = function(channelInfo) {
    app.filters.videosChannel = channelInfo;
    app.$videoFilterChannel.addClass('chosen').find('.text').text(channelInfo.name);
    app.$channelClear.show().find('.text').text(channelInfo.name);
    app.storeFilters();
    $('#video-filter-game').addClass('unused');
    $('#video-filter-period').addClass('unused');
    app.initSortFilter();
};
app.selectFollowedChannel = function(channelInfo) {
    app.filters.followedChannel = channelInfo;
    app.$followedFilterChannel.addClass('chosen').find('.text').text(channelInfo.name);
    app.$channelClear.show().find('.text').text(channelInfo.name);
    app.storeFilters();
};
app.clearGame = function() {
    app.filters.game = null;
    $('.filter-game').removeClass('chosen').find('.text').text(messages.FILTER_STREAM_GAME);
    app.$gameClear.hide();
    app.storeFilters();
};
app.prepareGamesSearch = function() {
    app.showLoading(messages.LOADING);
    app.clearItems(app.$gameItems, app.$gameItemsContainer);
    app.areas[constants.AREA_GAME_RESULTS].columns = 0;
    app.areas[constants.AREA_GAME_RESULTS].x = 0;
    app.areas[constants.AREA_GAME_RESULTS].y = 0;
};
app.prepareChannelsSearch = function() {
    app.clearItems(app.$channelsItems, app.$channelsItemsContainer);
    app.areas[constants.AREA_CHANNELS_RESULTS].columns = 0;
    app.areas[constants.AREA_CHANNELS_RESULTS].x = 0;
    app.areas[constants.AREA_CHANNELS_RESULTS].y = 0;
};
app.prepareChannelSearch = function() {
    app.clearItems(app.$channelItems, app.$channelItemsContainer);
    app.areas[constants.AREA_CHANNELS_RESULTS].columns = 0;
    app.areas[constants.AREA_CHANNELS_RESULTS].x = 0;
    app.areas[constants.AREA_CHANNELS_RESULTS].y = 0;
};
app.activateItemsArea = function() {
    app.activeArea = constants.AREA_RESULTS;
    app.clearSelection(app.$main);
    var $activeCell = $('#item-' + app.areas[constants.AREA_RESULTS].x + '-' + app.areas[constants.AREA_RESULTS].y);
    app.showStreamItem($activeCell);
    //app.$videoFilterChannel.popover('hide');
};
app.activateGameItemsArea = function() {
    app.activeArea = constants.AREA_GAME_RESULTS;
    app.clearSelection(app.$selectGame);
    var $activeCell = $('#game-item-' + app.areas[constants.AREA_GAME_RESULTS].x + '-' + app.areas[constants.AREA_GAME_RESULTS].y);
    app.showGameItem($activeCell);
};
app.activateChannelItemsArea = function() {
    app.activeArea = constants.AREA_CHANNELS_RESULTS;
    app.clearSelection(app.$selectChannels);
    var $activeCell = $('#channel-item-' + app.areas[constants.AREA_CHANNELS_RESULTS].x + '-' + app.areas[constants.AREA_CHANNELS_RESULTS].y);
    app.showChannelItem($activeCell);
};
app.activateVideosChannelItemsArea = function() {
    app.activeArea = constants.AREA_CHANNELS_RESULTS;
    app.clearSelection(app.$selectChannel);
    var $activeCell = $('#videos-channel-item-' + app.areas[constants.AREA_CHANNELS_RESULTS].x + '-' + app.areas[constants.AREA_CHANNELS_RESULTS].y);
    app.showVideosChannelItem($activeCell);
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
app.activateChannelsClearArea = function() {
    app.activeArea = constants.AREA_CHANNELS_CLEAR;
    app.clearSelection(app.$selectChannels);
    app.$channelsClear.addClass('selected');
};
app.activateChannelSearchArea = function() {
    app.activeArea = constants.AREA_CHANNELS_SEARCH;
    app.clearSelection(app.$selectChannel);
    app.$channelSearchInput.addClass('selected');
};
app.activateChannelClearArea = function() {
    app.activeArea = constants.AREA_CHANNELS_CLEAR;
    app.clearSelection(app.$selectChannel);
    app.$channelClear.addClass('selected');
};
app.clearSelection = function($parent) {
    $('.selected', $parent).removeClass('selected');
};
app.numberFormat = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, app.thousandsSeparator);
};
app.timeFormat = function(seconds) {
    var hh = Math.floor(seconds / 3600),
        mm = Math.floor(seconds / 60) % 60,
        ss = Math.floor(seconds) % 60;

    return (hh < 10 ? '0' : '') + hh + ':' + 
        ((mm < 10) ? '0' : '') + mm + ':' + 
        ((ss < 10) ? '0' : '') + ss;
};
app.storeFilters = function() {
    localStorage['filters'] = JSON.stringify(app.filters);
};
app.restoreFilters = function() {
    if (localStorage['filters'] !== undefined) {
        app.filters = JSON.parse(localStorage['filters']);
    }
};
app.chatAppend = function(color, name, message) {
    if (app.$chatContent.get(0).children.length > 240) {
        app.$chatContent.children('div:first').remove();
    }
    var $newMessage = $('<div class="chat-message"/>').html('<b style="color: ' + color + ';">' + name + '</b>: ' + message);
    app.$chatContent.append($newMessage);
    if (app.chatAutoScroll && app.chatIsActive) {
        app.$chat.scrollTo($newMessage);
    }
};

chat = {
    ws: null,
    open: function(channel) {
        chat.close();
        chat.ws = new WebSocket('ws://irc-ws.chat.twitch.tv');
        chat.ws.onopen = function() {
            app.$chatContent.empty().show();
            app.$chatLoading.hide();
            chat.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            chat.ws.send('NICK justinfan' + Math.floor((Math.random() * 80000) + 1000));
            chat.ws.send('JOIN #' + channel);
        };
        chat.ws.onmessage = function(event) {
            //console.log(event.data);
            if (/:tmi.twitch.tv 001 justinfan\d+ :Welcome, GLHF!/.test(event.data)) {
                app.$chatContent.append($('<div class="chat-message"/>').html(messages.CHAT_GREETING));
            } else if (event.data.lastIndexOf('PING', 0) === 0) {
                chat.ws.send('PONG :tmi.twitch.tv');
            } else {
                var reg = /^@(.+) :([^\!]*)!([^@]*)@([^\.]*).tmi.twitch.tv PRIVMSG #([^ ]*) :(.*)/;
                var result;
                if (result = reg.exec(event.data)) {
                    var message = result[6];
                    var options = {};
                    var optionStrings = result[1].split(';');
                    for (var i = 0; i < optionStrings.length; i++) {
                        var pairs = optionStrings[i].split('=');
                        if (pairs.length == 2) {
                            options[pairs[0]] = pairs[1];
                        }
                    }
                    var color = options.color || '#000000';
                    var name = (options['display-name'] || '').replace('\\:', ';').replace('\\s', ' ').replace('\\\\', '\\') || result[2];
                    if (message.indexOf('\u0001ACTION') === 0) {
                        message = message.replace(/^\u0001ACTION /, '').replace(/\u0001$/, '');
                    } else if (message.indexOf(' \x01ACTION') === 0) {
                        message = message.replace(/^ \x01ACTION /, '').replace(/\x01$/, '');
                    }
                    if (options.emotes) {
                        var emoticons = options.emotes.split('/');
                        var emotes = {};
                        for (var i = 0; i < emoticons.length; i++) {
                            var parts = emoticons[i].split(':');
                            var id = parts[0];
                            var replaces = parts[1].split(',');
                            for (var j = 0; j < replaces.length; j++) {
                                var parts = replaces[j].split('-');
                                if (parts.length == 2) {
                                    var min = parseInt(parts[0]),
                                        max = parseInt(parts[1]),
                                        version = $(window).height() > 1100 ? '2.0' : '1.0';
                                    emotes[min] = '<img src="http://static-cdn.jtvnw.net/emoticons/v1/' + id + '/' + version + '" class="chat-emote">';
                                    for (var k = min + 1; k <= max; k++) {
                                        emotes[k] = '';
                                    }
                                }
                            }
                        }
                        var newMessage = '';
                        for (var i = 0; i < message.length; i++) {
                            if (emotes[i] === undefined) {
                                newMessage += message[i];
                            } else {
                                newMessage += emotes[i];
                            }
                        }
                        message = newMessage;
                    }
                    app.chatAppend(color, name, message);
                }
            }
        };
        chat.ws.onerror = function(error) {
            //console.log(error.message);
        };
        chat.ws.onclose = function(event) {
            /*if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);*/
        };
    },
    close: function() {
        if (chat.ws) {
            chat.ws.close();
            chat.ws = null;
        }
    }
};

comments = {
    active: false,
    videoId: null,
    xhrLoading: null,
    messages: [],
    nextMessage: null,
    nextPage: null,
    open: function(offset) {
        comments.close();
        comments.active = true;
        offset = offset || 0;
        if (comments.videoId) {
            comments.xhrLoading = $.get('https://api.twitch.tv/v5/videos/' + comments.videoId + '/comments?client_id=q5ix3v5d0ot12koqr7paerntdo5gz9&content_offset_seconds=' + offset, function(data) {
                app.$chatContent.empty().show();
                app.$chatLoading.hide();
                if (data.comments) {
                    comments.messages = [];
                    for (var i = data.comments.length - 1; i >= 0; i--) {
                        var comment = data.comments[i];
                        comments.messages.push({
                            offset: comment.content_offset_seconds,
                            user: comment.commenter.display_name || comment.commenter.name,
                            color: comment.message.user_color || '#000000',
                            fragments: comment.message.fragments
                        });
                    }
                }
                comments.nextPage = data._next || null;
            }, 'json').always(function() {
                comments.xhrLoading = null;                
            });
        }
    },
    show: function(offset) {
        if (comments.videoId) {
            var comment = comments.nextMessage || comments.messages.pop();
            while (comment && comment.offset < offset) {
                 var message = ''; //app.timeFormat(comment.offset) + ' - '
                 for (var i = 0; i < comment.fragments.length; i++) {
                     var fragment = comment.fragments[i];
                     if (fragment.emoticon) {
                         message += '<img src="http://static-cdn.jtvnw.net/emoticons/v1/' + fragment.emoticon.emoticon_id + '/' + ($(window).height() > 1100 ? '2.0' : '1.0') + '" class="chat-emote">';
                     } else {
                         message += fragment.text;
                     }
                 }
                 app.chatAppend(comment.color, comment.user, message);
                 comment = comments.messages.pop();
            }
            comments.nextMessage = comment;
            if (comments.messages.length < 20 && comments.nextPage && !comments.xhrLoading) {
                comments.xhrLoading = $.get('https://api.twitch.tv/v5/videos/' + comments.videoId + '/comments?client_id=q5ix3v5d0ot12koqr7paerntdo5gz9&cursor=' + comments.nextPage, function(data) {
                    if (data.comments) {
                        var messages = [];
                        for (var i = data.comments.length - 1; i >= 0; i--) {
                            var comment = data.comments[i];
                            messages.push({
                                offset: comment.content_offset_seconds,
                                user: comment.commenter.display_name || comment.commenter.name,
                                color: comment.message.user_color || '#000000',
                                fragments: comment.message.fragments
                            });
                        }
                        for (var i = 0; i < comments.messages.length; i++) {
                            messages.push(comments.messages[i]);
                        }
                        comments.messages = messages;
                    }
                    comments.nextPage = data._next || null;
                }, 'json').always(function() {
                    comments.xhrLoading = null;                
                });
            }
        }
    },
    close: function() {
        if (comments.active) {
            comments.active = false;
            comments.messages = [];
            comments.nextMessage = null;
            comments.nextPage = null;
            if (comments.xhrLoading) {
                comments.xhrLoading.abort();
                comments.xhrLoading = null;
            }
        }
    }
};

img = {
    imageLoaded: function(img) {
        img.classList.add('loaded');
        $(img).siblings('i').hide();
    },
    imageFailed: function(img) {
        $(img).siblings('i').addClass('danger');
    }
};

if (window.tizen) {
    tizen.tvinputdevice.registerKey("Tools");
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("ColorF0Red");
    tizen.tvinputdevice.registerKey("ColorF1Green");
    tizen.tvinputdevice.registerKey("ColorF2Yellow");
    tizen.tvinputdevice.registerKey("ColorF3Blue");
    tizen.tvinputdevice.registerKey("ChannelUp");
    tizen.tvinputdevice.registerKey("ChannelDown");
}

setTimeout(function() {
    if (window.webapis && webapis.network) {
        webapis.network.addNetworkStateChangeListener(function (value) {
            if (value === webapis.network.NetworkState.GATEWAY_DISCONNECTED) {
                if (app.state === constants.STATE_SELECT_QUALITY) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH_CONTROLS) {
                    app.returnState();
                }
                if (app.state === constants.STATE_WATCH) {
                    app.returnState();
                    app.showError(messages.ERROR_NETWORK_DISCONNECTED);
                }
                $('#logo').attr('src', 'images/TwitchAppDisconnected.png');
            } else if (value === webapis.network.NetworkState.GATEWAY_CONNECTED){
                $('#logo').attr('src', 'images/TwitchApp.png');
            }
        });
    } 
}, 2000);

window.onload = app.init;