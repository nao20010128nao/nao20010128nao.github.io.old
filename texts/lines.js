self.onmessage = function (e) {
    var data = e.data;
    var res = "";
    var times = e.repeat;
    for (var i = 0; i < times; i++) {
        res += "\n";
    }
    self.postMessage(res);
};