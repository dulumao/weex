/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	;__weex_define__("@weex-component/12a7eb18ddb56294ee0721456b8a5cd6", [], function(__weex_require__, __weex_exports__, __weex_module__){

	;
	  __weex_module__.exports = {
	    data: function () {return {
	      size: 9,
	      max: 10,
	      board: 0,
	      row: [],
	      vector: [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]],
	      strings: {
	        mine: "💣",
	        flag: "🚩",
	        win: "YOU WIN!",
	        lose: "YOU LOSE~"
	      },
	      finished: false
	    }},
	    methods: {
	      map: function(x, y, callback) { // visit tiles around (x, y)
	        for (var i = 0; i < 8; ++i) {
	          var mx = x + this.vector[i][0];
	          var my = y + this.vector[i][1];
	          if (mx >= 0 && my >= 0 && mx < this.size && my < this.size) {
	            callback(this.row[mx].col[my]);
	          }
	        }
	      },
	      dfs: function(tile) { // dfs a tile
	        var pos = this.position(tile.tid);
	        var context = this;
	        tile.state = "open";
	        this.map(pos["x"], pos["y"], function(node) {
	          if (node.around == 0 && node.state == "normal") { // dfs
	            context.dfs(node); // dfs recursively
	          } else {
	            context.display(node); // display tile
	          }
	        });
	      },
	      random: function(min, max) { // generate random number between [min, max)
	        return parseInt(Math.random() * (max - min) + min);
	      },
	      plant: function() { // arrange mines
	        var count = 0;
	        while (count < this.max) {
	          var x = this.random(0, this.size);
	          var y = this.random(0, this.size);
	          var tile = this.row[x].col[y];
	          if (tile.value == 0) {
	            ++count;
	            tile.value = 1;
	          }
	        }
	      },
	      calculate: function() { // calculate values around tiles
	        for (var i = 0; i < this.size; ++i) {
	          for (var j = 0; j < this.size; ++j) {
	            var around = 0;
	            this.map(i, j, function(tile) {
	              around += tile.value;
	            });
	            this.row[i].col[j].around = around;
	          }
	        }
	      },
	      restart: function(e) { // restart game
	        var row = [];
	        var count = 0;
	        this.board = this.max; // display remain mines
	        this.finished = false;
	        for (var i = 0; i < this.size; ++i) { // init data-binding
	          var col = { "col": [] };
	          for (var j = 0; j < this.size; ++j) {
	            var tid = i * this.size + j;
	            col["col"][j] = {
	              tid: "" + tid,
	              state: "normal",
	              value: 0,
	              text: "",
	              around: 0
	            };
	          }
	          row[i] = col;
	        }
	        this.row = row; // will cause view tree rendering
	        this.plant(); // arrange mines
	        this.calculate(); // calculate around values
	      },
	      unfinished: function() { // check game status
	        var finished = this.finished;
	        if (this.finished) { // restart if finished
	          this.restart();
	        }
	        return !finished;
	      },
	      position: function(tid) { // return (x, y) with tile id
	        var row = parseInt(tid / this.size);
	        var col = tid % this.size;
	        return { x: row, y: col };
	      },
	      display: function(tile) {
	        tile.state = "open";
	        tile.text = (tile.around == 0) ? "" : tile.around;
	      },
	      tile: function(event) { // return tile object with click event
	        var tid = event.target.attr["tid"];
	        var pos = this.position(tid);
	        return this.row[pos["x"]].col[pos["y"]];
	      },
	      onclick: function(event) { // onclick tile
	        if (this.unfinished()) {
	          var tile = this.tile(event);
	          if (tile.state == "normal") {
	            if (tile.value == 1) { // lose game
	              this.onfail();
	            } else { // open it
	              this.display(tile);
	              if (tile.around == 0) {
	                this.dfs(tile); // start dfs a tile
	              }
	              this.judge(); // game judgement
	            }
	          }
	        }
	      },
	      onlongpress: function(event) { // onlongpress tile
	        if (this.unfinished()) {
	          var tile = this.tile(event);
	          tile.state = tile.state == "flag" ? "normal" : "flag";
	          if (tile.state == "flag") {
	            --this.board;
	            tile.text = this.strings.flag; // flag
	          } else {
	            ++this.board;
	            tile.text = "";
	          }
	          this.judge();
	        }
	      },
	      foreach: function(callback) { // enumerate all tiles
	        for (var i = 0; i < this.size; ++i) {
	          for (var j = 0; j < this.size; ++j) {
	            callback(this.row[i].col[j]);
	          }
	        }
	      },
	      judge: function() {
	        var count = 0;
	        this.foreach(function(tile) {
	          if (tile.state == "open" || tile.state == "flag") {
	            ++count;
	          }
	        });
	        if (count == this.size * this.size) { // win
	          this.finished = true;
	          this.board = this.strings.win;
	        }
	      },
	      onfail: function() { // fail
	        this.board = this.strings.lose;
	        this.finished = true;
	        var mine = this.strings.mine;
	        this.foreach(function(tile) {
	          if (tile.value == 1) {
	            tile.text = mine;
	          }
	        });
	      }
	    }
	  }

	;__weex_module__.exports.template = __weex_module__.exports.template || {}
	;Object.assign(__weex_module__.exports.template, {
	  "type": "container",
	  "children": [
	    {
	      "type": "text",
	      "classList": [
	        "btn"
	      ],
	      "attr": {
	        "value": function () {return this.board}
	      }
	    },
	    {
	      "type": "container",
	      "repeat": function () {return this.row},
	      "style": {
	        "flexDirection": "row",
	        "flex": 1
	      },
	      "children": [
	        {
	          "type": "container",
	          "repeat": function () {return this.col},
	          "style": {
	            "flex": 1
	          },
	          "children": [
	            {
	              "type": "text",
	              "attr": {
	                "tid": function () {return this.tid},
	                "around": function () {return this.around},
	                "value": function () {return this.text}
	              },
	              "events": {
	                "click": "onclick",
	                "longpress": "onlongpress"
	              },
	              "classList": function () {return [this.state, 'tile']}
	            }
	          ]
	        }
	      ]
	    },
	    {
	      "type": "text",
	      "events": {
	        "click": "restart"
	      },
	      "classList": [
	        "btn"
	      ],
	      "attr": {
	        "value": "START"
	      }
	    }
	  ]
	})
	;__weex_module__.exports.style = __weex_module__.exports.style || {}
	;Object.assign(__weex_module__.exports.style, {
	  "btn": {
	    "margin": 2,
	    "backgroundColor": "#e74c3c",
	    "color": "#ffffff",
	    "textAlign": "center",
	    "flex": 1,
	    "fontSize": 66,
	    "height": 80
	  },
	  "normal": {
	    "backgroundColor": "#95a5a6"
	  },
	  "open": {
	    "backgroundColor": "#34495e",
	    "color": "#ffffff"
	  },
	  "flag": {
	    "backgroundColor": "#95a5a6"
	  },
	  "tile": {
	    "margin": 2,
	    "fontSize": 66,
	    "height": 80,
	    "paddingTop": 0,
	    "textAlign": "center"
	  }
	})
	})
	;__weex_bootstrap__("@weex-component/12a7eb18ddb56294ee0721456b8a5cd6", {
	  "transformerVersion": "0.3.1"
	},undefined)

/***/ }
/******/ ]);