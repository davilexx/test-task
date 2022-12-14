// convert time to user's timezone
// eslint-disable-next-line no-undef
const momentTime = moment().utc().toDate().toString();
const GMT = momentTime.search("GMT");
const slicedGMT = momentTime.slice(GMT + 3, 33);

// slice +/-, hours and minutes
const earlierOrLater = slicedGMT.slice(0, 1);
const userTimezoneHours = Number(slicedGMT.slice(1, 3));
const userTimezoneMinutes = Number(slicedGMT.slice(3));

const timeToBSelect = document.getElementById("time-to-B");
const timeToASelect = document.getElementById("time-to-A");

const getHours = (hours) => {
  let formattedHours = "";
  if (hours === 24) {
    hours = 0;
  } else if (hours > 24) {
    hours = Math.abs(24 - hours);
  } else if (hours < 0) {
    hours = Math.abs(24 + hours);
  }
  if (hours.toString().length === 1) {
    formattedHours = `0${hours}`;
    return formattedHours;
  }
  return hours;
};

const getMinutes = (minutes) => {
  let formattedMinutes = "";
  if (minutes === 60) {
    minutes = 0;
  } else if (minutes > 60) {
    minutes = Math.abs(60 - minutes);
  } else if (minutes < 0) {
    minutes = Math.abs(60 + minutes);
  }
  if (minutes.toString().length === 1) {
    formattedMinutes = `0${minutes}`;
    return formattedMinutes;
  }
  return minutes;
};

const changeTime = (trip) => {
  for (let i = 0; i < trip.length; i++) {
    let optionValue = trip.options[i].value;

    let optionHours = Number(optionValue.slice(0, 2));
    let optionMinutes = Number(optionValue.slice(3));

    if (earlierOrLater === "+") {
      optionHours += userTimezoneHours;
      optionMinutes += userTimezoneMinutes;

      optionHours = getHours(optionHours);
      optionMinutes = getMinutes(optionMinutes);

      trip.options[i].value = `${optionHours}:${optionMinutes}`;
      trip.options[i].text = `${optionHours}:${optionMinutes}`;
    } else {
      optionHours -= userTimezoneHours;
      optionMinutes -= userTimezoneMinutes;

      optionHours = getHours(optionHours);
      optionMinutes = getMinutes(optionMinutes);

      optionValue = `${optionHours}:${optionMinutes}`;
    }
  }
};

changeTime(timeToBSelect);
changeTime(timeToASelect);

// show or hide options
const routeSelector = document.getElementById("route");
const timeToB = document.querySelector(".main__to-B");
const timeToA = document.querySelector(".main__to-A");

const showToB = () => {
  timeToB.style.display = "block";
  timeToA.style.display = "none";
};

const showToA = () => {
  timeToA.style.display = "block";
  timeToB.style.display = "none";
};

const showToBAndToA = () => {
  timeToA.style.display = "block";
  timeToB.style.display = "block";
};

showToB();

// make first select option by default each time user choosing new path
// make all options enabled if they have been disabled
const makeFirstOptionByDefault = () => {
  for (let i = 0; i < timeToBSelect.length; i++) {
    timeToBSelect.options[i].disabled = false;
    timeToBSelect.getElementsByTagName("option")[0].selected = "selected";
  }
  for (let i = 0; i < timeToASelect.length; i++) {
    timeToASelect.options[i].disabled = false;
    timeToASelect.getElementsByTagName("option")[0].selected = "selected";
  }
};

routeSelector.addEventListener("change", () => {
  if (routeSelector.value === "???? A ?? B") {
    showToB();
    makeFirstOptionByDefault();
  } else if (routeSelector.value === "???? B ?? A") {
    showToA();
    makeFirstOptionByDefault();
  } else if (routeSelector.value === "???? A ?? B ?? ?????????????? ?? ??") {
    showToBAndToA();
    makeFirstOptionByDefault();

    // from A to B and to A solution
    const checkTime = () => {
      const valueToB =
        timeToBSelect.getElementsByTagName("option")[
          timeToBSelect.selectedIndex
        ].value;
      const minutesToB = Number(valueToB.slice(3));

      const valueToA =
        timeToASelect.getElementsByTagName("option")[
          timeToBSelect.selectedIndex + 1
        ].value;
      const minutesToA = Number(valueToA.slice(3));

      // check if difference between departure and arrival are not less than 50 minutes
      if (Math.abs(minutesToA - minutesToB) < 50) {
        timeToASelect.options[timeToBSelect.selectedIndex].disabled = true;
        timeToASelect.options[timeToBSelect.selectedIndex + 1].disabled = true;
        timeToASelect.getElementsByTagName("option")[
          timeToBSelect.selectedIndex + 2
        ].selected = "selected";
      }
    };

    checkTime();

    // disable time from B to A if it intersects and change selection
    timeToBSelect.onchange = () => {
      if (timeToBSelect.selectedIndex >= timeToASelect.selectedIndex) {
        for (let i = 0; i <= timeToBSelect.selectedIndex; i++) {
          timeToASelect.options[i].disabled = true;
          timeToASelect.getElementsByTagName("option")[i].selected = "selected";
        }
      }

      if (timeToBSelect.selectedIndex <= timeToASelect.selectedIndex) {
        for (
          let i = timeToBSelect.selectedIndex + 1;
          i < timeToASelect.length;
          i++
        ) {
          timeToASelect.options[i].disabled = false;
        }

        timeToASelect.getElementsByTagName("option")[
          timeToBSelect.selectedIndex + 1
        ].selected = "selected";
      }

      checkTime();
    };
  }
});

