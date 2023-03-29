// JSGL.ExampleHTML.Render({ backgroundColor: 'black'});
// const grid = new JSGL.Vector2(10, 10);
// const game = new JSGL.Game({
//     canvas: document.getElementById("gameCanvas"),
//     grid: grid,
// });
// game.RescaleCanvasToParentElement(1);

// This do this same!
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(10, 10)}, { backgroundColor: 'black' }, 1);