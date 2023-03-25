JSGL.ExampleHTML.Render({
    backgroundColor: '#0F0F0F'
}); // render with default settings
// JSGL.ExampleHTML.Render({
//     backgroundColor: 'red'
// }); // override default settings (sets the background color of body to red)

// Create Game Instance
let game = new JSGL.Game({
    canvas: document.getElementById("gameCanvas"),
    grid: new JSGL.Vector2(8, 6),
    autoResize: true,
    refreshWhenUnfocused: true
});
// Add resource to load
game.LoadResource('image', 'points', './resources/images/point.png');
// game.LoadResource('image', 'player', './player.png');
// game.LoadResource('image', 'enemy', './enemy.png');

game.RescaleCanvasToParentElement(0.95);
// game.RescaleCanvasToParentElement(percentage);

// Creating own JSGL Sprite GameObject
class Enemy extends JSGL.Sprite{
    move = true;

    OnStart(game){
        this.texture = game.GetImage('points');
        this.showHitbox = true;
    }
    Update(deltaTime, game){
        const rotationPerSec = 30;
        const rotationPerMillis = rotationPerSec / 1000; 
        this.transform.rotate(rotationPerMillis * deltaTime);
        if(this.move)
            this.transform.move(new JSGL.Vector2(1/1000 * deltaTime, 1/1000 * deltaTime));
        game.Update();
    }
    OnMouseClick(game){
        console.log("Clicked! @", this);
        return true;
    }
}

// Start loading and wait to load all resources.
// game.on('loadAllResources', () => {
//     game.Start();
// });
// game.LoadAllResources();
console.log("Waiting for load..");
game.LoadGameAndStart().then(() => {
    console.log("Loaded");
    game.on('draw', () => {
        game.renderer.fillFrame({ color: '#F0F0F0' });
        game.renderer.drawRectangle(0, 0, 1, 1);
        game.renderer.drawRectangle(2, 0, 1, 1, { color: 'blue' });
        game.renderer.drawRectangle(3, 0, 1, 1, { color: 'yellow' });
        game.renderer.drawRectangle(1, 2, 1, 1, { color: 'magenta', angle: 45});
    });
    game.on('mouseUp', (event) => {
        // console.log('Mouse up!');
    })
    game.on('mouseDown', (event) => {
        // console.log('Mouse down!');
    })
    game.on('mouseClick', (event) => {
        // console.log(event.mousePos, event.mouseClientPos);
    });
    let enemy = new Enemy();
    enemy.transform.addX(3).addY(1);
    enemy.move = false;
    game.AddGameObject(enemy).showHitbox = false;
    game.AddGameObject(new Enemy()).showHitbox = false;
    game.AddGameObject(new Enemy()).transform.add(new JSGL.Vector2(3.5, 2.5));
    game.AddGameObject(new Enemy()).transform.add(new JSGL.Vector2(0, 3));
});