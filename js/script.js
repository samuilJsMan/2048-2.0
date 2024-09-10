"use strict";

const gridCords = [10, 120, 230, 340],
  scoreElement = document.querySelector(`.now_score`),
  settingsScreen = document.querySelector(`.settings_screen`),
  endScreen = document.querySelector(`.endScreen`),
  colorChange = document.querySelectorAll(`.BG`),
  colorBG = document.querySelectorAll(`.bg`),
  colorBlock = document.querySelectorAll(`.CB`);

let blockNumber = 1,
  chosenOne,
  score = 0,
  startX,
  startY,
  currentX,
  currentY,
  gridMemory = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

if (!localStorage.records) {
  localStorage.setItem(`records`, 0);
}
if (!localStorage.blockColor) {
  localStorage.setItem(
    `blockColor`,
    JSON.stringify([
      [242, 214, 172],
      [247, 107, 28],
    ])
  );
}
if (!localStorage.background) {
  localStorage.setItem(`background`, 0);
}

colorBG[localStorage.background].style.opacity = `1`;
colorChange[localStorage.background].classList.add(`chosen`);
chosenOne = JSON.parse(localStorage.blockColor);
colorBlock.forEach((i) => {
  if (i.dataset.rgb == chosenOne) i.classList.add(`chosen`);
});

createNewBlock();

document.querySelector(`.best_score`).innerHTML = localStorage.records;
document.addEventListener("DOMContentLoaded", () => {
  if (window.mobileAndTabletCheck()) {
    document.querySelector(
      `.game`
    ).style.cssText = `transform: translate(-50%,-60%) scale(2);`;
    document.querySelector(
      `.settings_button`
    ).style.cssText = `width:100px; height:100px;`;
    document.querySelector(
      `.settings_screen_menue`
    ).style.cssText = `transform: translate(-50%,-70%) scale(2);`;
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
  } else {
    document.querySelector(`.delete_score`).style.cssText = `transition: 0.3s;`;
    document.querySelector(
      `.settings_button`
    ).style.cssText = `transition: 0.5s;`;
    document.querySelector(`.button`).style.cssText = `transition:0.3s;`;
  }
  document.addEventListener(`keydown`, move);
  for (let i of colorBG) i.style.transition = `1s`;
});

document
  .querySelector(`.reset`)
  .addEventListener(`click`, () => location.reload());
document.addEventListener("contextmenu", (event) => event.preventDefault());
document
  .querySelector(`.settings_button`)
  .addEventListener(`click`, settingsFunc);

colorChange.forEach((elem, pos) => {
  elem.addEventListener(`click`, change.bind(null, pos));
});

function change(x) {
  for (let i of colorBG) {
    i.style.cssText = `
		opacity: 0;
		z-index: 0;
		transition: opacity 1s;
		`;
  }
  colorBG[x].style.cssText = `
		opacity: 1;
		z-index: -1;
		transition: opacity 0s;
		`;
  for (let i of colorChange) {
    i.classList.remove(`chosen`);
  }
  colorChange[x].classList.add(`chosen`);
  localStorage.background = x;
}

colorBlock.forEach((elem, pos) => {
  elem.addEventListener(`click`, blockChange.bind(null, pos));
});

function blockChange(x) {
  for (let i of colorBlock) {
    i.classList.remove(`chosen`);
  }
  colorBlock[x].classList.add(`chosen`);
  localStorage.block = x;
  chosenOne = JSON.parse(event.srcElement.dataset.rgb);
  for (let row of gridMemory) {
    for (let pos of row) {
      if (pos > 0) {
        const blockElem = document.querySelector(`.block${pos}`);
        blockElem.style.background = `${rgb(blockElem.dataset.value)}`;
      }
    }
  }
}

document.querySelector(`.delete_score`).addEventListener(`click`, forDelete);
document
  .querySelector(`.more`)
  .addEventListener(`click`, () =>
    window.open("https://github.com/samuilJsMan", "_blank")
  );
