const fs = require('fs');

const PEG_LENGTH = 3;

class Piece {
    
    num;
    maxRotation;
    holes;
    flippable;
    
    constructor(num, maxRotation, holes, flippable = false) {
        this.num = num;
        this.maxRotation = maxRotation; // max rotation where piece doesn't repeat
        this.holes = holes;
        this.flippable = flippable;
    }

    get(index, rotation = 0, flipped = false) {
        index = (index + rotation) % this.holes.length;
        if(flipped && index != 0) {
            index = this.holes.length - index; // the math checks out, btw
        }

        return this.holes[index];
    }
    
    /**
     * Assumes proper hole placement
     * @param {number[]} pegArr height of peg for each hole index
     */
    putOnStack(pegArr, rotation = 0, flipped = false) {
        for(let i = 0; i < this.holes.length; i++) {
            // there is a hole at index i
            if(this.get(i, rotation, flipped)) {
                if(pegArr[i] == 0) { 
                    // was an empty hole, put a peg in it
                    pegArr[i] += PEG_LENGTH - 1;
                } else {
                    pegArr[i]--;
                }
            }
        }
        
        return pegArr;
    }
    
    /**
     * 
     * @param {number[]} pegArr height of peg for each hole index
     * @returns returns an array of each rotation/flip that allows the piece to be put on the stack
     */
    canPutOnStack(pegArr) {
        let rs = [];
        for(let f of [false, true]) { // is flipped?
            for(let r = 0; r < this.maxRotation; r++) { // rotation
                // if every peg that is zero OR it is non-zero and has a hole to go into
                if(pegArr.every( (e, i) => e == 0 || e != 0 && this.get(i, r, f)))
                    rs.push({r, f}); // r = rotation, f = flipped
            }

            // don't check flipped version if this piece is not flippable
            if(!this.flippable)
                break;
        }

        return rs;
    }

    /**
     * Returns a string representation of this piece with the given qualities.
     * @param {number}  r rotation
     * @param {boolean} f flipped
     */
    rep(r, f) {
        return { num: this.num, r, f };
    }
}

// see reference image 
const PIECES = [
    new Piece(1,  6, [false, true,  false, false, false, false]),
    new Piece(2,  6, [true,  false, false, true,  true,  true ]),
    new Piece(3,  6, [true,  false, true,  true,  true,  true ]),
    new Piece(4,  6, [true,  true,  true,  false, false, false]),
    new Piece(5,  3, [true,  false, true,  true,  false, true ]),
    new Piece(6,  3, [false, true,  false, false, true,  false]),
    new Piece(7,  6, [true,  true,  false, true,  false, true ]),
    new Piece(8,  6, [true,  false, false, true,  false, true ], true), // the only piece that can be flipped
    new Piece(9,  6, [true,  true,  false, false, false, false]),
    new Piece(10, 1, [true,  true,  true,  true,  true,  true ]),
    new Piece(11, 6, [false, false, true,  false, true,  false]),
    new Piece(12, 2, [true,  false, true,  false, true,  false])
];

/**
 * @typedef Representation
 * @property {number}  num the piece number
 * @property {number}  r   rotation steps, counter-clockwise
 * @property {boolean} f   is the piece flipped?
 * 
 * @typedef Orientation
 * @property {number}  r rotation steps, counter-clockwise
 * @property {boolean} f is the piece flipped?
 */


/**
 * Helps with solve(...).
 * @param {Piece[]}            pieces    available pieces
 * @param {Piece[]}            stack     the pieces currently used
 * @param {number[]}           pegs      current peg heights
 * @param {Representation[][]} solutions all solutions
 * @param {number}             i         index of for loop
 * @param {Orientation}        ori       orientation to use
 */
function solveHelper(pieces, stack, pegs, solutions, i, ori) {
    let piece = pieces[i];

    stack.push(piece.rep(ori.r, ori.f));
    pieces.splice(i, 1); // remove from pieces
    
    solve(
        pieces, 
        stack, 
        piece.putOnStack([...pegs], ori.r, ori.f), 
        solutions
    );

    pieces.splice(i, 0, piece); // put piece back in the available pool
    stack.pop(); // don't need that any more
}

/**
 * Solves the puzzle!
 * @param {Piece[]}            pieces    available pieces
 * @param {Piece[]}            stack     the pieces currently used
 * @param {number[]}           pegs      current peg heights
 * @param {Representation[][]} solutions all solutions
 */
function solve(pieces, stack = [], pegs = [0, 0, 0, 0, 0, 0], solutions = []) {
    if(pieces.length == 0) { // no more pieces left in pool
        if(pegs.every(e => e == 0)) { // did we succeed?
            solutions.push([...stack]); // copy stack to solutions
        }
        return; // we done here
    }

    for(let i = 0; i < pieces.length; i++) {
        if(pegs.every(e => e == 0)) { // put down a "seed"
            solveHelper(pieces, stack, pegs, solutions, i, { r: 0, f: false });
        } else {
            let arr = pieces[i].canPutOnStack(pegs);
            if(arr.length != 0) {
                for(let ori of arr) {
                    solveHelper(pieces, stack, pegs, solutions, i, ori);
                }
            }
        }
    }

    return solutions;
}

let start = Date.now();
console.log('started');
let solutions = solve(PIECES);
console.log('time taken: ', Date.now() - start);
console.log('number of solutions: ', solutions.length);

fs.writeFile('solutions.json', JSON.stringify(solutions, null, 1), err => {
    if(err) console.log(err);
    console.log('done writing to file!');
});