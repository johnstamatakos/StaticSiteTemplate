var person, dir, helpText, contactText, resumeText, aboutText;
var history = [];
var historyIndex = 0;
var mainText = document.querySelector('.main-text');
var secretCommand = 'marioharper';

window.onload = function() {
    init();
    setTextVariables();
}

function processRequest(input) {
    //print current command to history
    var newLine = document.createElement('p');
    newLine.innerHTML = '<span class="name">' + person + '</span>:<span class="dir">' + dir + '</span>$<span class="user-text">' + input + '</span>';
    mainText.appendChild(newLine);

    //Save command history
    var i = input.trim().toLowerCase();
    history.push(i);
    historyIndex = history.length - 1;

    if (i === 'help') {
        var el = document.createElement('div');
        el.className = 'helpText';
        el.innerHTML = helpText;
        mainText.appendChild(el);
    } else if (i === 'exit') {
        window.location.href = "http://google.com";
    } else if (i === 'clear') {
        mainText.innerHTML = '';
    } else if (i.indexOf('cd ') != -1) {
        changeDirectory(i);
    } else if (i === 'ls') {
        var el = document.createElement('p');
        if(dir === '~') {
            el.innerHTML = directoryText;
            mainText.appendChild(el);
        } else {
            el.innerHTML = '';
            mainText.appendChild(el);
        }
    } else if (i === secretCommand) {
        fn(0);
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
        document.getElementById('dir').innerHTML = dir;
        return;
    }

    dir = directory;
    document.getElementById('dir').innerHTML = dir;

    printDirectoryInfo(directory);
};

function printDirectoryInfo(directory) {
    var el = document.createElement('div');
    switch(directory) {
        case 'about':
            el.className = 'aboutText';
            el.innerHTML = aboutText;
            mainText.appendChild(el);
            break;
        case 'resume':
            el.className = 'resumeText';
            el.innerHTML = resumeText;
            mainText.appendChild(el);
            break;
        case 'contact':
            el.className = 'contactText';
            el.innerHTML = contactText;
            mainText.appendChild(el);
            break;
    }
}

function throwSyntaxError(input) {
    var el = document.createElement('p');
    el.innerHTML = '-bash: ' + input + ': command not found';
    mainText.appendChild(el);
}

function throwDirectoryError(input) {
    var el = document.createElement('p');
    el.innerHTML = '-bash: cd: ' + input + ': No such file or directory';
    mainText.appendChild(el);
}

function init() {
    //Set variables for name, directory, and datetime
    var todaysDate = new Date();
    var dateContainer = document.querySelector('.date');
    dateContainer.textContent = todaysDate;
    dir = '~';
    person = prompt("Please enter your name", "user");
    person = person || 'user';
    person = person.trim().toLowerCase();

    //Make focus always on input
    var body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', function() {
        document.getElementById('input').focus();
    }, false);

    //print command prompt input
    var consoleInput = document.querySelector('.console-input');
    var line = document.createElement('p');
    line.className = 'line';
    line.innerHTML = `
        <span class="name">` + person + `</span>:<span id="dir" class="dir">` + dir + `</span>$
        <form id="inputForm" autocomplete="off">
            <input id="input" type="text" autofocus>
            <input type="submit" style="display:none" />
        </form>`
    consoleInput.appendChild(line);

    //add submit/history cycle functionality to keys
    var form = document.getElementById('inputForm');
    var input = form.querySelector('input[type=text]');
    input.onkeydown = function(e) {
        //enter key pressed
        if(e.which === 10 || e.which === 13) {
            e.preventDefault();
            processRequest(this.value);
            var textContainer = document.querySelector('.textContainer');
            textContainer.scrollTop = textContainer.scrollHeight;
            this.value = '';
        }
        //up key pressed - cylce command history
        if (e.which === 38) {
            var lastCommand = history[historyIndex];
            if(lastCommand !== undefined) {
                document.getElementById('input').value = lastCommand;
            }
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
            if(lastCommand !== undefined) {
                document.getElementById('input').value = lastCommand;
            } else {
                document.getElementById('input').value = '';
            }
        }
    };
}

function setTextVariables() {
    helpText = `
        <p>Commands:</p>
        <ul>
            <li>help:&nbsp;show a menu of commands</li>
            <li>clear:&nbsp;clear previous command history</li>
            <li>cd:&nbsp;change directory</li>
            <li>ls:&nbsp;list current available directories</li>
            <li>exit:&nbsp;exit the application</li>
        </ul>
        <p>Keys:</p>
        <ul>
            <li>up/down:&nbsp;cycle through command history</li>
        </ul>
        <p>
            To navigate to a directory type&nbsp;
            <span class="code">cd directory_name</span>&nbsp;
            or&nbsp;<span class="code">cd ..</span><br>
            Available Directories:
        </p>
        <ul>
            <li>about</li>
            <li>resume</li>
            <li>contact</li>
        </ul>`;

    contactText = `
        <b>John Stamatakos</b>
        <p>Phone:&nbsp;240.818.4836</p>
        <p>Email:&nbsp;jestamatakos@gmail.com</p>
        <a href="https://github.com/johnstamatakos" title="Github" target="_blank"><div class="github"></div></a></li>
        <a href="https://www.linkedin.com/in/johnstamatakos/" title="Linkedin" target="_blank"><div class="linkedin"></div></a></li>`;

    resumeText = `
        <div class="john">
            <a href="/assets/JohnStamatakosResume.pdf" target="_blank"></a>
        </div>
        <p>Click to view my resume</p>`;

    aboutText = `
        <p>I am a software engineer currently managing a small engineering team at&nbsp;
        <a href="http://xogroupinc.com/" target="_blank">XO Group</a>
        (<a href="https://www.theknot.com/" target="_blank">The Knot</a>,&nbsp;
        <a href="https://www.thebump.com/" target="_blank">The Bump</a>,&nbsp;
        <a href="https://www.thenest.com/" target="_blank">The Nest</a>)&nbsp;
        doing fullstack Javascript development 
        in Node, &nbsp;React, &nbsp;and Angular.&nbsp;In addition, I also enjoy doing&nbsp;
        <a href="https://github.com/penntex" target="_blank">freelance work</a>,&nbsp;contributing to 
        OSS,&nbsp;and working at the&nbsp;
        <a href="https://austin.codingbootcamp.utexas.edu" target="_blank">UT Coding Bootcamp</a>.</p>
        <p>Current Location: &nbsp;Austin, TX</p>
        <p>Preferred Languages/Frameworks:&nbsp;Node,&nbsp;Go,&nbsp;C#,&nbsp;React</p>`;

    directoryText = `
        about &nbsp; &nbsp; &nbsp; resume &nbsp; &nbsp; &nbsp; contact`
}

function fn(n){
    document.getElementById("input").disabled = true;   
    var el = document.createElement('p');
    el.innerHTML = 'CRITICAL ERROR';
    mainText.appendChild(el);
    if(n < 60){
        setTimeout(function(){  fn(++n);  },500);
    } else {
        document.getElementById("input").disabled = true;
    }
}