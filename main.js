document.addEventListener("DOMContentLoaded", function() {
    if (document.readyState === "interactive") {
        main();
    }
});

function main() {
    var viewport = document.getElementById("gameViewport");
    var width = 800;
    var height = 600;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    viewport.appendChild(canvas);
    drawTree(canvas.getContext("2d"), 10);
}

function drawTree(ctx, numLevels) {
    function drawTreeHelper(currentLevel, x, y, angle) {
        console.log('\t' + currentLevel + ' (' + x + ',' + y + ') @ ' + angle);
        if (currentLevel < 0) {
            return;
        }
        // Draw this branch
        var length = height / Math.pow(2, numLevels - currentLevel + 1);
        ctx.beginPath();
        ctx.moveTo(x, y);
        var rads = angle / 180 * Math.PI;
        var newX = x + length * Math.cos(rads);
        var newY = y + length * Math.sin(rads);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        var numBranches = Math.ceil(Math.random() * 4);
        for (var i = 0; i < numBranches; i++) {
            drawTreeHelper(
                currentLevel - 1,
                newX, newY,
                angle + (Math.random() * 180 - 90)
            );
        }
    }
    console.log('Drawing tree with ' + numLevels + ' levels.');
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    drawTreeHelper(numLevels, width / 2, height, 270);
}
