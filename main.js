"use strict";

document.addEventListener("DOMContentLoaded", function() {
    if (document.readyState === "interactive") {
        onDrawLSystem();
    }
});

function onExpandLSystem() {
    let rules = [];
    for (let i = 1; i <= 4; i++) {
        let match = document.getElementById('lm' + i).value;
        let out = document.getElementById('lr' + i).value;
        if (match.length === 0 || out.length === 0) {
            continue;
        } else if (match.length > 1) {
            throw new Error('Match is too long');
        }
        rules.push({match: match, out: out});
    }
    if (rules.length === 0) {
        throw new Error('No rules defined.');
    }
    let start = document.getElementById('lSystemStart').value;
    if (start.length === 0) {
        throw new Error('Start is too short.');
    }
    let numIterations = document.getElementById('numIterations').value;
    console.log('expanding l system');
    console.log('rules:');
    console.log(rules);
    let lastExpansion = start;
    for (let i = 0; i < numIterations; i++) {
        lastExpansion = expandLSystem(lastExpansion, rules);
    }
    console.log('expansion: ' + lastExpansion);
    document.getElementById('lSystemOut').innerHTML = lastExpansion;
}

function expandLSystem(s, rules) {
    let out = '';
    charLoop: for (let c of s) {
        for (let rule of rules) {
            if (rule.match == c) {
                out += rule.out
                continue charLoop;
            }
        }
        out += c;
    }
    return out;
}

function onDrawLSystem() {
    onExpandLSystem();
    let s = document.getElementById('lSystemOut').innerHTML;
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    console.log('drawing l system');
    // Generate the graph
    let adjStack = [{pos: [width / 2,0], scale: 1, rot: 90}];
    let baseMagnitude = document.getElementById('magnitude').value;
    let scaleMult = document.getElementById('scaleMult').value;
    let i = 0;
    // Putting the loop body into a function lets it act like a coroutine
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.fillStyle = 'rgb(0,255,0)';
    function drawOne() {
        // Bookkeeping
        if (i === s.length) {
            console.log('done');
            return;
        }
        let c = s.charAt(i);
        i += 1;

        let lastAdj = adjStack[adjStack.length - 1];
        if (c === '[') {
            console.log('[');
            adjStack.push({
                pos: [lastAdj.pos[0], lastAdj.pos[1]],
                scale: lastAdj.scale * scaleMult,
                rot: lastAdj.rot + 45
            });
            console.log(adjStack[adjStack.length - 1]);
        } else if (c === ']') {
            console.log(']');
            adjStack.pop();
            lastAdj = adjStack[adjStack.length - 1];
            lastAdj.rot -= 45;
            lastAdj.scale *= scaleMult;
            console.log(lastAdj);
        } else if (c === '1') {
            let rads = lastAdj.rot / 180 * Math.PI;
            let newX = lastAdj.pos[0] +
                baseMagnitude * lastAdj.scale * Math.cos(rads);
            let newY = lastAdj.pos[1] +
                baseMagnitude * lastAdj.scale * Math.sin(rads);
            console.log('Drawing segment from (' +
                        lastAdj.pos[0] + ',' + lastAdj.pos[1] + ') to (' +
                       newX + ',' + newY + ')');
            ctx.beginPath();
            ctx.moveTo(lastAdj.pos[0], height - lastAdj.pos[1]);
            ctx.lineTo(newX, height - newY);
            ctx.stroke();
            lastAdj.pos[0] = newX;
            lastAdj.pos[1] = newY;
        } else if (c === '0') {
            console.log('drawing leaf at (' + lastAdj.pos[0] + ',' + lastAdj.pos[1] + ')');
            let size = baseMagnitude * lastAdj.scale;
            ctx.fillRect(lastAdj.pos[0] - size,
                         height - lastAdj.pos[1] + size,
                         size, size);
        }
        window.requestAnimationFrame(drawOne);
    }
    drawOne();
}
