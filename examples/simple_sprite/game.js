const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(5, 5)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fillFrame({ color: 'white' });
});

game.LoadResource('image', 'mouse', './mouse.png');

game.LoadGameAndStart().then(() => {
    const simpleSprite = new JSGL.SimpleSprite('mouse');
    simpleSprite.transform.rotate(90);
    game.AddGameObject(simpleSprite);

    const simpleSprite2 = new JSGL.SimpleSprite('mouse');
    simpleSprite2.transform.position.x = 1;
    simpleSprite2.transform.rotate(-90);
    game.AddGameObject(simpleSprite2);
});