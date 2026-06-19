/*
  https://moderrek.github.io/JSGLDoc/
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(15, 15)}, { backgroundColor: 'black' });

// When the game is drawn we are filling the background with white color.
game.on('draw', (event) => {
    event.renderer.fillFrame({ color: 'white' });
});

class BouncingRect extends JSGL.Shape {
    Start(){
        this.transform.set(game.GetRandomPosition());     // sets random position on the grid
        this.showHitbox = true;                           // shows hitbox for better visibility of bouncing
        this.properties.color = 'black';                  // sets color of the rectangle to black
        this.transform.eulerAngles = 360 * Math.random(); // sets random rotation angle in degrees
    }
    Update(event){
        this.transform.eulerAngles += 45 * event.deltaTime; // adds 45 degrees per second to the rotation
        this.transform.translate(
            this.transform.forward.multiply(5 * event.deltaTime) // moves forward with speed of 5 units per second
        )
        this.transform.ifOnEdgeBounce(event.game.grid); // bounces on the edge of the grid
    }
}

game.LoadGameAndStart().then(() => {
    // Adds 8 bouncing rectangles to the game with 1 second delay between each of them.
    JSGL.DelayedFor(() => game.AddGameObject(new BouncingRect()), 1000, 8);
});