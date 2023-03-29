const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(25, 25)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fillFrame({ color: 'white' });
});

class BouncingRect extends JSGL.Shape {
    OnStart(event){
        console.log("Spawned");
        this.transform.goTo(game.GetRandomPosition());
        this.showHitbox = true;
        this.properties.color = 'black';
        this.transform.rotate(360 * Math.random());
        event.game.Update();
    }
    Update(event){
        const deltaTime = event.deltaTime;
        this.transform.rotate(45 * deltaTime);
        this.transform.move(new JSGL.Vector2(5 * deltaTime, 5 * deltaTime));
        this.transform.ifOnEdgeBounce(event.game.grid);
        event.game.Update();
    }
}

game.LoadGameAndStart().then(() => {
    // Delayed for
    const delay = 1000;
    const count = 5;
    //
    let i = 0;
    let taskId = setInterval(() => {
        if(++i === count)
            clearInterval(taskId);
        game.AddGameObject(new BouncingRect());
    }, delay);
});