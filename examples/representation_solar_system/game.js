/*
  https://jsglreference.pl/
 */
// This is not real solar system.
// This is only REPRESENTATION of solar system.
const zoom = 75;
const grid = new JSGL.Vector2(16 * zoom / 10, 9 * zoom / 10);
const canvasCenter = grid.clone().divide(2);

const game = JSGL.DefaultGame.Create({ grid: grid }, { backgroundColor: 'black' }, 1);

class Sun extends JSGL.Shape {
    Start(){
        // Shape
        this.type = JSGL.ShapeType.Circle;
        this.properties.color = '#ff9801';
        // Transform
        this.transform.scale = new JSGL.Vector2(5, 5);
        this.transform.set(canvasCenter);
    }
}

class Planet extends JSGL.Shape {
    offset;
    color;
    size;
    Start(){
        // Shape
        this.type = JSGL.ShapeType.Circle;
        this.properties.color = this.color;
        // Transform
        this.transform.scale = new JSGL.Vector2(this.size, this.size);
        this.transform.rotation = JSGL.Rotation.up;
        this.transform.set(canvasCenter.clone().subtract(new JSGL.Vector2(this.offset * 6, this.size / 2 - 5 / 2 - 1)));
    }
    Update(event){
        this.transform.eulerAngles += (360 / 6 * event.deltaTime / this.offset);
        this.transform.translate(new JSGL.Vector2(9.3, 3).multiply(event.deltaTime).multiply(this.transform.forward));
    }
}

game.LoadGameAndStart().then(() => {
    game.timeScale = 2;
    function createPlanet(offset, color, size){
        let planet = new Planet();
        planet.offset = offset;
        planet.color = color;
        planet.size = size;
        game.AddGameObject(planet);
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