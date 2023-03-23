interface ExampleHTMLProps {
    backgroundColor: string;
}
const defaultProps: ExampleHTMLProps = {
    backgroundColor: undefined
}

export class ExampleHTML {
    public static Render(props: ExampleHTMLProps = defaultProps): void{
        document.write('<div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;"><canvas id="gameCanvas"></canvas></div>');
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';
        if(props.backgroundColor !== undefined)
            document.body.style.backgroundColor = props.backgroundColor;
    }
}