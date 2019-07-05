(function(window) {
  	if(typeof(window.kairosLib) === 'undefined'){
    	window.kairosLib = {
    		init: init,
    		subscribe: subscribe,
    		unsubscribe: unsubscribe,
    		tempSubscribe: tempSubscribe,
    		clearTempSubscribe: clearTempSubscribe
    	}
  	}

	if (typeof(config) === 'undefined' || typeof(config.kairos) === 'undefined') {
		throw 'Kairos config not found';
	}

  	kairosLib.init(config);
})(window);

var tempChanels = [];
var socket;

function init(config) {
	socket = socketCluster.connect(config.kairos);

	socket.on('disconnect', function () {
		callFunction('disconnect');
	});
}

function tempSubscribe(channel) {
	if (subscribe(channel) === true) {
		return true;
	}

	tempChanels.push(channel);
}

function clearTempSubscribe() {
	for (var i = 0; i < tempChanels.length; i++) {
		unsubscribe(tempChanels[i]);
	}

	tempChanels = [];
}

function subscribe(channel) {
    if (verifySubscribe(channel)) {
    	return true;
    }

    var subscribeChannel = socket.subscribe(channel);

    subscribeChannel.watch(function(data) {
        processRealTimeData(data);
    });

    subscribeChannel.on('subscribeFail', function (err) {
    	callFunction('subscribeFail');
    });

    return subscribeChannel;
}

function processRealTimeData(realTimeData) {
    var jsonData = JSON.parse(realTimeData);
    var event = jsonData.message.event;

    callFunction(event, jsonData);
}

function unsubscribe(channel) {
    return socket.unsubscribe(channel);
}

function verifySubscribe(channel) {
	return socket.isSubscribed(channel)
}

function callFunction(functionName, data) {
	if(typeof(window[functionName]) !== 'undefined'){
		window[functionName](data);
	}
}