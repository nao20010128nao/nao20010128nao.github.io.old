/*
 *Kanamozic in Javascript
 *Created by nao20010128nao
 */
(function (global) {
    var CONVERT_ENGLETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var CONVERT_JPNLETTERS = "あいうえおかきくけこさしすせそたちつてとなにぬねのはアイウエオカキクケコサシスセソタチツテトナニヌネノハんをわろれるりらよゆンワ";
    var FULL_JPNLETTERS = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    if (global.KanamozicCore)
        return;

    function isOnlyKanas(s) {
        for (var i = 0; i < s.length ; i++) {
            if (FULL_JPNLETTERS.indexOf(s.charAt(i), 0) == -1)
                return false;
        }
        return true;
    }

    function encode(s, key) {
        if (isOnlyKanas(s)) {
            return 'が' + encodeKana(s, key);
        } else {
            return 'ぎ' + encodeBinary(s, key);
        }
    }
    function encodeKana(s, key) {
        var buf = "";
        for (var i = 0; i < s.length ; i++) {
            var value = s.charAt(i);
            var offset = FULL_JPNLETTERS.indexOf(value);
            var requiredOffset = (offset + key) % FULL_JPNLETTERS.length();
            buf += FULL_JPNLETTERS.charAt(requiredOffset);
        }
        return buf;
    }
    function encodeBinary(s, key) {
        s = encodeBase64(s);
        var buf = "";
        for (var i = 0; i < s.length; i++) {
            var value = s.charAt(i);
            var offset = CONVERT_ENGLETTERS.indexOf(value);
            var requiredOffset = (offset + key) % CONVERT_JPNLETTERS.length();
            buf += CONVERT_JPNLETTERS.charAt(requiredOffset);
        }
        return buf;
    }

    function decode(s, key) {
        if (s.charAt(0) == 'が') {
            return decodeKana(s.substring(1), key);
        } else if (s.charAt(0) == 'ぎ') {
            return decodeBinary(s.substring(1), key);
        } else {
            throw new Error(s + " is incorrect format. The string must start with 'が'(ga) or 'ぎ'(gi).");
        }
    }
    function decodeKana(s, key) {
        var buf = "";
        var baseLen = FULL_JPNLETTERS.length;
        for (var i = 0; i < s.length() ; i++) {
            var value = s.charAt(i);
            var offset = FULL_JPNLETTERS.indexOf(value);
            var requiredOffset = increaseIfNegative(offset - key, baseLen) % baseLen;
            buf += FULL_JPNLETTERS.charAt(requiredOffset);
        }
        return buf;
    }
    function decodeBinary(s, key) {
        var buf = "";
        var baseLen = CONVERT_ENGLETTERS.length;
        for (var i = 0; i < s.length; i++) {
            var value = s.charAt(i);
            var offset = CONVERT_JPNLETTERS.indexOf(value);
            var requiredOffset = increaseIfNegative(offset - key, baseLen) % baseLen;
            buf += CONVERT_ENGLETTERS.charAt(requiredOffset);
        }
        return decodeBase64(buf);
    }

    function increaseIfNegative(value, once) {
        while (value < 0) {
            value += once;
        }
        return value;
    }


    function encodeBase64(s) {
        return Base64.toBase64(s, 0).split("=")[0].replace(/\r\n/g, "\n");
    }
    function decodeBase64(s) {
        function padEnough(s) {
            while ((s.length % 4) != 0) {
                s += "=";
            }
            return s;
        }
        return Base64.fromBase64(padEnough(s));
    }

    global.KanamozicCore = global.Kanamozic = { encode: encode, decode: decode };
})(this);