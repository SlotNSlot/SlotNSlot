const shuffle = require('lodash.shuffle');

const ENTIRE_REEL_COUNT = 5;
const ITEM_PER_ENTIRE_REEL = 12;
const ITEMS_PER_HALF_REEL = ITEM_PER_ENTIRE_REEL / 2;
const ALL_SYMBOL_COUNT = 9;

const PAY_TABLE = [
  [5, 10, 25], // A 0
  [5, 25, 50], // B 1
  [25, 50, 75], // C 2
  [50, 75, 100], // D 3
  [75, 125, 150], // E 4
  [100, 150, 250], // G 5
  [125, 250, 1000], // F 6
  [250, 500, 2000], // H 7
];

const PROBABILITY_TABLE = [
  9.000001082 * 10 ** -1, // not win
  6.9864 * 10 ** -2, // 5
  2.1954 * 10 ** -2, // 10
  4.7523 * 10 ** -3, // 25
  1.4933 * 10 ** -3, // 50
  7.5869 * 10 ** -4, // 75
  4.6925 * 10 ** -4, // 100
  3.2326 * 10 ** -4, // 125
  2.3841 * 10 ** -4, // 150
  1.0158 * 10 ** -4, // 250
  3.192 * 10 ** -5, // 500
  1.003 * 10 ** -5, // 1000
  3.1518 * 10 ** -6, // 2000
];
const PROBABILITY_VALUE_TABLE = [0, 5, 10, 25, 50, 75, 100, 125, 150, 250, 500, 1000, 2000];
const LINE_CASES = [
  [{ symbol: '7', length: 5 }], // 2000
  [{ symbol: '6', length: 5 }], // 1000
  [{ symbol: '7', length: 4 }], // 500
  [{ symbol: '7', length: 3 }, { symbol: '6', length: 4 }, { symbol: '5', length: 5 }], // 250
  [{ symbol: '5', length: 4 }, { symbol: '4', length: 5 }], // 150
  [{ symbol: '6', length: 3 }, { symbol: '4', length: 4 }], // 125
  [{ symbol: '5', length: 3 }, { symbol: '3', length: 5 }], // 100
  [{ symbol: '4', length: 3 }, { symbol: '3', length: 4 }, { symbol: '2', length: 5 }], // 75
  [{ symbol: '3', length: 3 }, { symbol: '2', length: 4 }, { symbol: '1', length: 5 }], // 50
  [{ symbol: '2', length: 3 }, { symbol: '1', length: 4 }, { symbol: '0', length: 5 }], // 25
  [{ symbol: '0', length: 4 }], // 10
  [{ symbol: '1', length: 3 }, { symbol: '0', length: 3 }], // 5
];

