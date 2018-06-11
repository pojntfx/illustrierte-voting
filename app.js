const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

// Serve the frontend and listen on 8080
server.listen(8080);
app.use(express.static(__dirname + "/frontend"));

class Voting {
  constructor() {
    // Configuration
    this.metadata = {
      num_students: 22, // Maximum amount of voters (22 in my case, all students in my class)
      quorum: 20 // Minimum amount of votes to be meaningfull
    };

    // Set initial values
    this.viewers = 0;
    this.status_msg = "";
    this.votes = {};

    // Bind methods to class
    this.resetCounts = this.resetCounts.bind(this);
    this.registerWebSockets = this.registerWebSockets.bind(this);

    // Reset the counts initially
    this.resetCounts();

    // Register the WebSocket event handlers
    this.registerWebSockets();
  }

  /**
   * Reset the vote counts and status message
   */
  resetCounts() {
    this.votes.veronika = 0;
    this.votes.serpentina = 0;
    this.status_msg = "";
  }

  /**
   * Add WebSocket event listeners
   */
  registerWebSockets() {
    io.sockets.on("connection", socket => {
      socket.on("update_votes", (choice, value) => {
        this.votes[choice] = parseInt(value);
        socket.broadcast.emit("update_counts", this.votes);
      });

      socket.on("reset", () => {
        this.resetCounts();
        io.sockets.emit("update_counts", this.votes);
        io.sockets.emit("update_status", this.status_msg);
      });

      socket.on("update_status", msg => {
        this.status_msg = msg;
        socket.broadcast.emit("update_status", this.status_msg);
      });

      socket.on("addstream", () => {
        this.viewers += 1;
        io.sockets.emit("update_viewers", this.viewers);
        socket.emit("update_metadata", this.metadata);
        socket.emit("update_counts", this.votes);
        socket.emit("update_status", this.status_msg);
      });

      socket.on("disconnect", data => {
        this.viewers -= 1;
        socket.broadcast.emit("update_viewers", this.viewers);
      });
    });
  }
}

// Start the voting app
const voting = new Voting();
