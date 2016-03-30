"use strict";

document.addEventListener("DOMContentLoaded", function() {
    if (document.readyState === "interactive") {
        main();
    }
});

function main() {
    let viewport = document.getElementById("gameViewport");
    let width = 800;
    let height = 600;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    viewport.appendChild(canvas);

    // L System expansion
    let rules = [
        {match: '1', out: '11'},
        {match: '0', out: '1[0]0'}
    ];
    let expansions = ['0'];
    for (let i = 0; i < 6; i++) {
        expansions.push(expandLSystem(expansions[i], rules));
    }
    console.log('L System expansions:');
    console.log(expansions);

    // Generate the graph
    let adjStack = [{pos: [width / 2,0], scale: 1, rot: 90}];
    let baseMagnitude = 5;
    let s = expansions[expansions.length - 1];
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
                scale: lastAdj.scale * .5,
                rot: lastAdj.rot + 45
            });
            console.log(adjStack[adjStack.length - 1]);
        } else if (c === ']') {
            console.log(']');
            adjStack.pop();
            lastAdj = adjStack[adjStack.length - 1];
            lastAdj.rot -= 45;
            lastAdj.scale *= .5;
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
    console.log('Starting to draw');
    drawOne();
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
