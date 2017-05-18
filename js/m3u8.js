var m3u8 = {
    NON_QUOTED_COMMA: /,(?=(?:[^"]|"[^"]*")*$)/,
    KV_SPLITTER: /="?([^"]*)/,
    KEY_PREFIX: '#EXT-X-',
    read: function(playlist) {
        var lines = playlist.toString().split('\n');
        if (!lines.length || !m3u8.startsWith(lines[0], '#EXTM3U')) {
            return [];
        }
        lines = lines.slice(1);
        var length = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = m3u8.trim(lines[i]);
            lines[length] = m3u8.startsWith(line, '#') ? m3u8.transform(line) : line;
            if (lines[length]) {
                length++;
            }
        }
        lines.length = length;

        return lines;
    },
    transform: function(line) {
        var splitted = m3u8.split(line);
        var obj = {};
        obj[m3u8.normalize(splitted[0])] = splitted.length > 1 ? m3u8.parseParams(splitted[1]) : undefined;

        return obj;
    },
    parseParams: function(line) {
        var pairs = m3u8.filter(line.split(m3u8.NON_QUOTED_COMMA));
        var attrs = {};
        for (var i = 0; i < pairs.length; i++) {
            var kvList = pairs[i].split(m3u8.KV_SPLITTER);
            if (pairs.length === 1 && kvList.length === 1) {
                return kvList[0];
            }
            attrs[m3u8.trim(kvList[0])] = kvList.length > 1 ? m3u8.trim(kvList[1]) : undefined;
        }
        
        return attrs;
    },
    normalize: function(key) {
        return m3u8.startsWith(key, m3u8.KEY_PREFIX) ? 
            key.slice(m3u8.KEY_PREFIX.length) : 
            m3u8.startsWith(key, '#') ? key.slice(1) : key;
    },
    split: function(line) {
        var pos = line.indexOf(':');
        return pos > 0 ? [line.slice(0, pos), line.slice(pos + 1)] : [line];
    },
    startsWith: function(s, prefix) {
        if (typeof s !== 'string') {
            return false;
        }
        if (typeof s.startsWith === 'function') {
            return s.startsWith(prefix);
        }
        
        return s.indexOf(prefix) === 0;
    },
    trim: function(str) {
        return (typeof str.trim === 'function') ? str.trim() : str.replace(/^\s*|\s*$/g, '');
    },
    filter: function(arr) {
        var length = 0;
        for (var i = 0; i < arr.length; ++i) {
            arr[length] = m3u8.trim(arr[i]);
            if (arr[length]) {
                length += 1;
            }
        }
        arr.length = length;

        return arr;
    }
};



