//--------SPAGHETTI CODE WARNING--------//
// initial stuff
let recycleBinContents = [
    "HistoryEssay.docx",
    "HistoryEssay_FINAL.docx",
    "HistoryEssay_FINAL (REAL).docx",
    "New Text Document.txt",
    "IMG231_02042009.jpg",
    "family PIcture.jpg",
    "group 4 project.pptx"
];
let recycleBinLength = recycleBinContents.length;

let dingSound = new Audio("sound/ding.wav");
let recycleSound = new Audio("sound/recycle.wav");

let globalZ = 0;
dragElement(document.getElementById("recycle"));
dragElement(document.getElementById("recycleTask"));

ctr = document.getElementById("recycle");
centerWindow(ctr);
ctr = document.getElementById("recycleTask");
centerWindow(ctr);

rightClickable = document.getElementById("recycleIcon");

let currentFile = 0;

// TIME
function pad(n) {
    return n<10 ? '0'+n : n;
}

function time() {
    let dt = new Date();
    amPm = "AM";
    hr = dt.getHours();
        if (hr > 12) {
            hr -= 12;
            amPm = "PM";
        } else if (hr == 0) {
            hr = 12;
        }
    min = pad(dt.getMinutes());
    month = dt.getMonth() + 1;
    let time = hr + ":" + min;
    document.getElementById("time").innerHTML = time + " " + amPm + 
        "<br>" + month + "/" + dt.getDate() + "/" + dt.getFullYear();
}

setInterval(time, 1000);

// CENTER WINDOW
function centerWindow(targetWindow) {
    middleX = targetWindow.offsetWidth/2;
    middleY = targetWindow.offsetHeight;
    targetWindow.style.left = window.innerWidth/2-middleX+"px";
    targetWindow.style.top = window.innerHeight/2-middleY+"px";
}

// DRAG WINDOWS
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Title")) {
        // move from titlebar
        document.getElementById(elmnt.id + "Title").onmousedown = dragMouseDown;
    }
    if (document.getElementById(elmnt.id)) {
       document.getElementById(elmnt.id).onmousedown = activateWindow;
    }

    function activateWindow(e) {
        globalZ++;
        elmnt.style.zIndex = globalZ;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call function whenever the cursor moves
        document.onmousemove = elementDrag;
        //bring window to front
        activateWindow;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the window's new position
        winX = elmnt.offsetLeft - pos1;
        winY = elmnt.offsetTop - pos2;
        elmnt.style.left = winX + "px";
        elmnt.style.top = winY + "px";
    }

    function closeDragElement() {
    // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        //if window was dragged out of bounds, put window in bounds by 32px after mouse up
        if (document.onmouseup === null) {
            if (winX < 0-elmnt.offsetWidth+32) {
                elmnt.style.left = 0-elmnt.offsetWidth+32 + "px";
            }
            if (winX > window.innerWidth-32) {
                elmnt.style.left = window.innerWidth-32 + "px";
            }
            if (winY < 0) {
                elmnt.style.top = "0px";
            }
            if (winY > window.innerHeight-64) {
                elmnt.style.top = window.innerHeight-64 + "px";
            }
        }
    }
}

// CONTEXT MENU
document.onclick = hideMenu; 
rightClickable.oncontextmenu = rightClick; 
function hideMenu() { 
    document.getElementById("contextMenu") 
            .style.display = "none" 
} 

function rightClick(e) { 
    e.preventDefault(); 

    if (document.getElementById("contextMenu") .style.display == "block"){ 
        hideMenu(); 
    }else{ 
        let menu = document.getElementById("contextMenu")      
        menu.style.display = 'block'; 
        menu.style.left = e.pageX + "px"; 
        menu.style.top = e.pageY + "px"; 
    } 
}

// REMOVE FILE
function removeFile(file) {
    if (recycleBinContents.includes(file)) {
        console.log(file);

        let index = recycleBinContents.indexOf(file);
        if (index > -1) {
            recycleBinContents.splice(index, 1);
        }
        currentFile ++;
        let percentage = (currentFile/recycleBinLength)*100;
        document.getElementById('progressBar').style.width = percentage+"%";
        document.getElementById('progressText').innerHTML = "&nbsp;";
        document.getElementById('inputDelete').value = "";
    } else {
        document.getElementById('progressText').innerHTML = "This file does not exist."
        dingSound.play();
    }
    if (recycleBinContents.length == 0) {
        document.getElementById('recycleTask').classList.remove('window-open');
        recycleSound.play();
        document.getElementById("recycleIconImage").src="icons/recycleEmpty.png";
    }
}