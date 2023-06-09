/* open crudcrud.com and then replace ID and resource name. */
// BEGIN: configuration zone
var CRUD_CURD_ID = "87622f44db054fca8d3c5f211a38ee0d";
var CRUD_CURD_RESOURCE_NAME = "todo";
var CURD_CURD_API_ENDPOINT =
  "https://crudcrud.com/api/" + CRUD_CURD_ID + "/" + CRUD_CURD_RESOURCE_NAME;
// END:configuration zone
var recentId;
// BEGIN: application variables zone
var APPLICATION_STATE = {
  todoList: [],
};
// END: application variables zone

// BEGIN: utility function zone
function htmlToElem(html) {
  let temp = document.createElement("template");
  html = html.trim(); // Never return a space text node as a result
  temp.innerHTML = html;
  return temp.content.firstChild;
}
// END: utility function zone

// BEGIN: API fetching zone
function loadTodoList(afterLoadFunction) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: headers,
  };

  fetch(CURD_CURD_API_ENDPOINT, requestOptions).then(function (response) {
    response.json().then(function (data) {
      afterLoadFunction(data);
      recentId = data[0]._id;
    });
  });
}

function addNewTodoItem(value, afterAddFunction) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    body: JSON.stringify({
      name: value,
    }),
    headers: headers,
  };

  fetch(CURD_CURD_API_ENDPOINT, requestOptions).then(function (response) {
    response.json().then(function (data) {
      afterAddFunction(data);
    });
  });
}

// END: API fetching zone

// BEGIN: UI Control and logic zone
function bindEvents() {
  var addButtonElm = document.getElementById("todo-add-button");
  addButtonElm.addEventListener("click", function () {
    var inputElm = document.getElementById("todo-input");
    var todoValue = inputElm.value;
    inputElm.value = "";
    if (todoValue !== "") {
      addNewTodoItem(todoValue, function () {
        refreshTodoList();
      });
    }
  });
}

function renderTodoList() {
  var todoListElm = document.getElementById("todo-list-container");
  todoListElm.innerHTML = "";

  for (var idx = 0; idx < APPLICATION_STATE.todoList.length; idx++) {
    var todoItem = APPLICATION_STATE.todoList[idx];
    var todoItemElm = htmlToElem(
      '<div class="todo-item">'+ todoItem.name +'<button onclick="delSound()" class="todo-delete-button">Delete</button>'+"</div>"
    );
    var deleteButton = todoItemElm.querySelector(".todo-delete-button");
    deleteButton.addEventListener("click", (function (id) {
      return function () {
        deleteTodoList(id, function () {
          refreshTodoList();
        });
      };
    })(todoItem._id));
    todoListElm.append(todoItemElm);
  }
}

function refreshTodoList() {
  loadTodoList(function (data) {
    APPLICATION_STATE.todoList = data;
    renderTodoList();
  });
}
function deleteTodoList() {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var requestOptions = {
    method: "DELETE",
    headers: headers,
  };

  fetch(
    CURD_CURD_API_ENDPOINT + "/" + recentId,
    requestOptions
  ).then((res) => {
    if (res.ok) {
      console.log("HTTP request successful");
    } else {
      console.log("HTTP request unsuccessful");
    }
    refreshTodoList();
  });
}
window.onload = function () {
  bindEvents();
  refreshTodoList();
};
// END: UI Control and logic zone

var addSong = document.getElementById("myAudio");
var deleteSong = document.getElementById("delAudio");

function addSound(){
  deleteSong.play();
}
function delSound(){
  addSong.play();
}