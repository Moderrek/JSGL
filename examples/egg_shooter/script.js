/**
 * Authors: 
 * Gofrrr <https://github.com/Gofrrr>
 * Moderr <https://github.com/Moderrek>
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(8, 6)}, { backgroundColor: 'darkgrey' }, 1);

game.LoadResource('image', 'multitasker', './Multitasker.png');

game.on('draw', (event) => {
    event.renderer.fill('white');
});

class Egg extends JSGL.Sprite {
    speed;

    Start(){
        this.speed = Math.random() / 1000;
        this.texture = game.GetImage('multitasker');
        this.toRandomPos();
    }
    OnMouseClick(){
        this.killAndSpawn();
        game.PlaySound('./pop.mp3');
    }
    Update(event){
        this.transform.translate(JSGL.Vector2.up.multiply(event.deltaTime + this.speed));
        this.transform.eulerAngles += 50 * event.deltaTime;
        if(this.transform.position.y > 7){
            this.killAndSpawn();
        }
    }

    toRandomPos(){
        this.transform.set(game.GetRandomPosition());
        this.transform.position.y = -(2 * Math.random());
    }

    killAndSpawn() {
        game.DestroyGameObjectByRef(this);
        game.AddGameObject(new Egg());
    }
}

function spawnEgg(){
    const egg = new Egg();
    game.AddGameObject(egg);
}

game.LoadGameAndStart().then(() => {
    // Spawn 3 eggs at the start of the game
    for (let i = 0; i < 3; ++i) {
        spawnEgg();
    }
    // Spawn an egg every 7 seconds
    setInterval(() => {
        spawnEgg();
    }, 7000);
});
