export type ResourceType = 'image';

export type Resource = {
  uid: string;
  type: ResourceType;
  path: string;
  object?: object;
  loaded: boolean;
};