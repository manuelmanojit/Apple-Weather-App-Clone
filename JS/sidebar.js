const sidebarIcon = document.querySelector(".side-bar-icon");

function getSidebarStatus() {
  return (
    JSON.parse(localStorage.getItem("sidebarStatus")) || {
      navBarPosition: "-220px",
      forecastContainerPosition: "-97px",
    }
  );
}
//get the status from the storage
//check if the sidebar is hidden at the start,
//if it was first page visit, set default with || operator
//if it is hidden, then the saved object should be overwritten
//set html properties with correct
sidebarIcon.addEventListener("click", () => {
  // If I define sidebarStatus outside of the event listener, it is only read once. It becomes
  // a static snapshot of what was in localStorage in the beginning, not the most recent change
  const sidebarStatus = getSidebarStatus();
  const isHidden =
    sidebarStatus.navBarPosition === "-220px" &&
    sidebarStatus.forecastContainerPosition === "-97px";

  const updatedStatus = isHidden
    ? {
        navBarPosition: "0px",
        forecastContainerPosition: "0px",
      }
    : {
        navBarPosition: "-220px",
        forecastContainerPosition: "-97px",
      };

  localStorage.setItem("sidebarStatus", JSON.stringify(updatedStatus));

  document.documentElement.style.setProperty(
    "--sidebarLeft",
    updatedStatus.navBarPosition
  );
  document.documentElement.style.setProperty(
    "--forecastContainerLeft",
    updatedStatus.forecastContainerPosition
  );
});

export { getSidebarStatus };