// calculate ticket price
const ticketsInput = document.querySelector(".tickets__input");
let ticketsCount = Number(ticketsInput.value);
const ticketBtnMinus = document.querySelector(".tickets__btn_minus");
const ticketBtnPlus = document.querySelector(".tickets__btn_plus");

ticketBtnMinus.disabled = true;

// disable plus button if ticket count is more than 20
// disable minus button if ticket count is 1
const disableBtn = () => {
  if (ticketsInput.value >= 20) {
    ticketBtnPlus.disabled = true;
  } else {
    ticketBtnPlus.disabled = false;
  }

  if (ticketsInput.value > 1) {
    ticketBtnMinus.disabled = false;
  } else {
    ticketBtnMinus.disabled = true;
  }
};

ticketBtnPlus.addEventListener("click", () => {
  ticketsInput.value = ticketsCount + 1;
  ticketsCount += 1;
  disableBtn();
});

ticketBtnMinus.addEventListener("click", () => {
  ticketsInput.value = ticketsCount - 1;
  ticketsCount -= 1;
  disableBtn();
});

// display a message
const countBtn = document.querySelector(".tickets__count-btn");
const message = document.querySelector(".popup");

countBtn.addEventListener("click", () => {
  message.classList.add("active");

  // make correct word ending
  let wordEndings = ``;
  switch (ticketsCount) {
    case 1:
      wordEndings = `${ticketsCount} ??????????`;
      break;
    case 2:
    case 3:
    case 4:
      wordEndings = `${ticketsCount} ????????????`;
      break;
    default:
      wordEndings = `${ticketsCount} ??????????????`;
  }

  // split hours and minutes in two variables by slicing them from selected values
  const departureTimeFromA =
    timeToBSelect.getElementsByTagName("option")[timeToBSelect.selectedIndex]
      .value;
  let departureTimeFromAHours = Number(departureTimeFromA.slice(0, 2));
  let departureTimeFromAMinutes = Number(departureTimeFromA.slice(3));

  const departureTimeFromB =
    timeToASelect.getElementsByTagName("option")[timeToASelect.selectedIndex]
      .value;
  let departureTimeFromBHours = Number(departureTimeFromB.slice(0, 2));
  let departureTimeFromBMinutes = Number(departureTimeFromB.slice(3));

  // check if difference between two timestamps are not less than 50 minutes
  if (departureTimeFromAMinutes >= 10) {
    departureTimeFromAHours += 1;
    departureTimeFromAMinutes = 50 - (60 - departureTimeFromAMinutes);
  } else {
    departureTimeFromAMinutes += 50;
  }

  if (departureTimeFromBMinutes >= 10) {
    departureTimeFromBHours += 1;
    departureTimeFromBMinutes = 50 - (60 - departureTimeFromBMinutes);
  } else {
    departureTimeFromBMinutes += 50;
  }

  // add 0 before hours and minutes if they are less than 10
  const addZeroToHours = (hours) => {
    if (hours.toString().length === 1) {
      hours = `0${hours}`;
    }
    return hours;
  };

  const addZeroToMinutes = (minutes) => {
    if (minutes.toString().length === 1) {
      minutes = `0${minutes}`;
    }
    return minutes;
  };

  departureTimeFromAHours = addZeroToHours(departureTimeFromAHours);
  departureTimeFromBHours = addZeroToHours(departureTimeFromBHours);

  departureTimeFromAMinutes = addZeroToMinutes(departureTimeFromAMinutes);
  departureTimeFromBMinutes = addZeroToMinutes(departureTimeFromBMinutes);

  departureTimeFromAHours = getHours(departureTimeFromAHours);
  departureTimeFromBHours = getHours(departureTimeFromBHours);

  // final time
  const arrivalTimeToB = `${departureTimeFromAHours}:${departureTimeFromAMinutes}`;
  const arrivalTimeToA = `${departureTimeFromBHours}:${departureTimeFromBMinutes}`;

  // change the text based on selected options
  let tripTime = "";
  let arrival = "";
  if (routeSelector.value === "???? A ?? B ?? ?????????????? ?? ??") {
    tripTime = "?? ?????? ?????????????? ???? 50 ??????????";
    arrival = `
      ???????????????? ???????????????????????? ???? A ?? ${departureTimeFromA}, ?? ???????????????? ?? B ?? ${arrivalTimeToB}.
      <br><br>
      ?????????? ???????????????? ???????????????????????? ???? B ?? ${departureTimeFromB}, ?? ???????????????? ?? A ?? ${arrivalTimeToA}.
    `;
  } else if (routeSelector.value === "???? B ?? A") {
    tripTime = "50 ??????????";
    arrival = `???????????????? ???????????????????????? ?? ${departureTimeFromB}, ?? ???????????????? ?? ${arrivalTimeToA}.`;
  } else {
    tripTime = "50 ??????????";
    arrival = `???????????????? ???????????????????????? ?? ${departureTimeFromA}, ?? ???????????????? ?? ${arrivalTimeToB}.`;
  }

  // display the message
  message.innerHTML = `
    ???? ?????????????? ${wordEndings} ???? ???????????????? ${routeSelector.value} ???????????????????? ${
    1000 * Number(ticketsInput.value)
  }??.<br><br>
    ?????? ?????????????????????? ???????????? ?? ?????? ${tripTime}.<br><br>
    ${arrival}
    <button class="popup__btn">??????????????</button>
  `;

  // close popup button
  const closePopupBtn = document.querySelector(".popup__btn");
  closePopupBtn.addEventListener("click", () => {
    message.classList.remove("active");
  });
});
