/**
 * Properties for {@link ExampleHTML.Render}
 */
export interface ExampleHTMLProperties {
    document?: Document|undefined;
    backgroundColor?: string|undefined;
}
/**
 * Default properties for {@link ExampleHTML.Render}
 */
export const exampleHTMLDefaultProperties: ExampleHTMLProperties = {
    document: undefined,
    backgroundColor: undefined
}

/** 
 * Helps with creating game page.
 * @group Tools
 */
export class ExampleHTML {

    /**
     * Creates HTML game page with given properties.
     * Page is sized to viewport and canvas is centered.
     * @param props The properties.
     */
    static Render(props: ExampleHTMLProperties | undefined){
        props = { ...exampleHTMLDefaultProperties, ...props };
        if(!(props.document instanceof Document)){
            if(document instanceof Document){
                props.document = document;
            }else{
                throw new Error("Default DOM cannot be assigned! Please assign document to 'document' property");
            }
        }
        props.document.write('<div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;"><canvas id="gameCanvas">Your browser does not support the HTML 5 canvas.</canvas></div>');
        props.document.body.style.height = '100vh';
        props.document.body.style.width = '100vw';
        props.document.body.style.margin = '0';
        if(props.backgroundColor !== undefined)
        props.document.body.style.backgroundColor = props.backgroundColor;
    }
}