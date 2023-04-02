/*
  https://jsglreference.pl/
 */
const game = JSGL.DefaultGame.Create({ grid: new JSGL.Vector2(10, 10)}, { backgroundColor: 'black' });

game.on('draw', (event) => {
    event.renderer.fill('white');
});

class MovingRect extends JSGL.Shape {
    Start(){
        this.transform.set(game.GetRandomPosition());
        this.properties.color = 'red';
        this.properties.border = true;
        this.properties.borderColor = 'black';
    }
    Update(event){
        this.transform.translate(new JSGL.Vector2(1, 1).multiply(event.deltaTime).multiply(this.transform.forward));
    }
    OnMouseClick = () => console.log('mouse click');
    OnMouseDown = () => console.log('mouse down');
    OnMouseUp = () => console.log('mouse up');
    OnMouseHoverStart(){
        console.log('mouse hover start');
        this.properties.color = 'blue';
    }
    OnMouseHoverEnd(){
        console.log('mouse hover end');
        this.properties.color = 'red';
    }
}

game.LoadGameAndStart().then(() => {
    const delay = 1000;
    const lifeTime = 10 * 1000;
    setInterval(() => {
        const gameObj = game.AddGameObject(new MovingRect());
        setInterval(() => {
            game.DestroyGameObjectByRef(gameObj);
        }, lifeTime);
    }, delay);
});