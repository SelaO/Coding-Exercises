
class Coordinate {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

class Node {

    constructor(coord, level) {
        this.coord = coord;
        this.level = level;
    }
}

function compareCoordinates(a, b) {
    return a.x == b.x && a.y == b.y
}

function getPossibleNeighbors(matrix, coordinate) {

    const result = [];
    if(coordinate.x - 1 >= 0 && matrix[coordinate.x - 1][coordinate.y] == 0) {
        matrix[coordinate.x - 1][coordinate.y] = 1;
        result.push(new Coordinate(coordinate.x - 1, coordinate.y))
    }
    if(coordinate.x + 1 < matrix.length && matrix[coordinate.x + 1][coordinate.y] == 0) {
        matrix[coordinate.x + 1][coordinate.y] = 1;
        result.push(new Coordinate(coordinate.x + 1, coordinate.y))
    }
    if(coordinate.y - 1 >= 0 && matrix[coordinate.x][coordinate.y - 1] == 0) {
        matrix[coordinate.x][coordinate.y - 1] = 1;
        result.push(new Coordinate(coordinate.x, coordinate.y - 1))
    }
    if(coordinate.y + 1 < matrix[0].length && matrix[coordinate.x][coordinate.y + 1] == 0) {
        matrix[coordinate.x][coordinate.y + 1] = 1;
        result.push(new Coordinate(coordinate.x, coordinate.y + 1))
    }

    return result;
}

function findMinPath(matrix, start, finish) {

    const queue = [new Node(start, 0)];

    while(queue.length > 0) {
        const {coord, level} = queue.shift();

        if(compareCoordinates(coord, finish)) {
            return level;
        }

        queue.push(...getPossibleNeighbors(matrix, coord).map(e => new Node(e, level + 1)));
    }

    return -1;
}


const mat = [
    [1, 0, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
  ]

console.log(findMinPath(mat, new Coordinate(0,1), new Coordinate(3, 4)))
