/**
 * Finds the number of unique solutions based solely on piece order.
 */

const fs = require('fs');

function arrEqual(a, b) {
    for(var i = 0; i < a.length; i++) 
        if(a[i].num !== b[i].num && a[i].flipped === b[i].flipped) 
            return false;
    return true;
}

fs.readFile('solutions.json', (err, data) => {
    let solutions = JSON.parse(data);
    
    let uniques = [];
    for(let solution of solutions) {
        if(!uniques.some(s => arrEqual(solution, s))) {
            uniques.push(solution);
        }
    }

    console.log(uniques);
    console.log('number of uniques: ', uniques.length);

    let reverses = 0;
    for(let sol of uniques) {
        if(uniques.some(s => arrEqual(sol.reverse(), s)))
            reverses++;
    }

    console.log('number of reverses: ', reverses); // this must be equal to the number of uniques
});