var nomnom = require('nomnom');
var csv = require('csv');

var opts = nomnom
    .option('players', {
      abbr: 'p',
      help: 'number of player columns. calculated if not provided',
      default: 0
    })
    .option('attributes', {
      abbr: 'a',
      help: 'comma-separated list of additional attributes',
      default: ''
    })
    .option('attribute-names', {
      abbr: 'n',
      help: 'comma-separated list of the names of additional attributes',
      default: ''
    })
    .parse();

var optss = opts.attributes.toString().split(',');
var optNamess = opts['attribute-names'].toString().split(',')

// read from stdin
var data = '';
process.stdin.resume();
process.stdin.setEncoding('binary')
process.stdin.on('data', function(chunk) { 
  data += chunk;
});
process.stdin.on('end', function() {
  importString(data.toString('hex'));
});


function importString(string) {
  var teams = {};

  var allAttributes = {}

  csv()
    .from.options({
      delimiter: ';'
    })
    .from(string)
    .on('record', function(row, index) {
      var player = {
        name: row[0]
      }
      var teamName = row[1];

      if (opts.attributes) {
        var attributes = {}
        optss.forEach(function (col, ix) {
          if (row[col]) {
            var attributeName = optNamess[ix] || col
            player[attributeName] = row[col]
            allAttributes[attributeName] = true
          }
        })
      }

      if (!teams[teamName])
        teams[teamName] = [];
      teams[teamName].push(player); // players are sorted by their position
    })
    .on('end', function() {
      putTeams(teams, Object.keys(allAttributes));
    });
}

function putTeams(teams, attributes) {
  var attributesCount = Object.keys(attributes).length
  var playersCount = 0;
  for (var team in teams) {
    playersCount = Math.max(playersCount, teams[team].length);
  }
  var firstRow = ['Team'];

  var prefix
  for (var i = 0; i < playersCount; i++) {
    prefix = 'Player_' + (i+1) + '_'
    firstRow.push(prefix + 'Name')
    attributes.forEach(function (attributeName) {
      firstRow.push(prefix + attributeName)
    })
  }

  var columns = 1 + playersCount * (1 + attributesCount)

  var teamArray = [];
  var row;
  for (var team in teams) {
    row = [team]
            .concat([].concat.apply([], teams[team].map(function (player) {
              return [player.name].concat(attributes.map(function (attributeName) {
                return player[attributeName]
              }))
            })))
            .concat(new Array(columns - teams[team].length * (1 + attributesCount))); // add empty players

    teamArray.push(row);
  }

  csv()
    .to.options({
      delimiter: ';',
      encoding: opts.encoding
    })
    .from([firstRow].concat(teamArray))
    .to.stream(process.stdout);
}