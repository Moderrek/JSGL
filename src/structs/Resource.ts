export interface Resource {
    uid: string;
    type: string;
    path: string;
    object: object | undefined;
    loaded: boolean;
}