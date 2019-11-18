module.exports = {
  handshake: (req, next) => {
    const baseUrl = req.socket.request.url;
    const parseUrl = baseUrl.split('?auth=');
    const auth = parseUrl[1] || 'null';
    const handshakeHash = process.env.KAIROS_HANDSHAKE_HASH || '';
    if (auth !== handshakeHash) {
      const socketId = req.socket.id;
      const err = new Error(`Client: ${socketId} - Server rejected handshake from client`);
      err.code = 4003;
      next(err);
    } else {
      next();
    }
  },
  actions: (req, next) => {
    if (req.socket.authState === 'unauthenticated' || req.socket.authToken.sub !== 'kairos') {
      const socketId = req.socket.id;
      const err = new Error(`Client: ${socketId} - Server rejected action. Unauthenticated`);
      err.code = 401;
      next(err);
    } else {
      next();
    }
  },
};
