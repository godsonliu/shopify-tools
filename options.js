function save_options() {
  var checkbox1 = document.getElementById("checkbox1").checked;
  var checkbox2 = document.getElementById("checkbox2").checked;
  chrome.storage.sync.set({
    checkbox1,
    checkbox2,
  });
}

function restore_options() {
  chrome.storage.sync.get(["checkbox1", "checkbox2"], function (items) {
    document.getElementById("checkbox1").checked = items.checkbox1;
    document.getElementById("checkbox2").checked = items.checkbox2;
  });
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("change", save_options);
});

restore_options();
