function save_options() {
  var checkbox = document.getElementById("checkbox").checked;
  chrome.storage.sync.set({
    checkbox,
  });
}

function restore_options() {
  chrome.storage.sync.get(["checkbox"], function (items) {
    document.getElementById("checkbox").checked = items.checkbox;
  });
}
document.getElementById("checkbox").addEventListener("change", save_options);

restore_options();
