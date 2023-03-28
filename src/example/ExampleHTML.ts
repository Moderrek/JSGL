/**
 * Properties for {@link ExampleHTML.Render}
 */
export interface ExampleHTMLProps {
    backgroundColor?: string;
}
/**
 * Default properties for {@link ExampleHTML.Render}
 */
export const defaultProps: ExampleHTMLProps = {
    backgroundColor: undefined
}

/** 
 * Helps with creating game page.
 * @group Tools
 * 
 */
export class ExampleHTML {

    /**
     * Creates HTML game page with given properties.
     * Page is sized to viewport and canvas is centered.
     * @param props The properties.
     */
    static Render(props: ExampleHTMLProps){
        props = { ...defaultProps, ...props };
        document.write('<div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;"><canvas id="gameCanvas"></canvas></div>');
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';
        document.body.style.margin = '0';
        if(props.backgroundColor !== undefined)
            document.body.style.backgroundColor = props.backgroundColor;
    }
}