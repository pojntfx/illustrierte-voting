const SOCKET_URL = "/", //DIE_ILLUSTRIERTE_VOTING_SOCKET
  socket = io.connect(SOCKET_URL);

// Helper
let lastVoter = "";

class VotingEdit {
  constructor() {
    // Bind methods to class
    this.registerEventListeners = this.registerEventListeners.bind(this);
    this.updateStatus = this.updateStatus.bind(this);

    // Register the WebSocket event handlers
    this.registerEventListeners();
  }

  registerEventListeners() {
    socket.on("connect", () => {
      socket.emit("addstream");
    });

    socket.on("update_counts", votes => {
      for (var choice in votes) {
        $("#" + choice).attr("value", votes[choice]);
      }
      // console.log(votes);
      serpentina.votes = votes.serpentina;
      veronika.votes = votes.veronika;
      // console.log(votesSerpentina, votesVeronika);
    });

    socket.on("update_status", msg => $("#status").val(msg));
  }

  updateStatus() {
    socket.emit("update_status", $("#status").val());
  }
}

class Veronika {
  constructor() {
    this.votes = {};

    // Bind methods to class
    this.addVote = this.addVote.bind(this);
    this.removeVote = this.removeVote.bind(this);
    this.update = this.update.bind(this);
  }

  addVote() {
    if (lastVoter !== "veronika" && lastVoter !== "serpentina") {
      this.votes++;
      lastVoter = "veronika";
      console.log(
        "Für",
        lastVoter,
        "gestimmt, Veronika hat nun",
        this.votes,
        "Stimmen."
      );
    } else if (lastVoter == "serpentina") {
      this.removeVote();
      this.votes++;
      lastVoter = "veronika";
      console.log(
        "Für",
        lastVoter,
        "gestimmt, Veronika hat nun",
        this.votes,
        "Stimmen."
      );
    }
    this.update();
  }

  removeVote() {
    if (this.votes > 0 && lastVoter !== "serpentina") {
      this.votes--;
      lastVoter = "";
      this.update();
      serpentina.addVote();
    } else {
      console.log("Du hast schon für Serpentina gestimmt");
      // Bzw. Veronika hätte danach weniger als 0 Stimme, aber das sollte nicht vorkommen
    }
  }

  update() {
    socket.emit("update_votes", "veronika", this.votes);
  }
}

class Serpentina {
  constructor() {
    this.votes = {};

    // Bind methods to class
    this.addVote = this.addVote.bind(this);
    this.removeVote = this.removeVote.bind(this);
    this.update = this.update.bind(this);
  }

  addVote() {
    if (lastVoter !== "veronika" && lastVoter !== "serpentina") {
      this.votes++;
      lastVoter = "serpentina";
      console.log(
        "Für",
        lastVoter,
        "gestimmt, Serpentina hat nun",
        this.votes,
        "Stimmen."
      );
    } else if (lastVoter == "veronika") {
      this.removeVote();
      this.votes++;
      lastVoter = "serpentina";
      console.log(
        "Für",
        lastVoter,
        "gestimmt, Serpentina hat nun",
        this.votes,
        "Stimmen."
      );
    }
    this.update();
  }

  removeVote() {
    if (this.votes > 0 && lastVoter !== "veronika") {
      this.votes--;
      lastVoter = "";
      this.update();
      veronika.addVote();
    } else {
      console.log("Du hast schon für Veronika gestimmt");
      // Bzw. Veronika hätte danach weniger als 0 Stimme, aber das sollte nicht vorkommen
    }
  }

  update() {
    socket.emit("update_votes", "serpentina", this.votes);
  }
}

// Create instances and start the voting app
const votingEdit = new VotingEdit();
const veronika = new Veronika();
const serpentina = new Serpentina();
