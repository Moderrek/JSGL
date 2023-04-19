function hash32shift(key: number){
  key = ~key + (key << 15); // key = (key << 15) - key - 1;
  key = key ^ (key >>> 12);
  key = key + (key << 2);
  key = key ^ (key >>> 4);
  key = key * 2057; // key = (key + (key << 3)) + (key << 11);
  key = key ^ (key >>> 16);
  return key;
}


export function noise(x: number, y: number, seed: number){
    return hash32shift(seed+hash32shift(x+hash32shift(y)));
}