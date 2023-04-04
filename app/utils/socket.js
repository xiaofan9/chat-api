class Socket {
  constructor (eventStream) {
    this.eventStream = eventStream;
  }

  add(event, data) {
    this.eventStream.push(`event:${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  end() {
    this.eventStream.push(null);
    this.eventStream.destroy();
  }
}

module.exports = Socket;
