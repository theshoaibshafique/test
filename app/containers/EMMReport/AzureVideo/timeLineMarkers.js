let duration = 0;
export let createTimelineMarkerPlugin = (videoID) => {amp.plugin(`${videoID}`, function (options) {
    var player = this;
    player.addEventListener(amp.eventName.durationchange, function () {
    duration  = player.duration();
    var progressControlSlider = getElementsByClassName("vjs-progress-control", "vjs-slider");
    function getElementsByClassName(className, childClass) {
        var elements = document.getElementById(videoID).getElementsByClassName(className);
        var matches = [];

        function traverse(node) {
            if (node && node.childNodes) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    if (node.childNodes[i].childNodes.length > 0) {
                        traverse(node.childNodes[i]);
                    }

                    if (node.childNodes[i].getAttribute && node.childNodes[i].getAttribute('class')) {
                        if (node.childNodes[i].getAttribute('class').split(" ").indexOf(childClass) >= 0) {
                            matches.push(node.childNodes[i]);
                        }
                    }
                }
            }
        }
        if (!childClass)
            return elements && elements.length > 0 ? elements[0] : null;

        if (elements && elements.length > 0) {
            for (var i = 0; i < elements.length; i++)
                traverse(elements[i]);
        }
        return matches && matches.length > 0 ? matches[0] : null;
    }

    if (progressControlSlider) {
        for (var index = 0; index < options.markertime.length; index++) {
            var marker = options.markertime[index];               
            if (marker) {
                var secs = marker;
                if (secs >= 0 && secs <= duration) {
                    var markerLeftPosition = (secs / duration * 100);
                    var div = document.createElement('div');
                    div.className = "amp-timeline-marker";
                    div.style.left = markerLeftPosition + "%";
                    div.innerHTML = "&nbsp;&nbsp;"
                    progressControlSlider.appendChild(div);
                }
            }
        }
    }
});



    


   

});
};