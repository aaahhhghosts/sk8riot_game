/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function add(accumulator, a) {
    return accumulator + a;
}

export let karmatic_arcade_alpha_dict = new Map([
    ['A', [0]],     ['N', [100]],    ['0', [200]],
    ['B', [1]],     ['O', [101]],    ['1', [201, 1]],
    ['C', [2]],     ['P', [102]],    ['2', [202]],
    ['D', [3]],     ['Q', [103]],    ['3', [203]],
    ['E', [4]],     ['R', [104]],    ['4', [204]],
    ['F', [5]],     ['S', [105]],    ['5', [205]],
    ['G', [6]],     ['T', [106, 1]], ['6', [206]],
    ['H', [7]],     ['U', [107]],    ['7', [207]],
    ['I', [8, 5]],  ['V', [108]],    ['8', [208]],
    ['J', [9]],     ['W', [109]],    ['9', [209]],
    ['K', [10]],    ['X', [110]],    ['!', [210, 6]],
    ['L', [11, 1]], ['Y', [111, 1]], ['?', [211]],
    ['M', [12]],    ['Z', [112]],    ['-', [212, 1]],
]);
