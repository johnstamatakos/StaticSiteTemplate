
window.$ = window.jQuery = require('jquery');
$(function(){
    init();
});

var person, dir;
var history = [];
var historyIndex = 0;
var helpText = `
    <p>Commands:</p>
    <ul>
        <li>help: show a menu of commands</li>
        <li>clear: clear previous command history</li>
        <li>cd: change directory</li>
        <li>ls: list current available directories</li>
        <li>exit: exit the application</li>
    </ul>
    <p>Keys:</p>
    <ul>
        <li>up/down: cycle through command history</li>
    </ul>
    <p>
        To navigate to a directory type 
        <span class="code">cd directory_name</span>
        or <span class="code">cd ..</span><br>
        Available Directories:
    </p>
    <ul>
        <li>about</li>
        <li>resume</li>
        <li>contact</li>
    </ul>`;
var contactText = `
    <div class="contactText">
        <b>John Stamatakos</b>
        <p>Phone: 240.818.4836</p>
        <p>Email: jestamatakos@gmail.com</p>
        <a href="https://github.com/johnstamatakos" title="Github" target="_blank"><div class="github"></div></a></li>
        <a href="https://www.linkedin.com/in/johnstamatakos/" title="Linkedin" target="_blank"><div class="linkedin"></div></a></li>
    </div>`;
var resumeText = `
    <div class="resumeText">
        <div class="john">
            <a href="/assets/JohnStamatakosResume.pdf" target="_blank"></a>
        </div>
        <p>Click to view my resume</p>
    </div>`;
var aboutText = `
    <div class="aboutText">
        <p>I am a software engineer currently managing a small engineering team at &nbsp;
        <a href="http://xogroupinc.com/" target="_blank">XO Group</a>
        (<a href="https://www.theknot.com/" target="_blank">The Knot</a>,&nbsp;
        <a href="https://www.thebump.com/" target="_blank">The Bump</a>,&nbsp;
        <a href="https://www.thenest.com/" target="_blank">The Nest</a>) 
        doing fullstack Javascript development 
        in Node, &nbsp;React, &nbsp;and Angular. &nbsp;In addition, I also enjoy doing &nbsp;
        <a href="https://github.com/penntex" target="_blank">freelance work</a>, &nbsp;contributing to 
        OSS, &nbsp;and working at the &nbsp;
        <a href="https://austin.codingbootcamp.utexas.edu" target="_blank">UT Coding Bootcamp</a>.</p>
        <p>Current Location: &nbsp;Austin, TX</p>
        <p>Preferred Languages/Frameworks: &nbsp;Node,&nbsp; Go,&nbsp; C#,&nbsp; React</p>
    </div>`;

function processRequest(input) {
    //print current command to history
    $('.main-text').append('<p><span class="name">' + person + '</span>:<span class="dir">' + dir + '</span>$<span class="user-text">' + input + '</span></p>');

    //Save command history
    var i = input.trim().toLowerCase();
    history.push(i);
    historyIndex = history.length - 1;

    if (i === 'help') {
        $('.main-text').append(helpText);
    } else if (i === 'exit') {
        window.location.href = "http://google.com";
    } else if (i === 'clear') {
        $('.main-text').html('');
    } else if (i.indexOf('cd ') != -1) {
        changeDirectory(i);
    } else if (i === 'ls') {
        if(dir === '~') {
            $('.main-text').append('<p>about &nbsp; &nbsp; &nbsp; resume &nbsp; &nbsp; &nbsp; contact</p>');
        } else {
            $('.main-text').append('<p></p>');
        }
    } else {
        throwSyntaxError(i);
    }
}

function changeDirectory (command) {
    //Split command
    var pieces = command.split(' ');
    var directory = pieces[1].trim().toLowerCase();

    //Throw error if directory syntax is wrong
    if (pieces.length !== 2){
        throwSyntaxError(command);
        return;
    }
    //Throw error if directory does not exist
    if(directory !== 'about' && directory !== 'resume' && directory !== 'contact' && directory !== '..') {
        throwDirectoryError(directory);
        return;
    }
    //Throw error if try to change directory and not in root
    if(dir !== '~' && directory !== '..') {
        throwDirectoryError(directory);
        return;
    }
    //Go back to root
    if(directory === '..') {
        dir = '~';
        $('#dir').html(dir);
        return;
    }

    dir = directory;
    $('#dir').html(dir);

    printDirectoryInfo(directory);
};

function printDirectoryInfo(directory) {
    switch(directory) {
        case 'about':
            $('.main-text').append(aboutText);
            break;
        case 'resume':
            $('.main-text').append(resumeText);
            break;
        case 'contact':
            $('.main-text').append(contactText);
            break;
    }
}

function throwSyntaxError(input) {
    $('.main-text').append('<p>-bash: ' + input + ': command not found</p>');
}

function throwDirectoryError(input) {
    $('.main-text').append('<p>-bash: cd: ' + input + ': No such file or directory</p>');
}

function refocus() {
    $('#input').focus();
}

function init() {
    var todaysDate = new Date();
    $('.date').text(todaysDate);
    dir = '~';
    person = prompt("Please enter your name", "user");
    person = person || 'user';
    person = person.trim().toLowerCase();

    //Make focus always on input
    $('body').click(function() {
        $('#input').focus();
    });

    //print command prompt input
    $('.console-input').append(`
        <p class="line">
            <span class="name">` + person + `</span>:<span id="dir" class="dir">` + dir + `</span>$
            <form autocomplete="off">
                <input id="input" type="text" autofocus>
                <input type="submit" />
            </form>
        </p>`);

    //add submit/history cycle functionality to keys
    $('form').find('input').keydown(function(e) {
        //enter key pressed
        if(e.which === 10 || e.which === 13) {
            e.preventDefault();
            processRequest($(this).val());
            $('.text').scrollTop($('.text')[0].scrollHeight);
            $(this).val('');
        }
        //up key pressed - cylce command history
        if (e.which === 38) {
            var lastCommand = history[historyIndex];
            $('#input').val(lastCommand);
            if(historyIndex !== 0){
                historyIndex--;
            }
        }
        //down key pressed - cylce command history
        if (e.which === 40) {
            if(historyIndex !== history.length){
                historyIndex++;
            }
            var lastCommand = history[historyIndex];
            $('#input').val(lastCommand);
        }
    });
    $('form').find('input[type=submit]').hide();

}