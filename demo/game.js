JSGL.ExampleHTML.Render(); // render with default settings
// new JSGL.ExampleHTML().Render({
//     backgroundColor: 'red'
// }); // override default settings (sets the background color of body to red)

// Create Game Instance
let game = new JSGL.Game({
    canvas: document.getElementById("gameCanvas"),
    grid: new JSGL.Vector2(8, 6)
});
// Add resource to load
game.LoadResource('image', 'points', './point.png');
// game.LoadResource('image', 'player', './player.png');
// game.LoadResource('image', 'enemy', './enemy.png');

game.RescaleCanvasToParentElement(0.95);
// game.RescaleCanvasToParentElement(percentage);

// Creating own JSGL Sprite GameObject
class Enemy extends JSGL.Sprite{
    OnStart(game){
        this.texture = game.GetImage('points');
        this.showHitbox = true;
    }
    Update(deltaTime, game){
        const rotationPerSec = 180;
        const rotationPerMillis = rotationPerSec / 1000; 
        this.transform.rotation += rotationPerMillis * deltaTime;
        game.Update();
    }
    OnMouseClick(mousePos, game){
        console.log("Clicked! @", this);
        return true;
    }
}

// Start loading and wait to load all resources.
// game.on('loadAllResources', () => {
//     game.Start();
// });
// game.LoadAllResources();
game.LoadGameAndStart().then(() => {
    console.log("Loaded");
    game.on('draw', () => {
        game.renderer.fillFrame('#F0F0F0');
        game.renderer.drawRectangle(0, 0, 1, 1);
        game.renderer.drawRectangle(2, 0, 1, 1, 'blue');
        game.renderer.drawRectangle(3, 0, 1, 1, 'yellow');
        game.renderer.drawRectangle(1, 0, 1, 1, 'red', 45);
    });
    game.on('mouseUp', (event) => {
        console.log('Mouse up!');
    })
    game.on('mouseDown', (event) => {
        console.log('Mouse down!');
    })
    game.on('mouseClick', (event) => {
        console.log(event.mousePos, event.mouseClientPos);
    });
    let enemy = new Enemy();
    enemy.transform.addX(3).addY(2);
    game.AddGameObject(enemy);
});