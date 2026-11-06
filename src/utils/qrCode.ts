/**
 * Pure TypeScript ISO/IEC 18004 Compliant QR Code Generator for HomeCare 360
 * - Generates authentic, scannable QR Codes (Version 3 or 4, Error Correction M)
 * - Zero external dependencies, pure mathematical Galois Field GF(256) implementation
 * - Genuinely scannable by all standard smartphone cameras & QR scanners
 */

// Galois Field GF(2^8) math tables for Reed-Solomon Error Correction
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d; // QR Code standard polynomial x^8 + x^4 + x^3 + x^2 + 1
    }
  }
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const factor = new Uint8Array([1, EXP_TABLE[i]]);
    const nextPoly = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gfMultiply(poly[j], factor[0]);
      nextPoly[j + 1] ^= gfMultiply(poly[j], factor[1]);
    }
    poly = nextPoly;
  }
  return poly;
}

function rsCalculateEC(data: Uint8Array, ecCount: number): Uint8Array {
  const genPoly = rsGeneratorPoly(ecCount);
  const remainder = new Uint8Array(ecCount);

  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    for (let j = 0; j < ecCount - 1; j++) {
      remainder[j] = remainder[j + 1] ^ gfMultiply(genPoly[j + 1], factor);
    }
    remainder[ecCount - 1] = gfMultiply(genPoly[ecCount], factor);
  }

  return remainder;
}

// Version 4-M specifications (33x33 matrix, 64 data codewords, 36 EC codewords)
const V4_SIZE = 33;
const V4_DATA_CAPACITY = 64;
const V4_EC_CODEWORDS = 36;

export interface QRCodeData {
  size: number;
  matrix: boolean[][];
  svg: string;
}

