/*
This question is from codility.com and this is my solution in js

You have N bulbs that are connected in series and that are numbered from from 1 to N

if we switch on bulb 3:
-1-2-3-4-5-
| | |O| | |
-----------
it won't light up because bulbs 2 and 1 are off
but in this case bulbs 1, 2, 3 are lit
-1-2-3-4-5-
|O|O|O| | |
-----------

We get an array of indices of bulbs that we turn on in sequence
We want to count in each iteration, every instace where new bulbs are lit on

for example:

example input and outputs:
input: [3, 2, 1, 5, 4] output: 2
input: [3, 2, 1, 4, 5] output: 3
input: [1, 2, 3, 4, 5] output: 5
input: [5, 4, 3, 2, 1] output: 1


we can assume each index is unique and all indices will exist in the input

example run:
input: [3, 2, 1, 5, 4]

iteration: 0
count: 0
bulbs state:
-1-2-3-4-5-
| | | | | |
-----------

iteration: 1
count: 0
bulbs state:
-1-2-3-4-5-
| | |O| | |
-----------

iteration: 2
count: 0
bulbs state:
-1-2-3-4-5-
| |O|O| | |
-----------

iteration: 3
count: 1
bulbs state:
-1-2-3-4-5-
|O|O|O| | |
-----------

iteration: 4
count: 1
bulbs state:
-1-2-3-4-5-
|O|O|O| |O|
-----------

iteration: 5
count: 2
bulbs state:
-1-2-3-4-5-
|O|O|O|O|O|
-----------
*/

function bulbsSeriesCountOnInstances(arr) {

    const switchedOn = Array(arr.length).fill(0);
    const lit = Array(arr.length).fill(0);

    let result = 0;
    for (const bulb of arr) {
        const currIndex = bulb - 1;
        const prevIndex = bulb - 2;

        switchedOn[currIndex] = 1;

        if (bulb === 1 || lit[prevIndex]) {
            lit[currIndex] = 1;
            result++;
        }

        if (lit[currIndex]) {
            let i = bulb; // start with next element
            while (i < arr.length) {
                if (switchedOn[i]) {
                    lit[i] = true;
                }
                i++;
            }
        }
    }
    return result;
}

console.log("output:", bulbsSeriesCountOnInstances([3, 2, 1, 5, 4]), "expected:", 2)
console.log("output:", bulbsSeriesCountOnInstances([3, 2, 1, 4, 5]), "expected:", 3)
console.log("output:", bulbsSeriesCountOnInstances([1, 2, 3, 4, 5]), "expected:", 5)
console.log("output:", bulbsSeriesCountOnInstances([5, 4, 3, 2, 1]), "expected:", 1)
console.log("output:", bulbsSeriesCountOnInstances([7, 5, 3, 1, 2, 4, 6]), "expected:", 4)
console.log("output:", bulbsSeriesCountOnInstances([]), "expected:", 0)
console.log("output:", bulbsSeriesCountOnInstances([1]), "expected:", 1)
console.log("output:", bulbsSeriesCountOnInstances([1, 2]), "expected:", 2)
console.log("output:", bulbsSeriesCountOnInstances([2, 1]), "expected:", 1)

/*
Explanation: 
my solution is O(n) because we'll "see" every element at most 2 times
the while loop will always be halted and never go over the same elements again
this `lit[prevIndex]` lets us assume that all the previous bulbs are lit so we only need to 
lit the next switched on bulbs

*/
