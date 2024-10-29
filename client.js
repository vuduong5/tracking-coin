const WebSocket = require('ws');

class WebSocketService {
  constructor(url) {
    this.url = url;
    this.socket = null;
  }

  // Initialize the WebSocket connection
  connect() {
    this.socket = new WebSocket(this.url);

    // Listen for 'open' event
    this.socket.on('open', () => {
      console.log('WebSocket connection opened');
      this.onOpen();
    });

    // Listen for messages from the server
    this.socket.on('message', (message) => {
      console.log(`Received message from server: ${message}`);
      this.onMessage(message);
    });

    // Listen for 'close' event
    this.socket.on('close', () => {
      console.log('WebSocket connection closed');
      this.onClose();
    });

    // Listen for any errors
    this.socket.on('error', (error) => {
      console.error(`WebSocket error: ${error}`);
    });
  }

  // Method to handle the 'open' event
  onOpen() {
    console.log('Connection opened - you can now send messages');
  }

  // Method to handle incoming messages
  onMessage(message) {
    console.log('Message received:', message);
  }

  // Method to handle the 'close' event
  onClose() {
    console.log('Connection closed - reconnecting logic can go here if needed');
  }

  // Method to send a message to the server
  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log(`Sent message: ${message}`);
    } else {
      console.log('WebSocket is not open. Message not sent.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket connection manually closed');
    }
  }
}

module.exports = WebSocketService;