// Function of getting Combinations in Array for calculateSlot
// source : https://gist.github.com/axelpale/3118596
function kComb(set, k) {
  var i, j, combs, head, tailcombs;
  if (k > set.length || k <= 0) {
    return [];
  }
  if (k === set.length) {
    return [set];
  }
  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i += 1) {
      combs.push([set[i]]);
    }
    return combs;
  }
  combs = [];
  for (i = 0; i < set.length - k + 1; i += 1) {
    head = set.slice(i, i + 1);
    tailcombs = kComb(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j += 1) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

const WIN_LINE = [
  [1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1],
  [2, 2, 2, 2, 2, 2],
  [2, 1, 0, 1, 2, 3],
  [0, 1, 2, 1, 2, 4],
  [0, 0, 1, 2, 2, 5],
  [2, 2, 1, 0, 0, 6],
  [1, 0, 0, 0, 1, 7],
  [1, 2, 2, 2, 1, 8],
  [0, 1, 0, 1, 0, 9],
  [2, 1, 2, 1, 2, 10],
  [1, 2, 1, 2, 1, 11],
  [1, 0, 1, 0, 1, 12],
  [1, 1, 0, 1, 1, 13],
  [1, 1, 2, 1, 1, 14],
  [0, 1, 1, 1, 0, 15],
  [2, 1, 1, 1, 2, 16],
  [0, 2, 0, 2, 0, 17],
  [2, 0, 2, 0, 2, 18],
  [2, 0, 1, 0, 2, 19],
];

class SlotGameTest {
  constructor() {
    // Function List
    this.changeSlot = this.changeSlot.bind(this);
    this.calculateSlot = this.calculateSlot.bind(this);
    this.makeRandomPrize = this.makeRandomPrize.bind(this);
    this.drawingLines = [];
    this.lineNum = 20;
    this.slotLineInfo = [];
    this.testLineNum = false;
  }
  testProbability() {
    console.log('=====Test of Probability START=====');
    const startTime = new Date();
    const proExpArr = new Array(PROBABILITY_TABLE.length).fill(0);
    for (let i = 0; i < 10 ** 6; i += 1) {
      let nowProbability = 0;
      const randomCase = Math.random();
      for (let j = 0; j <= PROBABILITY_TABLE.length; j += 1) {
        nowProbability += PROBABILITY_TABLE[j];
        if (randomCase <= nowProbability) {
          proExpArr[j] += 1;
          break;
        }
      }
    }
    console.log('proExpArr is ', proExpArr);
    const endTime = new Date();
    const secGap = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Running time is ${secGap} second.`);
  }
  testLineNum() {
    console.log('=====Test of Line Num START=====');
    this.testLineNum = true;
    const startTime = new Date();
    let testNum = 0;
    for (let i = 0; i < 10 ** 7; i += 1) {
      const slotResult = this.makeRandomPrize(this.lineNum);
      const lineNum = this.calculateSlot(slotResult);
      if (lineNum >= 4) testNum += 1;
    }
    console.log('lineNum >= 4 case is ', testNum);
    const endTime = new Date();
    const secGap = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Running time is ${secGap} second.`);
  }
  testValidity() {
    console.log('=====Test of Line Validity=====');
    const startTime = new Date();
    const testNum = 10 ** 6;
    console.log('testNum is ', testNum);
    let notValidatedNum = 0;
    let bigWinNum = 0;
    const bigWinCases = {};
    const notValidatedCases = {};
    const jsTest = {};
    let jsTestNum = 0;
    for (let i = 0; i < testNum; i += 1) {
      const slotResult = this.makeRandomPrize(this.lineNum);
      const drawResult = this.calculateSlot(slotResult);
      switch (drawResult) {
        case '':
          break;
        case 'BIG_WIN':
          if (bigWinCases[slotResult] === undefined) {
            bigWinCases[slotResult] = 1;
          } else {
            bigWinCases[slotResult] += 1;
          }
          bigWinNum += 1;
          break;
        default:
          this.changeSlot();
          if (!this.checkValidity(this.slotLineInfo)) {
            console.log('drawingLines is ', this.drawingLines);
            if (notValidatedCases[slotResult] === undefined) {
              notValidatedCases[slotResult] = 1;
            } else {
              notValidatedCases[slotResult] += 1;
            }
            notValidatedNum += 1;
          } else {
            let slotLineValue = '';
            for (let j = 0; j < this.slotLineInfo.length; j += 1) {
              for (let k = 0; k < 3; k += 1) {
                slotLineValue += this.slotLineInfo[j][k][0];
              }
            }
            if (jsTest[slotLineValue] === undefined) {
              jsTest[slotLineValue] = 1;
              jsTestNum += 1;
            } else {
              jsTest[slotLineValue] += 1;
            }
          }
          break;
      }
      this.drawingLines = [];
    }
    console.log('Not validated case is ', notValidatedNum);
    console.log('Not validated cases is ', notValidatedCases);
    console.log('Big Win case is ', bigWinNum);
    console.log('Big Win cases is ', bigWinCases);
    console.log('jsTestNum is ', jsTestNum);
    const endTime = new Date();
    const secGap = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Running time is ${secGap} second.`);
  }
  checkValidity(slotLineInfo) {
    let calculatedMoney = 0;
    const calculatedLines = [];
    for (let i = 0; i < this.lineNum; i += 1) {
      const nowLine = WIN_LINE[i];
      const slotQueue = [];
      for (let j = 0; j < ENTIRE_REEL_COUNT; j += 1) {
        const slotY = nowLine[j];
        slotQueue.push(slotLineInfo[j][slotY]);
      }
      const symbol = slotQueue.shift()[0];
      let length = 1;
      while (slotQueue.length !== 0) {
        const queueSymbol = slotQueue.shift()[0];
        if (symbol === queueSymbol) {
          length += 1;
        } else {
          break;
        }
      }
      let found = false;
      if (length >= 3) {
        for (let j = 0; j < LINE_CASES.length; j += 1) {
          for (let k = 0; k < LINE_CASES[j].length; k += 1) {
            const lineCase = LINE_CASES[j][k];
            if (lineCase.symbol === symbol && lineCase.length === length) {
              const lineCaseObj = {
                lineNum: i,
                symbol: lineCase.symbol,
                length: lineCase.length,
              };
              calculatedLines.push(lineCaseObj);
              const price = PROBABILITY_VALUE_TABLE[PROBABILITY_VALUE_TABLE.length - 1 - j];
              calculatedMoney += price;
              if (calculatedMoney > this.winMoney) return false;
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
    }
    if (calculatedMoney === this.winMoney) return true;
    console.log(`ERROR, winMoney : ${this.winMoney}, calculatedMoney: ${calculatedMoney}`);
    for (let i = 0; i < 3; i += 1) {
      console.log(
        `${slotLineInfo[0][i]} ${slotLineInfo[1][i]} ${slotLineInfo[2][i]} ${slotLineInfo[3][i]} ${slotLineInfo[4][i]}`,
      );
    }
    console.log('calculatedLines is ', calculatedLines);
    return false;
  }
  makeRandomPrize(lineNum) {
    let prize = 0;
    for (let i = 0; i < lineNum; i += 1) {
      let nowProbability = 0;
      const randomCase = Math.random();
      for (let j = 0; j <= PROBABILITY_TABLE.length; j += 1) {
        nowProbability += PROBABILITY_TABLE[j];
        if (randomCase < nowProbability) {
          prize += PROBABILITY_VALUE_TABLE[j];
          break;
        }
      }
    }
    return prize;
  }
  getPayLineInfos(sumPrize) {
    const lineCaseArr = [];
    const duplicatedObj = {};
    const payLineInfos = [];
    for (let i = 0; i < PROBABILITY_VALUE_TABLE.length - 1; i += 1) {
      // Prize has to be selected by reverse order.
      const prize = PROBABILITY_VALUE_TABLE[PROBABILITY_VALUE_TABLE.length - 1 - i];
      if (sumPrize >= prize) {
        const prizeNum = Math.floor(sumPrize / prize);
        for (let j = 0; j < prizeNum; j += 1) {
          lineCaseArr.push(i);
        }
        sumPrize -= prizeNum * prize;
      }
    }
    for (let i = 0; i < lineCaseArr.length; i += 1) {
      const lineCaseIndex = lineCaseArr[i];
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        const lineCaseSymbol = LINE_CASES[lineCaseIndex][j].symbol;
        const lineCaseLength = LINE_CASES[lineCaseIndex][j].length;
        if (duplicatedObj[lineCaseSymbol] === undefined) {
          duplicatedObj[lineCaseSymbol] = {
            count: 1,
            length: lineCaseLength,
          };
        } else {
          duplicatedObj[lineCaseSymbol].count += 1;
          duplicatedObj[lineCaseSymbol].length += lineCaseLength;
        }
      }
    }
    for (let i = 0; i < lineCaseArr.length; i += 1) {
      const lineCaseIndex = lineCaseArr[i];
      let minDuplicate = 100;
      let minLength = 100;
      let resultSymbol;
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        const lineCase = LINE_CASES[lineCaseIndex][j];
        const lineCaseSymbol = lineCase.symbol;
        if (minDuplicate > duplicatedObj[lineCaseSymbol].count) {
          minDuplicate = duplicatedObj[lineCaseSymbol].count;
          minLength = duplicatedObj[lineCaseSymbol].length;
          resultSymbol = lineCaseSymbol;
        } else if (minDuplicate === duplicatedObj[lineCaseSymbol].count) {
          if (minLength > duplicatedObj[lineCaseSymbol].length) {
            minLength = duplicatedObj[lineCaseSymbol].length;
            resultSymbol = lineCaseSymbol;
          }
        }
      }
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        if (resultSymbol === LINE_CASES[lineCaseIndex][j].symbol) {
          payLineInfos.push(LINE_CASES[lineCaseIndex][j]);
          break;
        }
      }
    }
    return payLineInfos;
  }
  calculateSlot(sumPrize) {
    const lineNum = this.lineNum;
    this.winMoney = sumPrize;
    if (sumPrize === 0) {
      // Earn nothing.
      return 0;
    }
    const lineInfos = this.getPayLineInfos(sumPrize); // Minimum drawing line's info.
    const needLineNum = lineInfos.length;
    if (this.testLineNum) return needLineNum;
    if (lineNum < needLineNum) return 'BIG_WIN';
    if (needLineNum === 1) {
      const randNum = Math.floor(Math.random() * lineNum);
      const drawingLine = {
        lineNum: randNum,
        symbol: lineInfos[0].symbol,
        length: lineInfos[0].length,
      };
      this.drawingLines.push(drawingLine);
      return 'DRAW_LINE';
    }
    // Save Slot Infos for avoiding inconsistency.
    const slotLineInfo = new Array(ENTIRE_REEL_COUNT);
    for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
      slotLineInfo[i] = new Array(3).fill(undefined);
    }
    let usableLines = WIN_LINE.slice(0, lineNum);
    usableLines = shuffle(usableLines);
    // First, we have to find Lines that use same symbols.
    const sameSymbolObj = {};
    const symbolObj = {};
    const singleSymbolArr = [];
    for (let i = 0; i < lineInfos.length; i += 1) {
      const symbol = lineInfos[i].symbol;
      if (symbolObj[symbol] === undefined) {
        symbolObj[symbol] = [lineInfos[i]];
      } else {
        symbolObj[symbol].push(lineInfos[i]);
      }
    }
    for (const key in symbolObj) {
      if (symbolObj[key].length >= 2) {
        sameSymbolObj[key] = symbolObj[key];
      } else {
        singleSymbolArr.push(symbolObj[key][0]);
      }
    }
    // If there are no duplicated symbols,
    if (Object.keys(sameSymbolObj).length === 0) {
      let drawingLine;
      let possibleIndex; // undefined
      const duplicatedCheckArr = [];
      // LineIndexArr is set for getting random combination from usableLines
      const lineIndexArr = [];
      for (let p = 0; p < usableLines.length; p += 1) {
        lineIndexArr.push(p);
      }
      const combArr = kComb(lineIndexArr, needLineNum);
      for (let i = 0; i < combArr.length; i += 1) {
        let duplicated = false;
        for (let j = 0; j < ENTIRE_REEL_COUNT; j += 1) {
          duplicatedCheckArr[j] = new Array(3).fill(undefined);
        }
        for (let j = 0; j < needLineNum; j += 1) {
          const lineIndex = combArr[i][j];
          for (let k = 0; k < lineInfos[j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            if (duplicatedCheckArr[k][slotY] !== undefined) {
              // It means overLapping
              duplicated = true;
              break;
            }
          }
          if (duplicated) break;
          for (let k = 0; k < lineInfos[j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            duplicatedCheckArr[k][slotY] = lineInfos[j].symbol;
          }
        }
        if (!duplicated) {
          possibleIndex = i;
          break;
        }
      }
      if (possibleIndex === undefined) {
        return 'BIG_WIN';
      } else {
        for (let i = 0; i < needLineNum; i += 1) {
          const lineIndex = combArr[possibleIndex][i];
          drawingLine = {
            lineNum: usableLines[lineIndex][5], // Fifth index is original win lineNum.
            symbol: lineInfos[i].symbol,
            length: lineInfos[i].length,
          };
          this.drawingLines.push(drawingLine);
        }
        return 'DRAW_LINE';
      }
      // else, we have to draw duplicated symbol lines with minimum distance lines.
    } else {
      const distanceCompArr = new Array(ENTIRE_REEL_COUNT);
      let drawingLine;
      // First draw sameSymbol Lines.
      // i means same symbol Array.
      for (let i = 0; i < Object.keys(sameSymbolObj).length; i += 1) {
        const symbol = Object.keys(sameSymbolObj)[i];
        const sameSymbolLinesNum = sameSymbolObj[symbol].length;
        // LineIndexArr is set for getting random combination from usableLines
        const lineIndexArr = [];
        for (let p = 0; p < usableLines.length; p += 1) {
          lineIndexArr.push(p);
        }
        const combArr = kComb(lineIndexArr, sameSymbolLinesNum);
        // Finding combination that has minimum distance.
        // j means symbol Arr combinations
        let minDist = 15;
        let minCombIndex; // undefined
        for (let j = 0; j < combArr.length; j += 1) {
          let overLapping = false;
          // distanceCompArr Initialization
          for (let q = 0; q < ENTIRE_REEL_COUNT; q += 1) {
            distanceCompArr[q] = new Array(3).fill(undefined);
          }
          let distance = 0;
          // Doing calculate Distance
          // k means combination's element
          for (let k = 0; k < combArr[j].length; k += 1) {
            const lineIndex = combArr[j][k];
            for (let l = 0; l < sameSymbolObj[symbol][k].length; l += 1) {
              const slotY = usableLines[lineIndex][l];
              if (slotLineInfo[l][slotY] !== undefined) {
                // It means overLapping
                overLapping = true;
                break;
              } else if (distanceCompArr[l][slotY] === symbol) {
                distanceCompArr[l][slotY] = symbol;
              } else {
                distanceCompArr[l][slotY] = symbol;
                distance += 1;
              }
            }
            for (let l = sameSymbolObj[symbol][k].length; l < 5; l += 1) {
              const slotY = usableLines[lineIndex][l];
              if (distanceCompArr[l][slotY] === symbol) {
                overLapping = true;
                break;
              }
            }
            if (overLapping) break;
          }
          if (!overLapping && distance < minDist) {
            minDist = distance;
            minCombIndex = j;
          }
        }
        // minCombIndex is still undefined After loop, we can't draw it.
        if (minCombIndex === undefined) return 'BIG_WIN';
        // We have to insert that combination of lines to slotLineInfo.
        for (let j = 0; j < combArr[minCombIndex].length; j += 1) {
          const lineIndex = combArr[minCombIndex][j];
          for (let k = 0; k < sameSymbolObj[symbol][j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            slotLineInfo[k][slotY] = symbol;
          }
          drawingLine = {
            lineNum: usableLines[lineIndex][5], // Fifth index is original win lineNum.
            symbol,
            length: sameSymbolObj[symbol][j].length,
          };
          this.drawingLines.push(drawingLine);
        }
        // We have to delete lines where we find min distance for quality.
        let lastIndex = 0;
        const newUsableLines = [];
        for (let j = 0; j < combArr[minCombIndex].length; j += 1) {
          newUsableLines.push(...usableLines.slice(lastIndex, combArr[minCombIndex][j]));
          lastIndex = combArr[minCombIndex][j] + 1;
        }
        newUsableLines.push(...usableLines.slice(lastIndex, usableLines.length));
        usableLines = newUsableLines;
      }
      // After draw same symbol lines, we have to draw single symbol lines.
      for (let i = 0; i < singleSymbolArr.length; i += 1) {
        let drawable = false;
        for (let j = 0; j < usableLines.length; j += 1) {
          // Check for overLapping Line.
          let overLapping = false;
          for (let k = 0; k < singleSymbolArr[i].length; k += 1) {
            const slotY = usableLines[j][k];
            if (slotLineInfo[k][slotY] !== undefined) {
              overLapping = true;
              break;
            }
          }
          // If not overLapping, 'i' drawingLine is drawn with 'j' usableLines.
          if (!overLapping) {
            for (let k = 0; k < lineInfos[i].length; k += 1) {
              const slotY = usableLines[j][k];
              slotLineInfo[k][slotY] = singleSymbolArr[i].symbol;
            }
            drawingLine = {
              lineNum: usableLines[j][5],
              symbol: singleSymbolArr[i].symbol,
              length: singleSymbolArr[i].length,
            };
            this.drawingLines.push(drawingLine);
            drawable = true;
            break;
          }
        }
        if (!drawable) return 'BIG_WIN';
      }
      return 'DRAW_LINE';
    }
  }

  changeSlot() {
    // Save Slot Infos for avoiding inconsistency.
    this.slotLineInfo = new Array(ENTIRE_REEL_COUNT);
    for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
      this.slotLineInfo[i] = [];
    }
    // If drawingLines exist, have not to draw that symbol.
    let avoidSymbolArr = [];
    for (let i = 0; i < this.drawingLines.length; i += 1) {
      avoidSymbolArr.push(this.drawingLines[i].symbol);
    }
    // Delete duplicated value from avoidSymbolArr.
    avoidSymbolArr = Array.from(new Set(avoidSymbolArr));
    let randomNumString;
    let randomNum;
    for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
      for (let idx = 0; idx < 3; idx += 1) {
        do {
          randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
          randomNumString = randomNum.toString();
        } while (avoidSymbolArr.indexOf(randomNumString) !== -1);
        // Save Slot Infos for avoiding inconsistency.
        // When reelNum is [0, 1, 2, 3, 4] and idx is [1, 2, 3]
        this.slotLineInfo[reelNum].push(randomNumString);
      }
    }
    // We have to consider only visible part.
    // So care about just newReelGroup[0 || 2 || 4 || 8][1 || 2 || 3]
    if (this.drawingLines.length === 0) {
      // In this case, Slot should have none of Win Lines.
      const secondReelInfos = Array.from(new Set(this.slotLineInfo[1]));
      let i = 0;
      while (i < 3) {
        const symbolNum = this.slotLineInfo[2][i];
        if (secondReelInfos.indexOf(symbolNum) === -1) {
          // Pass
          i += 1;
        } else {
          // have to Change
          randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
          this.slotLineInfo[2][i] = randomNum.toString();
        }
      }
    } else {
      // First, change slot following drawingLines.
      for (let i = 0; i < this.drawingLines.length; i += 1) {
        const lineSymbol = this.drawingLines[i].symbol;
        const lineNum = this.drawingLines[i].lineNum;
        const lineLength = this.drawingLines[i].length;
        for (let j = 0; j < lineLength; j += 1) {
          const lineY = WIN_LINE[lineNum][j];
          this.slotLineInfo[j][lineY] = `${lineSymbol}*`; // It means have to be not changed.
        }
      }
      // Second, slot should have none of Win Lines except drawingLines .
      const secondReelInfos = Array.from(new Set(this.slotLineInfo[1]));
      let i = 0;
      while (i < 3) {
        const symbolNum = this.slotLineInfo[2][i];
        if (symbolNum[1] === '*') {
          // Pass
          i += 1;
        } else if (secondReelInfos.indexOf(symbolNum) === -1 && avoidSymbolArr.indexOf(symbolNum) === -1) {
          // Pass
          i += 1;
        } else {
          // have to Change
          randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
          this.slotLineInfo[2][i] = randomNum.toString();
        }
      }
    }
  }
}

const test = new SlotGameTest();
test.testValidity();