document
  .querySelector(`.settings_screen_menue`)
  .addEventListener(`click`, () => event.stopPropagation());

function settingsFunc() {
  settingsScreen.style.display = `block`;
  setTimeout(() => {
    settingsScreen.style.transition = `0.3s`;
    settingsScreen.style.opacity = `1`;
  }, 10);
  document.removeEventListener(`keydown`, move);
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchmove", handleTouchMove);
  settingsScreen.addEventListener(`click`, closeSettingsScreen);
}

function closeSettingsScreen() {
  settingsScreen.style.transition = `0.3s`;
  settingsScreen.style.opacity = `0`;
  setTimeout(() => {
    settingsScreen.style.display = `none`;
  }, 300);
  document.addEventListener(`keydown`, move);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  settingsScreen.removeEventListener(`click`, closeSettingsScreen);
}

function forDelete() {
  if (localStorage.records) {
    localStorage.setItem(`records`, 0);
  }
  document.querySelector(`.best_score`).innerHTML = `0`;
}

function createNewBlock() {
  const randomCords = [
    Math.floor(Math.random() * 4),
    Math.floor(Math.random() * 4),
  ];
  if (gridMemory[randomCords[0]][randomCords[1]] == 0) {
    const twoOrFour = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4][
      Math.floor(Math.random() * 10)
    ];
    setTimeout(() => {
      document
        .querySelector(`.gamespace`)
        .insertAdjacentHTML(
          `beforeend`,
          `<div data-value="${twoOrFour}" class="block block${blockNumber}">${twoOrFour}</div>`
        );
      document.querySelector(`.block${blockNumber}`).style.cssText = `
				transform: translateX(${gridCords[randomCords[1]]}px) 
					translateY(${gridCords[randomCords[0]]}px); background:${rgb(twoOrFour)};`;
      setTimeout(() => {
        document
          .querySelector(`.block${blockNumber}`)
          .classList.add(`opacity1`);
        blockNumber++;
      }, 20);
      gridMemory[randomCords[0]][randomCords[1]] = blockNumber;
    }, 300);
  } else {
    createNewBlock();
  }
}

function rgb(blockValue) {
  const coef = (Math.log2(+blockValue) - 1) / 10;
  return `rgb(${Math.round(
    chosenOne[0][0] + (chosenOne[1][0] - chosenOne[0][0]) * coef
  )},
		${Math.round(chosenOne[0][1] + (chosenOne[1][1] - chosenOne[0][1]) * coef)},
		${Math.round(chosenOne[0][2] + (chosenOne[1][2] - chosenOne[0][2]) * coef)})`;
}

