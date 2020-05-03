# Hexa Dowel Puzzle Solver
The [Hexa Dowel Puzzle](https://www.prusaprinters.org/prints/28634) was pretty fun to complete, but its always fun to find all the solutions to the puzzle using `code`.

[This solver](./solver.js) finds every solution to the Hexa Dowel Puzzle.
It also times how long it takes to find the solutions. [This](./uniqueSolutions.js) finds every "unique" solution, if rotation is not taken into account.

Look at the [reference image](./reference.png) for much needed information on the solutions spit out by the solver.

## TL;DR
There are 17818 solutions, and it took my computer around 2.5 seconds to find them.
If you don't take rotation into account for the number of solutions, then there are 2088 solutions.