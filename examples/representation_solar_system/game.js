// This is not real solar system.
// This is only REPRESENTATION of solar system.
const zoom = 75;
const grid = new JSGL.Vector2(16 * zoom / 10, 9 * zoom / 10);
JSGL.ExampleHTML.Render({ backgroundColor: 'black'});
const game = new JSGL.Game({
    canvas: document.getElementById("gameCanvas"),
    grid: grid,
});

game.RescaleCanvasToParentElement(1);

const srodek = grid.clone().divide(2);

class Sun extends JSGL.Shape {
    OnStart(event){
        this.type = JSGL.ShapeType.Circle;
        this.properties.color = '#ff9801';
        this.transform.goTo(srodek);
        this.transform.scale.x = 5;
        this.transform.scale.y = 5;
        event.game.Update();
    }
}

class Planet extends JSGL.Shape {
    offset;
    color;
    size;
    OnStart(event){
        this.type = JSGL.ShapeType.Circle;
        //this.showHitbox = true;
        this.properties.color = this.color;
        this.transform.goTo(srodek.clone().subtract(new JSGL.Vector2(this.offset * 6, this.size / 2 - 5 / 2 - 1)));
        this.transform.rotation = -90;
        this.transform.scale.x = this.size;
        this.transform.scale.y = this.size;
        event.game.Update();
    }
    Update(event){
        this.transform.rotate(360 / this.offset / 6 * event.deltaTime);
        this.transform.move(new JSGL.Vector2(9.3 * event.deltaTime, 3 * event.deltaTime));
        event.game.Update();
    }
}

game.LoadGameAndStart().then(() => {
    function createPlanet(offset, color, size){
        let planeta = new Planet();
        planeta.offset = offset;
        planeta.color = color;
        planeta.size = size;
        game.AddGameObject(planeta);
    }
    createPlanet(0.7, '#9c9c9c', 0.5);
    createPlanet(1, '#f9eec9', 1);
    createPlanet(1.5, '#65b0bb', 1);
    createPlanet(2, '#ee952e', 0.4);
    createPlanet(4, '#d7ae80', 4);
    createPlanet(6, '#f0e8c5', 3);
    createPlanet(8, '#3871b7', 2.5);
    createPlanet(9, '#3871b7', 2.5);
    createPlanet(11, '#dadada', 0.25);
    game.AddGameObject(new Sun());
});