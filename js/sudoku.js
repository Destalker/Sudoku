//Initialise classesArray to keep track of how the elements are solved.
var classesArray = [];
for (var elem = 0; elem < 81; elem++)
{
    classesArray[elem] = "";
}

var time = 0;
var timer;
var selected;
var removed = false;
var gameGrid;

createGridInDOM();

function UpdateTimer()
{
    var c_minutes = parseInt(time / 60);
    var c_seconds = CheckTime(parseInt(time % 60));
    document.getElementById("time").innerHTML = c_minutes + ':' + c_seconds;
    time++;
}

function CheckTime(i)
{
    if (i < 10)
        i = '0' + i;
    return i;
}

function resetTimer()
{
    stopTimer();
    document.getElementById("time").innerHTML = "";
    time = 0;
}

function startTimer()
{
    UpdateTimer();
    timer = setInterval(function() {UpdateTimer()}, 1000);
}

function stopTimer()
{
    clearInterval(timer);
}

function handleDiff(value)
{
    if (!removed)
    {
        var difficulty = document.getElementById("difficulty");
        difficulty.remove(0);
        removed = true;
    }
    game = CU.Sudoku.generate();
    gameGrid = game.toArray();
    CU.Sudoku.cull(game,value);
    LoadGame(game.toArray());
    clearKeyboard();
    resetTimer();
    startTimer();
}

function populateKeyboard(cell)
{
    var classList = cell.attr('class').split(/\s+/);
    var keyboard = ["1","2","3","4","5","6","7","8","9"];
    $.each(classList, function (index, name)
    {
        if (name != "empty")
        {
            $(".sudoku ." + name).each(function ()
            {
                if ($(this).text() != "&nbsp;")
                {
                    remove(keyboard,$(this).text());
                }
            });
        }
    });
    for (var i = 1; i <= 9; i++)
    {
        var key = $(".keyboard #k"+i);
        key.html("&nbsp;");
        if ($.inArray(i + "", keyboard) != -1)
        {
            key.text(i);
        }      
    }
};

function clearKeyboard()
{
    for (var i = 1; i <= 9; i++)
    {
        var key = $(".keyboard #k"+i);
        key.html("&nbsp;");
    }
};

function remove(arr, item)
{
    for (var i = arr.length; i--; )
    {
        if (arr[i] === item)
        {
            arr.splice(i, 1);
        }
    }
};

function checkBoard()
{
    for (var elem = 0; elem < 81; elem++)
    {
        if (document.getElementById("elem"+elem).innerHTML == "&nbsp;")
            return false;
    }
    return true;
}

function finishGame()
{
    stopTimer();
    clearKeyboard();
    alert("Congratulations! " + document.getElementById("difficulty").options[document.getElementById("difficulty").selectedIndex].text + " game finished in " + document.getElementById("time").innerHTML + " !");
}

$(".sudoku td div").click(function (event)
{
    var cell = $("#"+event.target.id);
    if (cell.hasClass("empty"))
    {
        if (selected)
        {
            if (selected.attr("id") == cell.attr("id"))
            {
                selected.css('background-color', 'white');    
                clearKeyboard();
                selected = null;
            }
            else
            {
                selected.css('background-color', 'white');
                cell.css('background-color', 'green');
                selected = cell;
                populateKeyboard(cell);
            }
        }
        else
        {
            cell.css('background-color', 'green');
            selected = cell;
            populateKeyboard(cell);
        }
    }
    event.preventDefault();
});

$(".keyboard td div").click(function (event)
{
    if (selected)
    {
        var key = $("#"+event.target.id);
        selected.html(key.html());
        selected.css('background-color', 'white');
        if (checkBoard())
            finishGame();
        clearKeyboard();
        selected = null;
    } 
});

$(".keyboard td div").mouseleave(function (event)
{
    var cell = $("#"+event.target.id);
    cell.css('background-color', 'white'); 
    event.preventDefault();
});

$(".keyboard td div").mouseenter(function (event)
{
    var cell = $("#"+event.target.id);
    if (cell.html() != "&nbsp;")
    { 
        cell.css('background-color', 'yellow');
    }
    else 
    {
        cell.css('background-color', 'white');
    }       
    event.preventDefault();
});

$(".sudoku td div").mouseenter(function (event)
{
    var cell = $("#"+event.target.id);
    if (cell.html() == "&nbsp;")
    {
        if (selected == null)
        {
            cell.css('background-color', 'yellow');
        }
        else if (cell.attr("id") != selected.attr("id"))
        {
            cell.css('background-color', 'yellow');
        }       
    }
    event.preventDefault();
});

