var setCommand = function(btn, command) {
    btn.onclick = function() {
        command.execute();
    }
};

var MenuBar = {
    refresh: function() {
        console.log('刷新');
    }
};

var RefreshMenuBarCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh();
        },
        undo: function() {

        }
    }
};

var refreshMenuBarCommand =RefreshMenuBarCommand(MenuBar);
setCommand(document.getElementById('btn'), refreshMenuBarCommand);