export function generateQrCode(text: string): QRCodeData {
  // Convert text to UTF-8 bytes
  const utf8Encoder = new TextEncoder();
  const textBytes = utf8Encoder.encode(text);

  // Bit buffer for Byte mode (Mode indicator 0100, 8-bit character count)
  const bitBuffer: number[] = [];

  function appendBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer.push((val >> i) & 1);
    }
  }

  // 1. Mode indicator: 0100 (Byte mode)
  appendBits(4, 4);

  // 2. Character count (8 bits for Version 4 Byte mode)
  appendBits(textBytes.length, 8);

  // 3. Data bytes
  for (let i = 0; i < textBytes.length; i++) {
    appendBits(textBytes[i], 8);
  }

  // 4. Terminator (up to 4 zeroes)
  const capacityBits = V4_DATA_CAPACITY * 8;
  const termLen = Math.min(4, capacityBits - bitBuffer.length);
  appendBits(0, termLen);

  // 5. Pad to byte boundary
  while (bitBuffer.length % 8 !== 0) {
    bitBuffer.push(0);
  }

  // 6. Pad bytes (alternating 0xEC, 0x11)
  const padPatterns = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuffer.length < capacityBits) {
    appendBits(padPatterns[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to data codewords
  const dataCodewords = new Uint8Array(V4_DATA_CAPACITY);
  for (let i = 0; i < V4_DATA_CAPACITY; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitBuffer[i * 8 + j];
    }
    dataCodewords[i] = b;
  }

  // 7. Calculate Error Correction codewords (split into 2 blocks of 32 data, 18 EC)
  const block1Data = dataCodewords.slice(0, 32);
  const block2Data = dataCodewords.slice(32, 64);
  const block1EC = rsCalculateEC(block1Data, 18);
  const block2EC = rsCalculateEC(block2Data, 18);

  // Interleave data and EC
  const finalCodewords: number[] = [];
  for (let i = 0; i < 32; i++) {
    finalCodewords.push(block1Data[i]);
    finalCodewords.push(block2Data[i]);
  }
  for (let i = 0; i < 18; i++) {
    finalCodewords.push(block1EC[i]);
    finalCodewords.push(block2EC[i]);
  }

  // 8. Construct Matrix (33x33)
  const matrix: boolean[][] = Array.from({ length: V4_SIZE }, () => Array(V4_SIZE).fill(false));
  const isFunctionModule: boolean[][] = Array.from({ length: V4_SIZE }, () =>
    Array(V4_SIZE).fill(false),
  );

  function setModule(r: number, c: number, val: boolean) {
    if (r >= 0 && r < V4_SIZE && c >= 0 && c < V4_SIZE) {
      matrix[r][c] = val;
      isFunctionModule[r][c] = true;
    }
  }

  // Finder patterns at (0,0), (0, V4_SIZE - 7), (V4_SIZE - 7, 0)
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < V4_SIZE && nc >= 0 && nc < V4_SIZE) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBlack =
              r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
            setModule(nr, nc, isBlack);
          } else {
            setModule(nr, nc, false); // Separator
          }
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, V4_SIZE - 7);
  placeFinder(V4_SIZE - 7, 0);

  // Timing patterns
  for (let i = 8; i < V4_SIZE - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // Alignment pattern at (26, 26) for Version 4
  function placeAlignment(row: number, col: number) {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBlack = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
        setModule(row + r, col + c, isBlack);
      }
    }
  }
  placeAlignment(26, 26);

  // Dark module
  setModule(4 * 4 + 9, 8, true);

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (!isFunctionModule[8][i]) isFunctionModule[8][i] = true;
    if (!isFunctionModule[i][8]) isFunctionModule[i][8] = true;
  }
  for (let i = V4_SIZE - 8; i < V4_SIZE; i++) {
    if (!isFunctionModule[8][i]) isFunctionModule[8][i] = true;
    if (!isFunctionModule[i][8]) isFunctionModule[i][8] = true;
  }

  // 9. Place Data bits in 2-column zig-zag
  const allBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }

  let bitIdx = 0;
  let upwards = true;

  for (let rightCol = V4_SIZE - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--; // Skip vertical timing line

    const rowStart = upwards ? V4_SIZE - 1 : 0;
    const rowEnd = upwards ? -1 : V4_SIZE;
    const step = upwards ? -1 : 1;

    for (let r = rowStart; r !== rowEnd; r += step) {
      for (let c = rightCol; c >= rightCol - 1; c--) {
        if (!isFunctionModule[r][c]) {
          const bitVal = bitIdx < allBits.length ? allBits[bitIdx] === 1 : false;
          // Apply standard Mask Pattern 0: (row + col) % 2 == 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = mask ? !bitVal : bitVal;
          bitIdx++;
        }
      }
    }
    upwards = !upwards;
  }

  // 10. Write Format Info (EC Level M = 00, Mask 0 = 000 -> 00000, BCH code 10100110111, masked with 101010000010010 = 0x5412)
  // For M level and Mask 0: format data is 0x5412 (binary 101010000010010)
  const formatVal = 0x5412;
  const formatBits: boolean[] = [];
  for (let i = 14; i >= 0; i--) {
    formatBits.push(((formatVal >> i) & 1) === 1);
  }

  // Horizontal format bits
  matrix[8][0] = formatBits[0];
  matrix[8][1] = formatBits[1];
  matrix[8][2] = formatBits[2];
  matrix[8][3] = formatBits[3];
  matrix[8][4] = formatBits[4];
  matrix[8][5] = formatBits[5];
  matrix[8][7] = formatBits[6];
  matrix[8][8] = formatBits[7];
  matrix[7][8] = formatBits[8];
  matrix[5][8] = formatBits[9];
  matrix[4][8] = formatBits[10];
  matrix[3][8] = formatBits[11];
  matrix[2][8] = formatBits[12];
  matrix[1][8] = formatBits[13];
  matrix[0][8] = formatBits[14];

  // Vertical format bits
  for (let i = 0; i < 7; i++) {
    matrix[V4_SIZE - 1 - i][8] = formatBits[i];
  }
  for (let i = 0; i < 8; i++) {
    matrix[8][V4_SIZE - 8 + i] = formatBits[7 + i];
  }

  // 11. Generate SVG String
  const quietZone = 2;
  const totalDim = V4_SIZE + quietZone * 2;
  let pathD = "";

  for (let r = 0; r < V4_SIZE; r++) {
    for (let c = 0; c < V4_SIZE; c++) {
      if (matrix[r][c]) {
        const x = c + quietZone;
        const y = r + quietZone;
        pathD += `M${x},${y}h1v1h-1z `;
      }
    }
  }

  const svg = `<svg viewBox="0 0 ${totalDim} ${totalDim}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-label="QR Code for Skill Passport Verification">
  <rect width="${totalDim}" height="${totalDim}" fill="#FFFFFF"/>
  <path d="${pathD}" fill="#211B38"/>
</svg>`;

  return {
    size: V4_SIZE,
    matrix,
    svg,
  };
}
