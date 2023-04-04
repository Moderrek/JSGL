/*
  https://jsglreference.pl/
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(15, 15)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fillFrame({ color: 'white' });
});

class BouncingRect extends JSGL.Shape {
    Start(){
        this.transform.set(game.GetRandomPosition());
        this.showHitbox = true;
        this.properties.color = 'black';
        this.transform.eulerAngles = 360 * Math.random();
    }
    Update(event){
        this.transform.eulerAngles += 45 * event.deltaTime;
        this.transform.translate(new JSGL.Vector2(5, 5).multiply(event.deltaTime).multiply(this.transform.forward));
        this.transform.ifOnEdgeBounce(event.game.grid);
    }
}

game.LoadGameAndStart().then(() => {
    // Delayed for
    const delay = 1000;
    const count = 8;
    //
    let i = 0;
    let taskId = setInterval(() => {
        if(++i === count)
            clearInterval(taskId);
        game.AddGameObject(new BouncingRect());
    }, delay);
});