$(".sudoku td div").mouseleave(function (event)
{
    var cell = $("#"+event.target.id);

    if (cell.html() == "&nbsp;")
    {
        if (selected == null) 
        { 
            cell.css('background-color', 'white');
        }
        else if (cell.attr("id") != selected.attr("id"))
        {
            cell.css('background-color', 'white');
        }
    }
    event.preventDefault();
});

$("#new_game").click(function (event)
{
    if (!removed)
        return;
    var reply = confirm("Do you really want a new game?");
    if (reply) 
    {
        var game = CU.Sudoku.generate();
        var difficulty = document.getElementById("difficulty");
        CU.Sudoku.cull(game,difficulty.value);
        LoadGame(game.toArray());
        clearKeyboard();
        resetTimer();
        startTimer();
    }
});

$("#check").click(function () {
    if (!removed)
        return;
    var reply = confirm("Do you really want me to check this game?");
    if (!reply)
        return;

    var error = false;
    for (var e = 0; e < 81; e++) {
        var cell = $("#elem" + e);
        if (cell.html() != "&nbsp;")
            if (cell.html() != gameGrid[e]) {
                cell.css('background-color', 'red');
                error = true;
            }
    }

    if (!error)
        alert("All is OK!");

    clearKeyboard();
});

$("#clear").click(function (event) {
    if (!removed)
        return;

    var reply = confirm("Do you really want to clear and start again?");
    if (reply) {
        for (var e = 0; e < 81; e++) {
            var elem = $("#elem" + e);
            if (elem.hasClass("empty")) {
                elem.html("&nbsp;");
                elem.css('background-color', 'white');
            }
        }

        resetTimer();
        startTimer();
    }
    clearKeyboard();
    event.preventDefault();
});

$("#solve").click(function ()
{
    if (!removed)
        return;
    var reply = confirm("Do you really want me to solve this game?");
    if (!reply)
        return;

    stopTimer();

    for (var e = 0; e < 81; e++)
    {
        var cell = $("#elem"+e);
        if (cell.hasClass("empty"))
            cell.css('background-color', 'white');
        cell.html(gameGrid[e]);
    }

    clearKeyboard();
});

function createGridInDOM()
{
    // Create input elements for sudoku grid
    var inputsHTML = '<table class="sudoku" style="table-layout:fixed;">\n';
    inputsHTML += '<tbody class="s0" >\n';
    var elem = 0
    var s = 1;
    for (var row = 0; row < 9; row++)
    {
        if (row == 3 || row == 6)
        {
            inputsHTML += "</tbody>\n";
            inputsHTML += '<tbody class="s'+s+'" >\n';
            s++;
        }    

        inputsHTML += '<tr class="r'+row+'">\n';
        for (var col = 0; col < 9; col++)
        {
            var group;
            if( col >= 0 && col <= 2)
            {
                if (row >= 0 && row <= 2)
                    group = "g1"
                else if (row >= 3 && row <= 5)
                    group = "g2";
                else 
                    group = "g3";
            }
            else if (col >= 3 && col <= 5)
            {
                if (row >= 0 && row <= 2)
                    group = "g4"
                else if (row >= 3 && row <= 5)
                    group = "g5";
                else
                    group = "g6";
            }
            else if (col >= 6)
            {
                if (row >= 0 && row <= 2)
                    group = "g7"
                else if (row >= 3 && row <= 5)
                    group = "g8";
                else 
                    group = "g9";
            }
            inputsHTML += '<td class="c'+col+'" ><div  class="col'+col+' row'+row+' '+group+'" id="elem'+elem+'"><div></td>\n';
            elem++;
        }
        inputsHTML += "</tr>\n";
    }
    inputsHTML += "</tbody>\n";
    inputsHTML += "</table>\n";
    $("#grid").html(inputsHTML);
};

function LoadGame(game)
{
    for (var i = 0; i < 81; i++)
    {
        var cell = $("#elem"+i);
        if (game[i] == 0)
        {
            cell.css('background-color', 'white');
            cell.html("&nbsp;");
            cell.addClass("empty");
        }
        else
        {
            cell.html(game[i]);
            cell.css('background-color', '#EBEAE8');
            cell.removeClass("empty");
        }       
    }
    selected = null;
}
