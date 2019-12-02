# CSpike
Open source [Corellian Spike](https://starwars.fandom.com/wiki/Corellian_Spike) package.

## Installation
`> npm i @cspike/cspike`

or

`> yarn add @cspike/cspike`

## Creating a New Game
```javascript
const CSpike = require('@cspike/cspike');

const game = new CSpike.Game(4);
// creates a game with 4 players
```

## Starting Your Game
```javascript
const CSpike = require('@cspike/cspike');

const game = new CSpike.Game(4);

game.start();
// This changes game.state.phase from 'Setup' to ''
```
