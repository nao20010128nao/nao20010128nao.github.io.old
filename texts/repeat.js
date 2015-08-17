self.onmessage = function (e) {
    var data = e.data;
    var res = "";
    var times = e.repeat;
    var text = e.text;
    for (var i = 0; i < times; i++) {
        res += text;
    }
    self.postMessage(res);
};