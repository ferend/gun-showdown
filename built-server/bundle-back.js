/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/backend/clientConnection.ts":
/*!*************************************************!*\
  !*** ./src/scripts/backend/clientConnection.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clientConnection: () => (/* binding */ clientConnection)\n/* harmony export */ });\n/* harmony import */ var _gameComm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameComm */ \"./src/scripts/backend/gameComm.ts\");\n\r\nfunction clientConnection(io) {\r\n    let currentUsers = []; //array to store socketids and player data of each connection\r\n    io.on('connection', function (socket) {\r\n        (0,_gameComm__WEBPACK_IMPORTED_MODULE_0__.GameCommunication)(io, socket, currentUsers);\r\n        //remove the users data when they disconnect.\r\n        socket.on('disconnect', function () {\r\n            removeUser(currentUsers, socket);\r\n        });\r\n    });\r\n    setInterval(() => {\r\n        var time = new Date();\r\n        console.log(currentUsers.length + \" logged in @ \" + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));\r\n    }, 5000);\r\n}\r\nfunction removeUser(currentUsers, socket) {\r\n    let u = currentUsers.filter((user) => { return user.socketId == socket.id; });\r\n    if (u && u[0]) {\r\n        socket.broadcast.emit(\"remove player\", u[0].socketId);\r\n        currentUsers.splice(currentUsers.indexOf(u[0]), 1);\r\n    }\r\n    socket.removeAllListeners();\r\n}\r\n\n\n//# sourceURL=webpack://gun-showdown/./src/scripts/backend/clientConnection.ts?");

/***/ }),

/***/ "./src/scripts/backend/gameComm.ts":
/*!*****************************************!*\
  !*** ./src/scripts/backend/gameComm.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GameCommunication: () => (/* binding */ GameCommunication)\n/* harmony export */ });\nfunction GameCommunication(io, socket, currentUsers) {\r\n    let recentUpdates = []; //array to store socketids and player data of each connection\r\n    socket.on('player update', function (data) {\r\n        let p = recentUpdates.filter(update => update.socketId == data.socketId);\r\n        if (p && p[0]) {\r\n            let player = p[0];\r\n            player.x = data.x;\r\n            player.y = data.y;\r\n            player.angle = data.angle;\r\n            player.vx = data.vx,\r\n                player.vy = data.vy;\r\n        }\r\n        else {\r\n            recentUpdates.push(data);\r\n        }\r\n    });\r\n    socket.on(\"ready\", () => {\r\n        let newPlayer = createNewUser(socket);\r\n        socket.emit(\"first hi\", newPlayer, currentUsers);\r\n        socket.broadcast.emit(\"add opponent\", newPlayer);\r\n        currentUsers.push(newPlayer); //add user for data tracking/sharing\r\n    });\r\n    setInterval(() => {\r\n        io.emit(\"update all\", recentUpdates);\r\n        recentUpdates.forEach(data => {\r\n            let p = currentUsers.filter((user) => {\r\n                return user.socketId == data.socketId;\r\n            });\r\n            if (p && p[0]) {\r\n                let player = p[0];\r\n                player.x = data.x;\r\n                player.y = data.y;\r\n                player.angle = data.angle;\r\n                player.vx = data.vx,\r\n                    player.vy = data.vy;\r\n            }\r\n        });\r\n        recentUpdates.length = 0;\r\n    }, 100 / 30);\r\n    function createNewUser(socket) {\r\n        let d = new Date();\r\n        let time = d.toLocaleString('en-US', {\r\n            hour12: true,\r\n            timeZone: 'America/Los_Angeles'\r\n        });\r\n        let user = {\r\n            socketId: socket.id,\r\n            loginTime: new Date().getTime(),\r\n            x: 200 + Math.random() * 600,\r\n            y: 100 + Math.random() * 200,\r\n            angle: Math.random() * 180,\r\n            color: \"0x\" + Math.floor(Math.random() * 16777215).toString(16),\r\n            vx: 1 - Math.random() * 2,\r\n            vy: 1 - Math.random() * 2\r\n        };\r\n        return user;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://gun-showdown/./src/scripts/backend/gameComm.ts?");

/***/ }),

/***/ "./src/scripts/backend/server.ts":
/*!***************************************!*\
  !*** ./src/scripts/backend/server.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _clientConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./clientConnection */ \"./src/scripts/backend/clientConnection.ts\");\n\r\n\r\n\r\n\r\n//import mysql from 'mysql'\r\nconst app = express__WEBPACK_IMPORTED_MODULE_2___default()();\r\nconst port = process.env.PORT || 3000;\r\nconst server = http__WEBPACK_IMPORTED_MODULE_1___default().createServer(app);\r\nconst io = __webpack_require__(/*! socket.io */ \"socket.io\")(server);\r\n// let db =  mysql.createPool({\r\n//     host: '',\r\n//     user: ',\r\n//     password: '',\r\n//     database: ''\r\n//   });\r\n//set up the routes that point web requests to the right files.\r\napp.use(express__WEBPACK_IMPORTED_MODULE_2___default()[\"static\"]('/../public'));\r\napp.get(\"/\", (req, res) => {\r\n    res.sendFile(path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"/../public/index.html\"));\r\n});\r\napp.get(\"/mystyle.css\", (req, res) => {\r\n    res.sendFile(path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"/../public/mystyle.css\"));\r\n});\r\napp.get(\"/front-bundle.js\", (req, res) => {\r\n    res.sendFile(path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"/../public/front-bundle.js\"));\r\n});\r\napp.get(\"/assets/*\", (req, res) => {\r\n    res.sendFile(path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"/../public/\" + req.path));\r\n});\r\n//start the game communication server to handle player data\r\n(0,_clientConnection__WEBPACK_IMPORTED_MODULE_3__.clientConnection)(io);\r\n//start the web server to distribute the games files.\r\nserver.listen(port, () => {\r\n    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);\r\n});\r\n\n\n//# sourceURL=webpack://gun-showdown/./src/scripts/backend/server.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/backend/server.ts");
/******/ 	
/******/ })()
;