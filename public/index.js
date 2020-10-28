init();

async function init() {
  try {
    console.log("inside init");
    if (location.search.split("=")[1] === undefined) {
      const workout = await API.getLastWorkout();
      if (workout) {
        location.search = "?id=" + workout._id;
      } else {
        document.querySelector("#continue-btn").classList.add("d-none")
      }
    }
  } catch (e) {
    console.log(e);
  }
}

