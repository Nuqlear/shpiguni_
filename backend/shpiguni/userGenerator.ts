const prefixNames = [
    "Cringe",
    "Cool",
    "Fast",
    "Queer",
    "Black",
    "Funny",
    "Doctor",
    "Happy"
];
const postfixNames = ["Hamster",
    "Cat",
    "Andrew",
    "Puppey",
    "Elephant",
    "Pig",
    "House",
    "Racoon"
];

function randomInteger(max: number) {
    return Math.floor(Math.random()*(max + 1));
}

export function randomColor() {
    return `#${randomInteger(255)}${randomInteger(255)}${randomInteger(255)}`;
}

export function randomName() {
    const prefixIndex = randomInteger(prefixNames.length - 1);
    const postfixIndex = randomInteger(postfixNames.length - 1);
    return prefixNames[prefixIndex] + " " + postfixNames[postfixIndex];
}
