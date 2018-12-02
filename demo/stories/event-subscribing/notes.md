You can subscribe functions to events. Just run `accordion.on('someEvent', event => {···})` and your function will be triggered when the event is fired. You can subscribe as many times as you need on a single event.

In this example, `activateEntry` and `deactivateEntry` events are subscribed to launch an alert that shows the entry id from the incoming event data.

((source))