function move(swipe) {
  document.removeEventListener(`keydown`, move);
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchmove", handleTouchMove);
  let moving = false;
  if (event.code == `ArrowUp` || event.code == `KeyW` || swipe == `Up`) {
    for (let repeat = 0; repeat < 5; repeat++) {
      for (
        let numberOfRow = 1;
        numberOfRow < gridMemory.length;
        numberOfRow++
      ) {
        if (repeat >= 0 && repeat <= 2 && repeat + numberOfRow > 3) {
          continue;
        }
        const row = gridMemory[numberOfRow];
        for (let position of row) {
          if (position != 0 && numberOfRow > 0) {
            const positionInRow = gridMemory[numberOfRow].indexOf(position);
            const first = document.querySelector(`.block${position}`);
            const second = document.querySelector(
              `.block${gridMemory[numberOfRow - 1][positionInRow]}`
            );
            if (
              gridMemory[numberOfRow - 1][positionInRow] == 0 &&
              repeat != 3
            ) {
              justmove(
                first,
                gridCords[positionInRow],
                gridCords[numberOfRow - 1]
              );
              gridMemory[numberOfRow - 1][positionInRow] = position;
              gridMemory[numberOfRow][positionInRow] = 0;
            } else if (
              gridMemory[numberOfRow - 1][positionInRow] != 0 &&
              first.dataset.value == second.dataset.value &&
              repeat == 3
            ) {
              mergeNmove(
                first,
                second,
                numberOfRow,
                positionInRow,
                gridCords[positionInRow],
                gridCords[numberOfRow - 1]
              );
            }
          }
        }
      }
    }
  }
  if (event.code == `ArrowDown` || event.code == `KeyS` || swipe == `Down`) {
    for (let repeat = 0; repeat < 5; repeat++) {
      for (
        let numberOfRow = gridMemory.length - 2;
        numberOfRow >= 0;
        numberOfRow--
      ) {
        if (repeat >= 0 && repeat <= 2 && numberOfRow < repeat) {
          continue;
        }
        const row = gridMemory[numberOfRow];
        for (let position of row) {
          if (position != 0&&numberOfRow < 3) {
            const positionInRow = gridMemory[numberOfRow].indexOf(position);
            const first = document.querySelector(`.block${position}`);
            const second = document.querySelector(
              `.block${gridMemory[numberOfRow + 1][positionInRow]}`
            );
            if (
              gridMemory[numberOfRow + 1][positionInRow] == 0 &&
              repeat != 3
            ) {
              justmove(
                first,
                gridCords[positionInRow],
                gridCords[numberOfRow + 1]
              );
              gridMemory[numberOfRow + 1][positionInRow] = position;
              gridMemory[numberOfRow][positionInRow] = 0;
            } else if (
              gridMemory[numberOfRow + 1][positionInRow] != 0 &&
              first.dataset.value == second.dataset.value &&
              repeat == 3
            ) {
              mergeNmove(
                first,
                second,
                numberOfRow,
                positionInRow,
                gridCords[positionInRow],
                gridCords[numberOfRow + 1]
              );
            }
          }
        }
      }
    }
  }
  if (event.code == `ArrowLeft` || event.code == `KeyA` || swipe == `Left`) {
    for (let repeat = 0; repeat < 5; repeat++) {
      for (let column = 1; column < 4; column++) {
        if (repeat >= 0 && repeat <= 2 && column + repeat > 3) {
          continue;
        }
        for (let row = 0; row < 4; row++) {
          if (gridMemory[row][column] != 0) {
            const first = document.querySelector(
              `.block${gridMemory[row][column]}`
            );
            const second = document.querySelector(
              `.block${gridMemory[row][column - 1]}`
            );
            if (gridMemory[row][column - 1] == 0 && repeat != 3) {
              justmove(first, gridCords[column - 1], gridCords[row]);
              gridMemory[row][column - 1] = gridMemory[row][column];
              gridMemory[row][column] = 0;
            } else if (
              gridMemory[row][column - 1] != 0 &&
              first.dataset.value == second.dataset.value &&
              repeat == 3
            ) {
              mergeNmove(
                first,
                second,
                row,
                column,
                gridCords[column - 1],
                gridCords[row]
              );
            }
          }
        }
      }
    }
  }
  if (event.code == `ArrowRight` || event.code == `KeyD` || swipe == `Right`) {
    for (let repeat = 0; repeat < 5; repeat++) {
      for (let column = 2; column >= 0; column--) {
        if (repeat >= 0 && repeat <= 2 && column - repeat < 0) {
          continue;
        }
        for (let row = 0; row < 4; row++) {
          if (gridMemory[row][column] != 0) {
            const first = document.querySelector(
              `.block${gridMemory[row][column]}`
            );
            const second = document.querySelector(
              `.block${gridMemory[row][column + 1]}`
            );
            if (gridMemory[row][column + 1] == 0 && repeat != 3) {
              justmove(first, gridCords[column + 1], gridCords[row]);
              gridMemory[row][column + 1] = gridMemory[row][column];
              gridMemory[row][column] = 0;
            } else if (
              gridMemory[row][column + 1] != 0 &&
              first.dataset.value == second.dataset.value &&
              repeat == 3
            ) {
              mergeNmove(
                first,
                second,
                row,
                column,
                gridCords[column + 1],
                gridCords[row]
              );
            }
          }
        }
      }
    }
  }
  if (moving) {
    createNewBlock();
  } else {
    let FreeSpaces = false;
    loop: for (let row of gridMemory) {
      for (let position of row) {
        if (position == 0) {
          FreeSpaces = true;
          break loop;
        }
      }
    }
    if (!FreeSpaces) {
      loop: for (let row of gridMemory) {
        let rowN = gridMemory.indexOf(row);
        for (let pos of row) {
          let posN = row.indexOf(pos);
          if (
            rowN > 0 &&
            document.querySelector(`.block${pos}`).dataset.value ==
              document.querySelector(`.block${gridMemory[rowN - 1][posN]}`)
                .dataset.value
          )
            break loop;
          if (
            rowN < 3 &&
            document.querySelector(`.block${pos}`).dataset.value ==
              document.querySelector(`.block${gridMemory[rowN + 1][posN]}`)
                .dataset.value
          )
            break loop;
          if (
            posN > 0 &&
            document.querySelector(`.block${pos}`).dataset.value ==
              document.querySelector(`.block${gridMemory[rowN][posN - 1]}`)
                .dataset.value
          )
            break loop;
          if (
            posN < 3 &&
            document.querySelector(`.block${pos}`).dataset.value ==
              document.querySelector(`.block${gridMemory[rowN][posN + 1]}`)
                .dataset.value
          )
            break loop;
          if (gridMemory.indexOf(row) == 3 && row.indexOf(pos) == 3) {
            endOfTheGame(false);
            return;
          }
        }
      }
    }
  }

  setTimeout(() => {
    document.addEventListener(`keydown`, move);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
  }, 310);

  function mergeNmove(
    first,
    second,
    numberOfRow,
    positionInRow,
    translateX,
    translateY
  ) {
    moving = true;
    second.innerHTML = `${(second.dataset.value *= 2)}`;
    gridMemory[numberOfRow][positionInRow] = 0;
    scoreElement.innerHTML = `${(score += first.dataset.value * 2)}`;
    first.classList.remove(`opacity1`);
    [first, second].forEach((each) => {
      each.style.cssText = `transform:translateX(${translateX}px) 
								translateY(${translateY}px); 
								z-index:0; 
								background:${rgb(second.dataset.value)};`;
    });
    setTimeout(() => first.remove(), 300);
    if (second.dataset.value == 2048) {
      endOfTheGame(true);
    }
  }

  function justmove(first, translateX, translateY) {
    moving = true;
    first.style.cssText = `transform: translateX(${translateX}px) 
										translateY(${translateY}px); 
										background:${rgb(first.dataset.value)};`;
  }
}

function endOfTheGame(result) {
  if (result) {
    document.querySelector(`.text`).innerHTML = `Win`;
  } else {
    document.querySelector(`.text`).innerHTML = `Game Over`;
  }
  if (localStorage.records < score) {
    localStorage.setItem(`records`, score);
  }
  endScreen.style.display = `block`;
  setTimeout(() => {
    endScreen.style.transition = `0.5s`;
    endScreen.style.opacity = `1`;
  }, 10);
  setTimeout(() => {
    endScreen.style.opacity = `0`;
  }, 2000);
  document.querySelector(`.score`).innerHTML = `Score: ${score}`;
}

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  currentX = event.touches[0].clientX;
  currentY = event.touches[0].clientY;

  const deltaX = currentX - startX,
    deltaY = currentY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      move(`Right`);
    } else {
      move(`Left`);
    }
  } else {
    if (deltaY > 0) {
      move(`Down`);
    } else {
      move(`Up`);
    }
    if (deltaY > 20) {
      event.preventDefault();
    }
  }
}

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
