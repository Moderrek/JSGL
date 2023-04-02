/*
  https://jsglreference.pl/
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(5, 5)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fill('white');
});

game.LoadResource('image', 'mouse', './mouse.png');

game.LoadGameAndStart().then(() => {
    const simpleSprite = new JSGL.SimpleSprite('mouse');
    simpleSprite.transform.rotation = JSGL.Rotation.right;
    game.AddGameObject(simpleSprite);

    const simpleSprite2 = new JSGL.SimpleSprite('mouse');
    simpleSprite2.transform.translate(1, 0);
    simpleSprite2.transform.rotation = JSGL.Rotation.left;
    game.AddGameObject(simpleSprite2);
});