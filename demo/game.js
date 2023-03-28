JSGL.ExampleHTML.Render({
    backgroundColor: '#0F0F0F'
});

let game = new JSGL.Game({
    canvas: document.getElementById("gameCanvas"),
    grid: new JSGL.Vector2(8, 6)
});

game.LoadResource('image', 'points', './resources/images/point.png');

game.RescaleCanvasToParentElement(0.95);

class Enemy extends JSGL.Sprite {
    move = true;

    OnStart(event) {
        this.texture = event.game.GetImage('points');
        this.showHitbox = true;
        this.transform.rotate(360 * Math.random());
    }
    Update(event) {
        // this.transform.rotate(30 * event.deltaTime);
        if (this.move)
            this.transform.move(new JSGL.Vector2(1 * event.deltaTime, 1 * event.deltaTime));
        this.transform.ifOnEdgeBounce(event.game.grid);
        event.game.Update();
    }
    OnMouseClick(event) {
        console.log(this);
        return true;
    }
}

console.log("Waiting for load..");
game.LoadGameAndStart().then(() => {
    console.log("Loaded");
    // game.on('draw', (event) => {
    //     game.renderer.fillFrame({
    //         color: '#F0F0F0'
    //     });
    //     game.renderer.drawRectangle(0, 0, 1, 1, {
    //         shadow: {
    //             color: 'black',
    //             offsetX: 0.05,
    //             offsetY: 0.05,
    //             blur: 0.4
    //         }
    //     });
    //     // game.renderer.drawTriangle(2, 0, 1, 1, {
    //     //     color: 'blue'
    //     // });
    //     //
    //     game.renderer.drawRectangle(4.9, 0, 1.2, 3.1, {
    //         alpha: 0.2
    //     });
    //     game.renderer.drawCircle(5, 0, 1, {
    //         color: 'green',
    //         border: true,
    //         fill: true,
    //         alpha: 0.1
    //     });
    //     game.renderer.drawCircle(5, 1, 1, {
    //         color: 'yellow',
    //         border: true,
    //         fill: true,
    //         alpha: 0.1
    //     });
    //     game.renderer.drawCircle(5, 2, 1, {
    //         color: 'red',
    //         border: true,
    //         fill: true
    //     });
    //     //
    //     game.renderer.drawRectangle(1, 2, 1, 1, {
    //         color: 'magenta',
    //         angle: 45,
    //         border: true,
    //         borderColor: 'red',
    //         alpha: 0.1,
    //         shadow: {
    //             color: 'red',
    //             offsetX: 0.1,
    //             offsetY: 0.1,
    //             blur: 1
    //         }
    //     });
    // });
    // game.on('mouseUp', (event) => {
    //     console.log('Mouse up!');
    // })
    // game.on('mouseDown', (event) => {
    //     console.log('Mouse down!');
    // })
    // game.on('mouseClick', (event) => {
    //     console.log(event.mousePos, event.mouseClientPos);
    // });
    game.on('draw', (event) => {
        game.renderer.fillFrame({
            color: '#F0F0F0'
        });
    });
    let enemy = new Enemy();
    enemy.transform.addX(3).addY(1);
    enemy.move = false;
    game.AddGameObject(enemy).showHitbox = false;
    game.AddGameObject(new Enemy()).showHitbox = false;
    game.AddGameObject(new Enemy()).transform.add(new JSGL.Vector2(3.5, 2.5));
    game.AddGameObject(new Enemy()).transform.add(new JSGL.Vector2(0, 3));

    let shape = new JSGL.Shape();
    shape.properties.color = 'red';
    shape.type = JSGL.ShapeType.Cube;
    shape.transform.goTo(game.GetRandomPosition());
    game.AddGameObject(shape);
});