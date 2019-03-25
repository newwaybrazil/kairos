Kairos
=======

Simple Node.js App to listen Redis PubSub Channels and publishing in SocketCluster WebSocket to subscribed Clients.

It switch between Redis if the active lost connection, and try to reconnect to unhealth one without interrupt message service.
