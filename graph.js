/**
 * Represents a vertex in the chess board graph.
 * Each vertex corresponds to a position on the board and maintains its connections.
 */
class GraphVertex {
  /**
   * Creates a new vertex for the chess board graph.
   * @param {number} row - The row position on the board (0-7)
   * @param {number} column - The column position on the board (0-7)
   */
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.edges = [];
    this.previous = null;
  }
}

/**
 * Represents a graph of a chess board where vertices are connected based on knight's moves.
 * Implements both BFS and DFS algorithms to find the shortest path for a knight.
 */
class Graph {
  /**
   * Creates a new chess board graph with 8x8 dimensions.
   * Initializes the board and connects all possible knight moves.
   */
  constructor() {
    this.boardSize = 8;
    this.board = [];
    this.#createVertices();
    this.#connectAllAdjacents();
  }

  /**
   * Creates vertices for each position on the chess board.
   * @private
   */
  #createVertices() {
    for (let row = 0; row < this.boardSize; row++) {
      const rowArray = [];

      for (let column = 0; column < this.boardSize; column++) {
        try {
          rowArray.push(new GraphVertex(row, column));
        } catch (err) {
          console.log(err);
        }
      }

      this.board.push(rowArray);
    }
  }

  /**
   * Creates a bidirectional edge between two vertices.
   * @private
   * @param {GraphVertex} vertex1 - The first vertex
   * @param {GraphVertex} vertex2 - The second vertex
   */
  #createEdge(vertex1, vertex2) {
    vertex1.edges.push(vertex2);
    vertex2.edges.push(vertex1);
  }

  /**
   * Checks if an edge exists between two vertices.
   * @private
   * @param {GraphVertex} vertex1 - The first vertex
   * @param {GraphVertex} vertex2 - The second vertex
   * @returns {boolean} True if an edge exists between the vertices
   */
  #edgeExists(vertex1, vertex2) {
    const row1 = vertex1.row;
    const column1 = vertex1.column;

    return vertex2.edges.some(
      (connectedVertex) => connectedVertex.row === row1 && connectedVertex.column === column1
    );
  }

  /**
   * Finds all valid adjacent positions a knight can move to from the given vertex.
   * @private
   * @param {GraphVertex} vertex - The current vertex
   * @returns {GraphVertex[]} Array of adjacent vertices representing valid knight moves
   */
  #findAdjacents(vertex) {
    const movePatterns = [
      [vertex.row - 2, vertex.column + 1],
      [vertex.row - 1, vertex.column + 2],
      [vertex.row + 1, vertex.column + 2],
      [vertex.row + 2, vertex.column + 1],
      [vertex.row + 2, vertex.column - 1],
      [vertex.row + 1, vertex.column - 2],
      [vertex.row - 1, vertex.column - 2],
      [vertex.row - 2, vertex.column - 1],
    ];

    const possibleMoves = movePatterns.filter(([row, column]) => {
      return row >= 0 && row < this.boardSize && column >= 0 && column < this.boardSize;
    });

    const possibleAdjacents = possibleMoves.map(([row, column]) => {
      return this.board[row][column];
    });

    return possibleAdjacents;
  }

  /**
   * Connects a vertex with all its valid adjacent positions.
   * @private
   * @param {GraphVertex} vertex - The vertex to connect
   */
  #connectAdjacents(vertex) {
    const adjacents = this.#findAdjacents(vertex);

    adjacents.forEach((adjacent) => {
      if (!this.#edgeExists(vertex, adjacent)) {
        this.#createEdge(vertex, adjacent);
      }
    });
  }

  /**
   * Connects all vertices on the board with their valid adjacent positions.
   * @private
   */
  #connectAllAdjacents() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let column = 0; column < this.boardSize; column++) {
        this.#connectAdjacents(this.board[row][column]);
      }
    }
  }

  /**
   * Finds a path from initial to end position using Depth-First Search.
   * @param {GraphVertex} initialVertex - The starting position
   * @param {GraphVertex} endVertex - The target position
   * @returns {Array<[number, number]>} Array of [row, column] coordinates representing the path
   */
  knightMovesDFS(initialVertex, endVertex) {
    const stack = [];
    const explored = [];

    stack.push(initialVertex);

    while (stack.length > 0) {
      const vertex = stack.pop();
      explored.push(vertex);

      if (vertex.row === endVertex.row && vertex.column === endVertex.column) {
        console.log('Explored vertices: ', explored.length);
        return this.#reconstructPath(vertex, initialVertex);
      }

      const adjacents = this.#findAdjacents(vertex);
      adjacents.forEach((adjacent) => {
        if (!this.#isVertexInArray(adjacent, stack) && !this.#isVertexInArray(adjacent, explored)) {
          adjacent.previous = vertex;
          stack.push(adjacent);
        }
      });
    }

    return null;
  }

  /**
   * Finds the shortest path from initial to end position using Breadth-First Search.
   * @param {GraphVertex} initialVertex - The starting position
   * @param {GraphVertex} endVertex - The target position
   * @returns {Array<[number, number]>} Array of [row, column] coordinates representing the path
   */
  knightMovesBFS(initialVertex, endVertex) {
    const queue = [];
    const explored = [];

    queue.push(initialVertex);

    while (queue.length > 0) {
      const vertex = queue.shift();
      explored.push(vertex);

      if (vertex.row === endVertex.row && vertex.column === endVertex.column) {
        console.log('Explored vertices: ', explored.length);
        return this.#reconstructPath(vertex, initialVertex);
      }

      const adjacents = this.#findAdjacents(vertex);
      adjacents.forEach((adjacent) => {
        if (!this.#isVertexInArray(adjacent, queue) && !this.#isVertexInArray(adjacent, explored)) {
          adjacent.previous = vertex;
          queue.push(adjacent);
        }
      });
    }

    return null;
  }

  /**
   * Reconstructs the path from end vertex to initial vertex using the previous pointers.
   * @private
   * @param {GraphVertex} vertex - The end vertex
   * @param {GraphVertex} initialVertex - The starting vertex
   * @returns {Array<[number, number]>} Array of [row, column] coordinates representing the path
   */
  #reconstructPath(vertex, initialVertex) {
    const path = [];

    while (vertex !== initialVertex) {
      path.push([vertex.row, vertex.column]);
      vertex = vertex.previous;
    }

    path.push([initialVertex.row, initialVertex.column]);

    return path.reverse();
  }

  /**
   * Checks if a vertex exists in an array of vertices.
   * @private
   * @param {GraphVertex} vertex - The vertex to check
   * @param {GraphVertex[]} array - The array to search in
   * @returns {boolean} True if the vertex is found in the array
   */
  #isVertexInArray(vertex, array) {
    return array.some((element) => {
      return vertex.row === element.row && vertex.column === element.column;
    });
  }
}

export { Graph };
