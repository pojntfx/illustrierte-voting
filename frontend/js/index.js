// Configuration
const SOCKET_URL = "/"; // DIE_ILLUSTRIERTE_VOTING_SOCKET
const socket = io.connect(SOCKET_URL); // Use your own domain here!

class VotingIndex {
  constructor() {
    // Configuration
    this.metadata = {};

    // Bind methods to class
    this.drawVisualization = this.drawVisualization.bind(this);
    this.updatePercents = this.updatePercents.bind(this);
    this.registerEventListeners = this.registerEventListeners.bind(this);

    // Register the WebSocket event handlers
    this.registerEventListeners();

    // Draw the visualisation
    this.drawVisualization();
  }

  /**
   * Update pie chart
   */
  updatePercents(votes) {
    let num_votes = 0,
      num_students = this.metadata["num_students"],
      vote_pc = 0;

    for (let choice in votes) {
      num_votes += votes[choice];
    }

    for (let choice in votes) {
      $("#percentage_" + choice).empty();
      vote_pc = ((votes[choice] * 100) / num_votes).toFixed(2);
      $("#percentage_" + choice).append(vote_pc + "%");
    }
    const votes_percent = ((num_votes * 100) / num_students).toFixed(2);
    $("#votes_texto").empty();
    $("#votes_texto").append(
      "Quorum " + votes_percent + "% (" + num_votes + "/" + num_students + ")"
    );
    let style = "width:" + votes_percent + "%;";
    if (votes_percent >= this.metadata["quorum"]) {
      style += "background:rgb(146,208,80)";
    } else {
      style += "background:red";
    }
    $("#barra").attr("style", style);
  }

  /**
   * Render pie chart
   */
  drawVisualization(veronika, serpentina) {
    const data = google.visualization.arrayToDataTable([
      ["Name", "Percentage"],
      ["Veronika", veronika | 0],
      ["Serpentina", serpentina | 0]
    ]);

    const options = {
      title: "Ist Veronika oder Serpentina die bessere Wahl für Anselmus?",
      width: 320,
      height: 200,
      colors: ["#212529", "#218838"]
    };

    const chart = new google.visualization.PieChart(
      document.getElementById("visualization__diagram")
    );

    chart.draw(data, options);
  }

  /**
   * Register event handlers
   */
  registerEventListeners() {
    // Google Visualization
    google.setOnLoadCallback(this.drawVisualization);

    socket.on("connect", function() {
      socket.emit("addstream");
    });

    socket.on("update_counts", votes => {
      for (let choice in votes) {
        $("#votes_" + choice).empty();
        $("#votes_" + choice).append(votes[choice] + " Stimmen");
      }
      this.updatePercents(votes);
      this.drawVisualization(votes.veronika, votes.serpentina);
    });

    socket.on("update_status", msg => {
      $(".latest-comment").empty();
      $(".latest-comment").append('Aktuellstes Kommentar: "' + msg + '"');
    });

    socket.on("update_metadata", mdata => {
      this.metadata = mdata;
    });
  }
}

// Start the voting app
const votingIndex = new VotingIndex();
