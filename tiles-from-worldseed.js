/**
 * Big Walk - WorldSeed Puzzle Solver
 * Solves all save-tied puzzles directly from worldSeed using Unity's UnityEngine.Random (Marsaglia Xorshift128).
 * 
 * Works in:
 * - Browsers (as an ES module or via <script src="..."> creating window.BigWalkPuzzles)
 * - Node.js (via require or import)
 * - React / Vue / Svelte / Next.js / bundlers
 */

class UnityRandom {
  /**
   * Exact replica of UnityEngine.Random (Marsaglia Xorshift128).
   * @param {number} seed - Signed or unsigned 32-bit integer.
   */
  constructor(seed = 0) {
    this.state = new Uint32Array(4);
    this.initState(seed);
  }

  /**
   * Initializes state using Unity's 32-bit LCG multiplier 1812433253.
   * @param {number} seed 
   */
  initState(seed) {
    let s0 = seed >>> 0;
    let s1 = (Math.imul(s0, 1812433253) + 1) >>> 0;
    let s2 = (Math.imul(s1, 1812433253) + 1) >>> 0;
    let s3 = (Math.imul(s2, 1812433253) + 1) >>> 0;
    this.state[0] = s0;
    this.state[1] = s1;
    this.state[2] = s2;
    this.state[3] = s3;
  }

  /**
   * Generates next 32-bit unsigned integer via Xorshift128.
   * @returns {number}
   */
  nextUint() {
    let t = (this.state[0] ^ ((this.state[0] << 11) >>> 0)) >>> 0;
    t = (t ^ (t >>> 8)) >>> 0;
    this.state[0] = this.state[1];
    this.state[1] = this.state[2];
    this.state[2] = this.state[3];
    const s = this.state[3];
    this.state[3] = ((s ^ (s >>> 19)) ^ t) >>> 0;
    return this.state[3];
  }

  /**
   * Replicates UnityEngine.Random.Range(int min, int max) [min inclusive, max exclusive].
   * @param {number} minVal 
   * @param {number} maxVal 
   * @returns {number}
   */
  rangeInt(minVal, maxVal) {
    const dif = (maxVal - minVal) >>> 0;
    if (dif === 0) return minVal;
    return minVal + (this.nextUint() % dif);
  }
}

// Internal index (0..8) -> User Slot 4 symbol label (1..9)
const SLOT4_INDEX_TO_LABEL = [6, 9, 5, 3, 4, 7, 8, 2, 1];

/**
 * Solves Puzzle 1: Tile Thief (saveSeed = 5, 4 slots).
 * Slots 1-3 allow repeats; Slot 4 redraws if matching Slot 1's symbol.
 * @param {number} worldSeed - 32-bit integer (e.g. from save file).
 * @returns {string} 4-digit solution string (e.g. "7757").
 */
function solveTileThief(worldSeed) {
  const rng = new UnityRandom((worldSeed + 5) >>> 0);
  const puzzleSeed = rng.rangeInt(0, 99999);

  rng.initState(puzzleSeed);
  const idx0 = rng.rangeInt(0, 9);
  const idx1 = rng.rangeInt(0, 9);
  const idx2 = rng.rangeInt(0, 9);

  let idx3 = rng.rangeInt(0, 9);
  let tries = 0;
  while (idx3 === idx0 && tries < 200) {
    idx3 = rng.rangeInt(0, 9);
    tries++;
  }

  return `${idx0 + 1}${idx1 + 1}${idx2 + 1}${SLOT4_INDEX_TO_LABEL[idx3]}`;
}

/**
 * Solves Puzzle 2: Optical Telegraph (saveSeed = 2, 5 slots, no repeats).
 * @param {number} worldSeed - 32-bit integer.
 * @returns {string} 5-digit solution string (e.g. "32851").
 */
function solveOpticalTelegraph(worldSeed) {
  const rng = new UnityRandom((worldSeed + 2) >>> 0);
  const puzzleSeed = rng.rangeInt(0, 99999);

  rng.initState(puzzleSeed);
  const seq = [];
  for (let i = 0; i < 5; i++) {
    let idx = rng.rangeInt(0, 9);
    let tries = 0;
    while (seq.includes(idx) && tries < 200) {
      idx = rng.rangeInt(0, 9);
      tries++;
    }
    seq.push(idx);
  }
  return seq.map(x => x + 1).join('');
}

/**
 * Solves Puzzle 3: Blindfold Fish Trap (saveSeed = 1946, 3 slots, no repeats).
 * @param {number} worldSeed - 32-bit integer.
 * @returns {string} 3-digit solution string.
 */
function solveBlindfoldFishTrap(worldSeed) {
  const rng = new UnityRandom((worldSeed + 1946) >>> 0);
  const puzzleSeed = rng.rangeInt(0, 99999);

  rng.initState(puzzleSeed);
  const seq = [];
  for (let i = 0; i < 3; i++) {
    let idx = rng.rangeInt(0, 9);
    let tries = 0;
    while (seq.includes(idx) && tries < 200) {
      idx = rng.rangeInt(0, 9);
      tries++;
    }
    seq.push(idx);
  }
  return seq.map(x => x + 1).join('');
}

/**
 * Solves all save-tied puzzles for a given worldSeed.
 * @param {number} worldSeed 
 * @returns {{ tileThief: string, opticalTelegraph: string, blindfoldFishTrap: string }}
 */
function solveAll(worldSeed) {
  const seed = typeof worldSeed === 'string' ? parseInt(worldSeed.trim(), 10) : Number(worldSeed);
  if (isNaN(seed)) {
    throw new Error(`Invalid worldSeed: ${worldSeed}`);
  }
  return {
    tileThief: solveTileThief(seed),
    opticalTelegraph: solveOpticalTelegraph(seed),
    blindfoldFishTrap: solveBlindfoldFishTrap(seed)
  };
}

// Universal module export (ESM / CommonJS / Browser Window)
const BigWalkPuzzles = {
  UnityRandom,
  solveTileThief,
  solveOpticalTelegraph,
  solveBlindfoldFishTrap,
  solveAll
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BigWalkPuzzles;
  module.exports.default = BigWalkPuzzles;
  module.exports.UnityRandom = UnityRandom;
  module.exports.solveTileThief = solveTileThief;
  module.exports.solveOpticalTelegraph = solveOpticalTelegraph;
  module.exports.solveBlindfoldFishTrap = solveBlindfoldFishTrap;
  module.exports.solveAll = solveAll;
}

if (typeof window !== 'undefined') {
  window.BigWalkPuzzles = BigWalkPuzzles;
}

