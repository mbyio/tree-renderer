document.addEventListener("DOMContentLoaded", function() {
    if (document.readyState === "interactive") {
        main();
    }
});

function main() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');
    drawTree(ctx, 5);
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

        var numBranches = 1 + Math.floor(Math.random() * 3);
        for (var i = 0; i < numBranches; i++) {
            drawTreeHelper(
                currentLevel - 1,
                newX, newY,
                angle + (Math.random() * 50 - 5)
            );
        }
    }
    console.log('Drawing tree with ' + numLevels + ' levels.');
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    drawTreeHelper(numLevels, width / 2, height, 270);
}
