const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(10, 10)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fillFrame({ color: 'white' });
});

class BouncingRect extends JSGL.Shape {
    OnStart(event){
        console.log("Spawned");
        this.transform.goTo(game.GetRandomPosition());
        //this.showHitbox = true;
        this.properties.color = 'red';
        this.properties.border = true;
        this.properties.borderColor = 'black';
        event.game.Update();
    }
    Update(event){
        const deltaTime = event.deltaTime;
        this.transform.move(new JSGL.Vector2(1 * deltaTime, 1 * deltaTime));
        event.game.Update();
    }
    OnDestroy(event){
        console.log("Destroyed");
    }
}

game.LoadGameAndStart().then(() => {
    const delay = 1000;
    const lifeTime = 10 * 1000;
    setInterval(() => {
        const gameObj = game.AddGameObject(new BouncingRect());
        // game.AddGameObject(new JSGL.SimpleShape(JSGL.ShapeType.Circle, { color: 'red', border: true, alpha: 0.5}));
        setInterval(() => {
            game.DestroyGameObjectByRef(gameObj);
        }, lifeTime);
    }, delay);
});