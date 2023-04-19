/*
  https://jsglreference.pl/
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(5, 5)}, { backgroundColor: 'black' });

// Creates white background for canvas
game.on('draw', (event) => {
    event.renderer.fill('white');
});

game.LoadGameAndStart().then(() => {
    const simpleCircle = new JSGL.SimpleShape(JSGL.ShapeType.Circle);
    game.AddGameObject(simpleCircle);

    const simpleCustomCircle = new JSGL.SimpleShape(JSGL.ShapeType.Circle, { color: 'red', border: true, alpha: 0.8});
    simpleCustomCircle.transform.position.x = 1;
    game.AddGameObject(simpleCustomCircle);

    const simpleCustomRect = new JSGL.SimpleShape(JSGL.ShapeType.Rect, {
        color: 'magenta',
        angle: 30,
        rotationStyle: JSGL.RotationStyle.allAround,
        fill: false,
        border: true,
        borderSize: 1,
        borderColor: 'black',
        shadow: {
            color: 'black',
            offsetX: 0.1,
            offsetY: 0.1,
            blur: 0.1
        }
    });
    simpleCustomRect.transform.position.x = 3;
    simpleCustomRect.transform.position.y = 1;
    game.AddGameObject(simpleCustomRect)
});