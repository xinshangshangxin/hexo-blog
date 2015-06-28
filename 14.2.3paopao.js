
function Player(name, teamColor) {
    this.name = name;               // 角色名称
    this.teamColor = teamColor;     // 队伍颜色
    this.state = 'alive';           // 玩家生存状态
}

Player.prototype.win = function() {
    console.log(this.name + ' won ');
};

Player.prototype.lose = function() {
    console.log(this.name + ' lost');
};

Player.prototype.die = function() {
    this.state = 'dead';
    PlayerDirector.ReceiveMessage('playerDead', this);  // 给中介者发送消息,玩家死亡
};

Player.prototype.remove = function() {
    PlayerDirector.ReceiveMessage('removePlayer', this);
};


Player.prototype.changeTeam = function(color) {
    PlayerDirector.ReceiveMessage('changeTeam', this);
};

var PlayerFactory = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    PlayerDirector.ReceiveMessage('addPlayer', newPlayer);

    return newPlayer;
};

var PlayerDirector = (function() {
    var players = {};
    var operations = {};  //中介者可以执行的操作;

    operations.addPlayer = function(player) {
        var teamColor = player.teamColor;
        // 如果给颜色的玩家没有成立队伍,则新建一个队伍
        players[teamColor] = players[teamColor] || [];
        players[teamColor].push(player);
    };

    operations.removePlayer = function(player) {
        var teamColor = player.teamColor;
        var teamPlayers = players[teamColor];

        for (var i = teamPlayers.length - 1; i >= 0; i--) {
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };

    operations.changeTeam = function(player, newTeamColor) {
        operations.removePlayer(player);
        player.teamColor = new newTeamColor;
        operations.addPlayer(player);
    };

    operations.playerDead = function(player) {
        var teamColor = player.teamColor;
        var teamPlayers = players[teamColor];

        var all_dead = true;

        for (var i = 0, p; p = teamPlayers[i++]; ) {
            if (p.state !== 'dead') {
                all_dead = false;
                break;
            }
        }

        if (all_dead) {
            for (var i = 0, p; p = teamPlayers[i++]; ) {
                p.lose();
            }

            for (var color in players) {
                if (color !== teamColor) {
                    var teamPlayers = players[color];

                    for (var i = 0, p; p = teamPlayers[i++];) {
                        p.win();
                    }
                }
            }
        }
    };


    var ReceiveMessage = function() {
        var message = [].shift.call(arguments);
        operations[message].apply(this, arguments);
    };

    return {
        ReceiveMessage: ReceiveMessage
    };
}());

var player1 = PlayerFactory('red1', 'red');
var player2 = PlayerFactory('red2', 'red');
var player3 = PlayerFactory('red3', 'red');
var player4 = PlayerFactory('red4', 'red');

var player5 = PlayerFactory('blue1', 'blue');
var player6 = PlayerFactory('blue2', 'blue');
var player7 = PlayerFactory('blue3', 'blue');
var player8 = PlayerFactory('blue4', 'blue');

player1.die();
player2.die();
player3.die();
player4.die();
/*
 red1 lost
 red2 lost
 red3 lost
 red4 lost
 blue1 won
 blue2 won
 blue3 won
 blue4 won
 */