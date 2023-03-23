export interface Resource {
    uid: string;
    type: string;
    path: string;
    object: object;
    loaded: boolean;
}