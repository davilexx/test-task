const timeOptionsCount = document
  .getElementById("time")
  .getElementsByTagName("label").length;
const hiddenElements = document
  .getElementById("time")
  .getElementsByTagName("label");
const showMoreBtn = document.querySelector(".time__show-btn");

if (timeOptionsCount > 4) {
  showMoreBtn.style.display = "block";
  for (let i = 3; i < hiddenElements.length; i++) {
    hiddenElements[i].style.display = "none";
  }
}

showMoreBtn.addEventListener("click", () => {
  for (let i = 0; i < hiddenElements.length; i++) {
    hiddenElements[i].style.display = "block";
  }
  showMoreBtn.style.display = "none";
});
