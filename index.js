import { Graph } from './graph.js';

const test = new Graph();

console.log('--- BFS ---');
console.log(test.knightMovesBFS(test.board[0][0], test.board[1][2]));
console.log('--- BFS ---');
console.log(test.knightMovesBFS(test.board[0][0], test.board[3][3]));
console.log('--- BFS ---');
console.log(test.knightMovesBFS(test.board[3][3], test.board[0][0]));
console.log('--- BFS ---');
console.log(test.knightMovesBFS(test.board[0][0], test.board[7][7]));
console.log('--- DFS ---');
console.log(test.knightMovesDFS(test.board[0][0], test.board[1][2]));
console.log('--- DFS ---');
console.log(test.knightMovesDFS(test.board[0][0], test.board[3][3]));
console.log('--- DFS ---');
console.log(test.knightMovesDFS(test.board[3][3], test.board[0][0]));
console.log('--- DFS ---');
console.log(test.knightMovesDFS(test.board[0][0], test.board[7][7]));

console.log('---BFS vs DFS---');
console.log('---BFS--- Guaranteed shortest path');
console.log(test.knightMovesBFS(test.board[0][0], test.board[0][1]));
console.log('---DFS--- Not guaranteed shortest path');
console.log(test.knightMovesDFS(test.board[0][0], test.board[0][1]));
