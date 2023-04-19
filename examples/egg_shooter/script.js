/**
 * Authors: 
 * Gofrrr <https://github.com/Gofrrr>
 * Moderr <https://github.com/Moderrek>
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(8, 6)}, { backgroundColor: 'darkgrey' }, 1);

game.LoadResource('image', 'multitasker', './Multitasker.png');

class Egg extends JSGL.Sprite {
    speed;

    Start(){
        this.speed = Math.random() / 1000;
        this.texture = game.GetImage('multitasker');
        this.toRandomPos();
    }
    OnMouseClick(){
        game.DestroyGameObjectByRef(this);
        game.AddGameObject(new Egg());
        game.PlaySound('./pop.mp3');
    }
    Update(event){
        this.transform.translate(JSGL.Vector2.up.multiply(event.deltaTime + this.speed));
        this.transform.eulerAngles += 50 * event.deltaTime;
        if(this.transform.position.y > 7){
            game.DestroyGameObjectByRef(this);
            game.AddGameObject(new Egg());
        }
    }

    toRandomPos(){
        this.transform.set(game.GetRandomPosition());
        this.transform.position.y = Math.random() * -2;
    }
}

function spawnEgg(){
    const egg = new Egg();
    game.AddGameObject(egg);
}

game.on('draw', (event) => {
    event.renderer.fill('white');
});

game.on('keyUp', (event) => {
    if(event.input.isKeyUp('s')){
        game.timeScale -= 0.1;
    }
    if(event.input.isKeyUp('w')){
        game.timeScale += 0.1;
    }
    game.timeScale = JSGL.Clamp(game.timeScale, 0, 1);
});

game.LoadGameAndStart().then(() => {
    spawnEgg();
    spawnEgg();
    spawnEgg();
    setInterval(() => {
        spawnEgg();
    }, 7000);
});