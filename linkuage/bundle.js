/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "5ed5fd5f3cec869e2138";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/bootstrap.js")(__webpack_require__.s = "./src/bootstrap.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Controller/Block.Controller.js":
/*!********************************************!*\
  !*** ./src/Controller/Block.Controller.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Block; });\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../linkuage.js */ \"./src/linkuage.js\");\n/* harmony import */ var _Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Node.Controller.js */ \"./src/Controller/Node.Controller.js\");\n\r\n\r\n\r\n\r\n\r\nclass Block {\r\n   // @parameter {string}  name  : blocks name\r\n   // @parameter {uint}    ipc   : input pins count\r\n   // @parameter {uint}    opc   : output pins count\r\n   constructor(name, ipc, opc) {\r\n      this.name      = name;\r\n      this.ipc       = ipc;\r\n      this.opc       = opc;\r\n      this.masters   = [];\r\n      this.slaves    = [];\r\n      this.inputs    = [];\r\n      this.outputs   = [];\r\n      for (let n = 0;n < ipc;n++) {\r\n         this.masters.push([]);\r\n         let instance = new _Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\r\n         instance.attach(this, 'IN', n);\r\n         this.inputs.push(instance);\r\n      }\r\n      for (let n = 0;n < opc;n++) {\r\n         this.slaves.push([]);\r\n         let instance = new _Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\r\n         instance.attach(this, 'OUT', n);\r\n         this.outputs.push(instance);\r\n      }\r\n   }\r\n   collect(index, value, origin) {\r\n      console.log(`[${this.name}] is trigged on pin '${index}' by the value of '${value}' from [${origin.name}]`);\r\n   }\r\n   emit(index, value) {\r\n      if (_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pause) return;\r\n      if (!this.slaves[index]) return;\r\n      this.slaves[index].forEach(s => {\r\n         if (_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].running)\r\n            s.block.collect(s.index, value, this);\r\n      });\r\n   }\r\n}\n\n//# sourceURL=webpack:///./src/Controller/Block.Controller.js?");

/***/ }),

/***/ "./src/Controller/Node.Controller.js":
/*!*******************************************!*\
  !*** ./src/Controller/Node.Controller.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Node; });\n\r\nclass Node {\r\n   constructor() {\r\n      // nodes from which this node receive data\r\n      this.masters = [];\r\n      // nodes to which this node send data\r\n      this.slaves = [];\r\n      // block that this node is attached to (can be null) \r\n      this.attached = {\r\n         block: null, // block var\r\n         io: null, // input or output\r\n         index: null // pin index\r\n      };\r\n      // view object\r\n      this.flesh = null;\r\n   }\r\n   // connect two nodes update related blocks masters and slaves relationship\r\n   static connect(master, slave) {\r\n      master.slaves.push(slave);\r\n      slave.masters.push(master);\r\n      master.findMasterBlocks().forEach(m => {\r\n         master.findSlaveBlocks().forEach(s => {\r\n            let mb = m.block;\r\n            let sb = s.block;\r\n            mb.slaves[m.index] = mb.slaves[m.index].filter(b => b !== s);\r\n            mb.slaves[m.index].push(s);\r\n            sb.masters[s.index] = sb.masters[s.index].filter(b => b !== m);\r\n            sb.masters[s.index].push(m);\r\n         });\r\n      });\r\n   }\r\n   // disconnect two nodes update related blocks masters and slaves relationship\r\n   static disconnect(master, slave) {\r\n      master.slaves = master.slaves.filter(s => s !== slave);\r\n      slave.masters = slave.masters.filter(m => m !== master);\r\n      master.findMasterBlocks().forEach(m => {\r\n         let mb = m.block;\r\n         mb.slaves[m.index] = [];\r\n         mb.slaves[m.index] = mb.outputs[m.index].findSlaveBlocks();\r\n      });\r\n      slave.findSlaveBlocks().forEach(s => {\r\n         let sb = s.block;\r\n         sb.masters[s.index] = [];\r\n         sb.masters[s.index] = sb.inputs[s.index].findMasterBlocks();\r\n      });\r\n   }\r\n   // attach this node to a pin on a block\r\n   attach(block, io, index) {\r\n      this.attached   = {\r\n         block: block,\r\n         io: io,\r\n         index: index\r\n      };\r\n   }\r\n   // find blocks that are directly connected to this or this node's slaves (input) [recursive]\r\n   findSlaveBlocks(found = []) {\r\n      if (this.attached.block && this.attached.io == 'IN') \r\n         found.push(this.attached);\r\n      this.slaves.forEach(slave => {\r\n         slave.findSlaveBlocks(found);\r\n      });\r\n      return found.filter((v, i, a) => a.indexOf(v) === i);\r\n   }\r\n   // find blocks that are directly connected to this or this node's masters (output) [recursive]\r\n   findMasterBlocks(found = []) {\r\n      if (this.attached.block && this.attached.io == 'OUT') \r\n         found.push(this.attached);\r\n      this.masters.forEach(master => {\r\n         master.findMasterBlocks(found);\r\n      });\r\n      return found.filter((v, i, a) => a.indexOf(v) === i);\r\n   }\r\n}\n\n//# sourceURL=webpack:///./src/Controller/Node.Controller.js?");

/***/ }),

/***/ "./src/Lib/basix.js":
/*!**************************!*\
  !*** ./src/Lib/basix.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// ---------------------------//\r\n//\t   Basix Game Engine \t  //\r\n// -------------------------- //\r\n\r\n// author  : 0utlandish\r\n// version : 1.4.0\r\n\r\n// Basix global functions and attributes\r\nconst Basix = {\r\n    version: \"1.5.0\"\r\n};\r\n// Basix configuration\r\nBasix.config = {\r\n    cursor: 'default',\r\n}\r\nBasix.layers = {\r\n    counter: 1,\r\n    list: {},\r\n    add: args => {\r\n        let def = {\r\n            name: false\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        args.name = args.name ? args.name : `Layer ${Basix.layers.counter++}`\r\n        let layer = new Basix.Layer(args);\r\n        layer.animate();\r\n        return layer.tick();\r\n    }\r\n}\r\n// Basix error logic manager\r\nBasix.error = {\r\n    add: (message) => {\r\n        Basix.error.log.push({\r\n            time: (new Date()).toLocaleTimeString(),\r\n            message\r\n        });\r\n    },\r\n    log: [],\r\n    display: {\r\n        last: (time = false) => {\r\n            if (time)\r\n                console.log(`%c[Basix] > %c${Basix.error.log[Basix.error.log.length-1].time} : %c${Basix.error.log[Basix.error.log.length-1].message}`, 'color: #E91E63', 'color: #1976D2', 'color: red');\r\n            else\r\n                console.log(`%c[Basix] > %c${Basix.error.log[Basix.error.log.length-1].message}`, 'color: #E91E63', 'color: red');\r\n        },\r\n        all: (time = false) => {\r\n            Basix.error.log.forEach((err) => {\r\n                if (time)\r\n                    console.log(`%c[Basix] > %c${err.time} : %c${err.message}`, 'color: #E91E63', 'color: #1976D2', 'color: red');\r\n                else\r\n                    console.log(`%c[Basix] > %c${err.message}`, 'color: #E91E63', 'color: red');\r\n            });\r\n        }\r\n    }\r\n}\r\n// loads assets (images, sounds, ...)\r\nBasix.resources = {\r\n    log: true,\r\n    insert: {\r\n        sound: (name, src) => {\r\n            const sound = document.createElement(\"audio\");\r\n            sound.addEventListener('error', function(e) {\r\n                console.log(e);\r\n                e.preventDefault();\r\n            });\r\n            sound.src = src;\r\n            sound.setAttribute(\"preload\", \"auto\");\r\n            sound.setAttribute(\"controls\", \"none\");\r\n            sound.style.display = \"none\";\r\n            document.body.appendChild(sound);\r\n            sound.play = () => {\r\n                let clone = sound.cloneNode(true);\r\n                document.querySelector(\"body\").appendChild(clone);\r\n                clone.play();\r\n                clone.addEventListener('ended', () => {\r\n                    clone.remove();\r\n                });\r\n            }\r\n            Basix.resources.list.sfx[name] = sound;\r\n        },\r\n        image: (name, src) => {\r\n            let image = new Image();\r\n            image.src = src;\r\n            Basix.resources.list.gfx[name] = image;\r\n        }\r\n    },\r\n    list: {\r\n        gfx: {},\r\n        sfx: {}\r\n    },\r\n    progress: 0,\r\n    index: 0,\r\n    load: async () => {\r\n        let count = 0;\r\n        for (let group in Basix.resources.list) {\r\n            for (let res in Basix.resources.list[group]) {\r\n                count++;\r\n            }\r\n        }\r\n        Basix.resources.log && console.log('%c[Basix] > %cLoading resources : ', 'color: #E91E63', 'color: #333');\r\n        let loadings = [];\r\n        return new Promise(async (pass) => {\r\n            for (let group in Basix.resources.list) {\r\n                for (let res in Basix.resources.list[group]) {\r\n                    if (group == 'ready') continue;\r\n                    let load = new Promise((resolve, reject) => {\r\n                        if (Basix.resources.list[group][res].readyState > 3) {\r\n                            Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px');\r\n                            Basix.resources.index++;\r\n                            resolve(true);\r\n                            return true;\r\n                        }\r\n                        Basix.resources.list[group][res].addEventListener('canplaythrough', () => {\r\n                            Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px')\r\n                            Basix.resources.index++;\r\n                            resolve(true);\r\n                            return true;\r\n                        }, false);\r\n                        Basix.resources.list[group][res].onload = () => {\r\n                            Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px');\r\n                            Basix.resources.index++;\r\n                            resolve(true);\r\n                            return true;\r\n                        }\r\n                        Basix.resources.list[group][res].onerror = () => {\r\n                            Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Error)`, 'color: #E91E63', 'color: #1976D2', 'background: red;color: #fff;font-size: 9px');\r\n                            Basix.resources.list[group][res] = res;\r\n                            Basix.resources.index++;\r\n                            resolve(false);\r\n                            return true;\r\n                        }\r\n                    });\r\n                    loadings.push(load);\r\n                    await load;\r\n                    Basix.resources.progress = Basix.resources.index / count;\r\n                }\r\n            }\r\n            Promise.all(loadings).then(function(results) {\r\n                if (!results.includes(false)) {\r\n                    Basix.resources.log && console.log('%c[Basix] > %cAll resources loaded successfully !', 'color: #E91E63', 'font-weight: bold;color: #00C000');\r\n                    pass(true);\r\n                } else {\r\n                    Basix.resources.log && console.log('%c[Basix] > %cSome of the resources may not be loaded !', 'color: #E91E63', 'font-weight: bold;color: #C00000');\r\n                    pass(false);\r\n                }\r\n            });\r\n        });\r\n    }\r\n}\r\n\r\n// store mouse position on the window\r\nBasix.mouse = {\r\n    x: 0,\r\n    y: 0\r\n}\r\ndocument.addEventListener('mousemove', e => {\r\n    Basix.mouse.x = e.offsetX;\r\n    Basix.mouse.y = e.offsetY;\r\n});\r\n\r\n// mouse and keyboard events\r\nBasix.keydown = {};\r\nBasix.mousedown = {};\r\ndocument.addEventListener('mousedown', e => {\r\n    if (e.target.tagName == 'CANVAS') {\r\n        for (name in Basix.layers.list) {\r\n            Basix.mousedown[['mouseleft', 'mousemiddle', 'mouseright'][e.button]] = true;\r\n        }\r\n    }\r\n});\r\ndocument.addEventListener('mouseup', e => {\r\n    if (e.target.tagName == 'CANVAS') {\r\n        for (name in Basix.layers.list) {\r\n            Basix.mousedown[['mouseleft', 'mousemiddle', 'mouseright'][e.button]] = false;\r\n        }\r\n    }\r\n});\r\ndocument.addEventListener('keydown', e => {\r\n    if (document.activeElement.tagName == 'BODY') {\r\n        for (name in Basix.layers.list) {\r\n            Basix.keydown[e.key] = true;\r\n        }\r\n    }\r\n});\r\ndocument.addEventListener('keyup', e => {\r\n    if (document.activeElement.tagName == 'BODY') {\r\n        for (name in Basix.layers.list) {\r\n            Basix.keydown[e.key] = false;\r\n        }\r\n    }\r\n});\r\n\r\n// every Layer is a canvas element with desired settings such as different fps and tps\r\n// @parameter {string}     name \t\t: id of canvas element (not much important)\r\n// @parameter {number}  width \t\t: width of canvas\r\n// @parameter {number}  height \t: height of canvas\r\n// @parameter {integer}   fps \t\t: frames per second\r\n// @parameter {integer}   tps \t\t: ticks per second\r\n// @parameter {boolean}  alpha \t\t: canvas context alpha activation\r\nBasix.Layer = class {\r\n    constructor(args) {\r\n        const def = {\r\n            name: 'default',\r\n            width: window.innerWidth,\r\n            height: window.innerHeight,\r\n            left: 0,\r\n            top: 0,\r\n            autofps: true,\r\n            fps: 60,\r\n            tps: 60,\r\n            alpha: false,\r\n            monitor: false,\r\n            clear: true,\r\n            background: false\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        Basix.layers.list[args.name] = this;\r\n        const body = document.querySelector('body');\r\n        this.organ = document.createElement(\"canvas\");\r\n        this.organ.style.cursor = Basix.config.cursor;\r\n        this.organ.style.position = \"fixed\";\r\n        this.organ.style.zIndex = \"-1\";\r\n        this.organ.style.left = args.left;\r\n        this.organ.style.top = args.top;\r\n        this.monitor = document.createElement(\"span\");\r\n        this.monitor.style.fontSize = \"10px\";\r\n        this.monitor.style.padding = \"5px 15px\";\r\n        this.monitor.style.fontWeight = \"bold\";\r\n        this.monitor.style.fontFamily = \"monospace\";\r\n        this.monitor.style.color = \"#E1F5FE\";\r\n        this.monitor.style.background = \"#E91E63\";\r\n        this.monitor.style.display = \"block\";\r\n        this.monitor.style.margin = \"10px\";\r\n        this.monitor.style.borderRadius = \"6px\";\r\n        this.monitor.innerText = \"-\";\r\n        body.append(this.organ);\r\n        document.querySelector(\"#status\").append(this.monitor);\r\n        this.name = args.name;\r\n        this.width = args.width;\r\n        this.height = args.height;\r\n        this.alpha = args.alpha;\r\n        this.clear = args.clear;\r\n        this.background = args.background;\r\n        this.organ.setAttribute(\"id\", args.name);\r\n        this.organ.setAttribute(\"width\", this.width);\r\n        this.organ.setAttribute(\"height\", this.height);\r\n        this.organ.setAttribute(\"oncontextmenu\", \"return false\");\r\n        this.xCenter = this.width / 2;\r\n        this.yCenter = this.height / 2;\r\n        this.elements = [];\r\n        this.autofps = args.autofps;\r\n        this.fps = args.fps;\r\n        this.tps = args.tps;\r\n        this.pause = false;\r\n        this.tile = {\r\n            visible: false,\r\n            size: 32,\r\n            width: 0.2,\r\n            color: \"#00AA00\",\r\n        };\r\n        // camera offset\r\n        this.camera = {\r\n            x: 0,\r\n            y: 0\r\n        };\r\n        // elements size scale\r\n        this.scale = 1;\r\n        // context of the canvas\r\n        this.context = this.organ.getContext(\"2d\", {\r\n            alpha: this.alpha\r\n        });\r\n        // to read real fps & tps\r\n        this.status = {\r\n            display: (mood = true) => {\r\n                this.monitor.style.display = mood ? \"block\" : \"none\";\r\n                setInterval(() => {\r\n                    this.monitor.innerHTML = `[${this.name}] :: FPS : ${this.status.fps.last} | TPS : ${this.status.tps.last} | REN : ${(() => {\r\n\t\t\t\t\t\treturn this.elements.filter(e => e.object.visible).length;\r\n\t\t\t\t\t}) ()}`;\r\n                }, 1000);\r\n            },\r\n            fps: {\r\n                counter: 0,\r\n                last: null,\r\n                start: (() => {\r\n                    setInterval(() => {\r\n                        this.status.fps.last = this.status.fps.counter;\r\n                        this.status.fps.counter = 0;\r\n                    }, 1000);\r\n                })()\r\n            },\r\n            tps: {\r\n                counter: 0,\r\n                last: null,\r\n                start: (() => {\r\n                    setInterval(() => {\r\n                        this.status.tps.last = this.status.tps.counter;\r\n                        this.status.tps.counter = 0;\r\n                    }, 1000);\r\n                })()\r\n            }\r\n        }\r\n        this.status.display(args.monitor);\r\n    }\r\n    // make all of its elements stop moving and pause animate and tick functions \r\n    freeze() {\r\n        this.pause = true;\r\n        this.elements.forEach(element => {\r\n            element.object.stop();\r\n        });\r\n        return this;\r\n    }\r\n    // the logic of your creation executes here\r\n    tick() {\r\n        this.status.tps.counter++;\r\n        if (!this.pause) {\r\n            for (let i = 0; i < this.elements.length; i++) {\r\n                this.elements[i].object.tick(this.elements[i]);\r\n            }\r\n        }\r\n        const that = this;\r\n        setTimeout(() => {\r\n            that.tick();\r\n        }, 1000 / this.tps);\r\n        return this;\r\n    }\r\n    // clear the canvas and paint again\r\n    animate() {\r\n        this.status.fps.counter++;\r\n        this.elements.sort(function(a, b) {\r\n            if (a.object.z < b.object.z) return -1;\r\n            if (a.object.z > b.object.z) return 1;\r\n            return 0;\r\n        });\r\n        if (!this.pause) {\r\n            if (this.clear) {\r\n                if (this.background) {\r\n                    this.context.fillStyle = this.background;\r\n                    this.context.fillRect(0, 0, this.width, this.height);\r\n                } else {\r\n                    this.context.clearRect(0, 0, this.width, this.height);\r\n                }\r\n            }\r\n            if (this.tile.visible) {\r\n                this.context.strokeStyle = this.tile.color;\r\n                for (let i = 0; i < this.width / this.tile.size; i++) {\r\n                    this.context.lineWidth = this.tile.width;\r\n                    this.context.moveTo(0, i * this.tile.size);\r\n                    this.context.lineTo(this.width, i * this.tile.size);\r\n                    this.context.moveTo(i * this.tile.size, 0);\r\n                    this.context.lineTo(i * this.tile.size, this.height);\r\n                }\r\n                this.context.stroke();\r\n                this.context.fill();\r\n            }\r\n            this.elements.forEach(element => {\r\n                if (element.object.visible)\r\n                    element.object.render(\r\n                        this.context,\r\n                        this.camera,\r\n                        this.scale\r\n                    );\r\n            });\r\n        }\r\n        if (this.fps) {\r\n            const that = this;\r\n            if (this.autofps) {\r\n                window.requestAnimationFrame(() => {\r\n                    that.animate();\r\n                });\r\n            } else {\r\n                setTimeout(() => {\r\n                    that.animate();\r\n                }, 1000 / this.fps);\r\n            }\r\n            return this;\r\n        }\r\n    }\r\n}\r\n\r\n// this class manages tileset image and make you able to draw it on canvas \r\n// @parameter {Image}    layer \t\t: Image object that you want to fuck the tileset out of it\r\n// @parameter {number}  tileSize \t: size of every tile\r\nBasix.Tileset = class {\r\n    constructor(args) {\r\n        const def = {\r\n            image: null,\r\n            tileSize: 32\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        }\r\n        this.tileSize = args.tileSize;\r\n        this.image = args.image;\r\n    }\r\n    draw(args) {\r\n        const def = {\r\n            layer: null,\r\n            i: 0,\r\n            j: 0,\r\n            x: 0,\r\n            y: 0,\r\n            size: this.tileSize\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        args.layer.context.drawImage(this.image, args.i * this.tileSize, args.j * this.tileSize, this.tileSize, this.tileSize, args.x, args.y, args.size, args.size);\r\n        return this;\r\n    }\r\n    tileDraw(args) {\r\n        const def = {\r\n            layer: null,\r\n            i: 0,\r\n            j: 0,\r\n            x: 0,\r\n            y: 0\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        args.layer.context.drawImage(this.image, args.i * this.tileSize, args.j * this.tileSize, this.tileSize, this.tileSize, args.x * this.tileSize, args.y * this.tileSize, this.tileSize, this.tileSize);\r\n        return this;\r\n    }\r\n}\r\n\r\n// this Element class has the main attributes of every element that is going to be created\r\n// @parameter {string}    \tlayer \t\t: layer name in which your element will be rendered\r\n// @parameter {number}    \tx \t\t\t: x position of the element\r\n// @parameter {number}    \ty \t\t\t: y position of the element\r\n// @parameter {number}    \tsize \t\t: size of the element [optional]\r\nBasix.Element = class {\r\n    constructor(args) {\r\n        const def = {\r\n            layer: \"default\",\r\n            x: 0,\r\n            y: 0,\r\n            z: 0,\r\n            size: 0\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        if (Basix.layers.list[args.layer] == undefined) {\r\n            Basix.error.add(`Layer '${args.layer}' is not defined !`);\r\n        }\r\n        this.layer = Basix.layers.list[args.layer];\r\n        this.x = args.x;\r\n        this.y = args.y;\r\n        this.z = args.z;\r\n        this.size = args.size;\r\n        this.layer.elements.push({\r\n            z: this.z,\r\n            object: this\r\n        });\r\n        this.visible = true;\r\n        this.idle = true;\r\n        this.done = false;\r\n        this.stop = () => {};\r\n    }\r\n    // removes element from layers element list\r\n    remove() {\r\n        if (!this.done) {\r\n            this.done = true;\r\n            this.stop();\r\n        }\r\n        this.layer.elements = this.layer.elements.filter(e => {\r\n            return (e.object != this);\r\n        });\r\n    }\r\n    // preform several move in sequence\r\n    // @parameter {number}  x \t\t\t\t: destination x\r\n    // @parameter {number}  y \t\t\t\t: destination y\r\n    // @parameter {number}  duration \t\t: duration till element reach the destination (in 0.01s => 100 will be 1 sec)\r\n    // @parameter {boolean}  relative\t\t: if true destination x and y are relative to the current element position\r\n    // @parameter {function} \tcallback\t: this function will be called after movement finished or element is stopped, pass true as input if element reached the destination and false if element is stopped \r\n    moveByDuration(args) {\r\n        this.stop();\r\n        return new Promise((resolve) => {\r\n            const def = {\r\n                x: 0,\r\n                y: 0,\r\n                duration: 100,\r\n                relative: false,\r\n                callback: () => {}\r\n            }\r\n            args = {\r\n                ...def,\r\n                ...args\r\n            };\r\n            if (args.relative) {\r\n                args.x += this.x;\r\n                args.y += this.y;\r\n            }\r\n            if (this.x == args.x && this.y == args.y) return true;\r\n            const slop = Math.abs((args.y - this.y) / (args.x - this.x));\r\n            const distance = ((args.y - this.y) ** 2 + (args.x - this.x) ** 2) ** 0.5;\r\n            const speed = distance / args.duration;\r\n            const angle = Math.atan(slop) * (180 / Math.PI);\r\n            const xs = Math.sign(args.x - this.x) * Math.cos(angle / (180 / Math.PI));\r\n            const ys = Math.sign(args.y - this.y) * Math.sin(angle / (180 / Math.PI));\r\n            let driver = setInterval(() => {\r\n                this.x += speed * xs;\r\n                this.y += speed * ys;\r\n            }, 10);\r\n            this.stop = (status = false) => {\r\n                if (driver) {\r\n                    args.callback(status);\r\n                    clearInterval(driver);\r\n                    driver = false;\r\n                    resolve(true);\r\n                }\r\n            }\r\n            setTimeout(this.stop, args.duration * 10, true);\r\n        });\r\n    }\r\n    // preform several move in sequence\r\n    // @parameter {number}  x \t\t\t\t: destination x\r\n    // @parameter {number}  y \t\t\t\t: destination y\r\n    // @parameter {number}  speed \t\t\t: movement speed (pixels per 0.01)\r\n    // @parameter {boolean}  relative\t\t: if true destination x and y are relative to the current element position y\r\n    // @parameter {function} \tcallback\t: this function will be called after movement finished or element is stopped, pass true as input if element reached the destination and false if element is stopped \r\n    moveBySpeed(args, priority = true) {\r\n        if (priority)\r\n            this.stop();\r\n        return new Promise((resolve) => {\r\n            const def = {\r\n                x: 0,\r\n                y: 0,\r\n                speed: 10,\r\n                relative: false,\r\n                callback: () => {}\r\n            }\r\n            args = {\r\n                ...def,\r\n                ...args\r\n            };\r\n            if (args.relative) {\r\n                args.x += this.x;\r\n                args.y += this.y;\r\n            }\r\n            if (this.x == args.x && this.y == args.y) return true;\r\n            const slop = Math.abs((args.y - this.y) / (args.x - this.x));\r\n            const distance = ((args.y - this.y) ** 2 + (args.x - this.x) ** 2) ** 0.5;\r\n            const duration = distance / args.speed;\r\n            const angle = Math.atan(slop) * (180 / Math.PI);\r\n            const xs = Math.sign(args.x - this.x) * Math.cos(angle / (180 / Math.PI));\r\n            const ys = Math.sign(args.y - this.y) * Math.sin(angle / (180 / Math.PI));\r\n            let driver = setInterval(() => {\r\n                this.x += args.speed * xs;\r\n                this.y += args.speed * ys;\r\n            }, 1000 / this.layer.tps);\r\n            this.stop = (status = false) => {\r\n                if (driver) {\r\n                    args.callback(status);\r\n                    clearInterval(driver);\r\n                    driver = false;\r\n                    resolve(true);\r\n                }\r\n            }\r\n            setTimeout(this.stop, duration * 10 + 5, true);\r\n        });\r\n    }\r\n    // preform several move in sequence\r\n    // @parameter {integer} cycle\t\t\t: determine how many time task should repeat (set to Infinity if you want it to loop for ever)\r\n    // @parameter {arrays->object} moves \t: store moves values\r\n    // @parameter {number} x \t\t\t\t: destination x\r\n    // @parameter {number} y \t\t\t\t: destination y\r\n    // @Note : on of the following attribute are allowed to use\r\n    // @parameter {number} speed \t\t\t: movement speed\r\n    // @parameter {number} duration \t\t: movement duration\r\n    task(args) {\r\n        const def = {\r\n            moves: [],\r\n            cycle: 1,\r\n            priority: false,\r\n            callback: () => {}\r\n        }\r\n        if (this.idle != true) {\r\n            return false;\r\n        }\r\n        args = {\r\n            ...def,\r\n            ...args\r\n        };\r\n        this.idle = false;\r\n        let task = (async function(that) {\r\n            const numberOfMoves = args.moves.length;\r\n            const i = 0;\r\n            const x = 0;\r\n            while (i < numberOfMoves && !that.idle) {\r\n                if (that.idle == false) {\r\n                    if (args.moves[i].duration == undefined) {\r\n                        await that.moveBySpeed({\r\n                            x: args.moves[i].x,\r\n                            y: args.moves[i].y,\r\n                            speed: args.moves[i].speed,\r\n                            callback: () => {\r\n                                i++;\r\n                            }\r\n                        });\r\n                    } else {\r\n                        await that.moveByDuration({\r\n                            x: args.moves[i].x,\r\n                            y: args.moves[i].y,\r\n                            duration: args.moves[i].duration,\r\n                            callback: () => {\r\n                                i++;\r\n                            }\r\n                        });\r\n                    }\r\n                }\r\n                if (i == numberOfMoves && !that.idle) {\r\n                    i = 0;\r\n                    x++;\r\n                }\r\n                if (args.cycle == x) {\r\n                    that.idle = true;\r\n                }\r\n            }\r\n        })(this);\r\n        task.then(args.callback);\r\n        return this;\r\n    }\r\n    render() {\r\n        // must be overwrite\r\n    }\r\n    tick() {\r\n        // must be overwrite\r\n    }\r\n}\r\n\r\n// loads Basix Models Scheme (bsm) file\r\n// @parameter {string} src\t\t: bsm file adress\r\n// @parameter {number} scale\t: bsm model scale\r\nBasix.BMS = class {\r\n    constructor(src, scale = 1) {\r\n        this.src = src;\r\n        this.scale = scale;\r\n        this.decode = (b) => {\r\n            var f, o;\r\n            var a, e = {},\r\n                d = b.split(\"\"),\r\n                c = f = d[0],\r\n                g = [c],\r\n                h = o = 256;\r\n            for (b = 1; b < d.length; b++) a = d[b].charCodeAt(0), a = h > a ? d[b] : e[a] ? e[a] : f + c, g.push(a), c = a.charAt(0), e[o] = f + c, o++, f = a;\r\n            return g.join(\"\")\r\n        }\r\n        this.load = (() => {\r\n            return new Promise(async r => {\r\n                let resp = await fetch(src);\r\n                this.data = this.decode(await resp.text());\r\n                this.data = JSON.parse(this.data);\r\n                this.width = this.data.length;\r\n                this.height = this.data[0].length;\r\n                this.update();\r\n                r();\r\n            });\r\n        })();\r\n        this.update = () => {\r\n            this.figure = new OffscreenCanvas(this.width * this.scale, this.height * this.scale);\r\n            let context = this.figure.getContext('2d');\r\n            for (let i = 0; i < this.width; i++)\r\n                for (let j = 0; j < this.height; j++) {\r\n                    context.fillStyle = this.data[i][j];\r\n                    context.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);\r\n                }\r\n        }\r\n    }\r\n}\r\n\r\n// initialize defualtLayer\r\nBasix.init = () => {\r\n    Basix.layers.add({\r\n        name: 'default',\r\n        autofps: true,\r\n        tps: 60,\r\n        monitor: true,\r\n        clear: true\r\n    });\r\n}\r\n\r\n// setting proper css style for document\r\nconst body = document.querySelector('body');\r\nbody.onselectstart = function() {\r\n    return (false);\r\n};\r\nbody.style.margin = 0;\r\nbody.style.padding = 0;\r\nbody.style.backgroundColor = '#E91E63';\r\nlet status = document.createElement(\"span\");\r\nstatus.setAttribute(\"id\", \"status\");\r\nstatus.style.position = \"fixed\";\r\nstatus.style.left = 0;\r\nstatus.style.top = 0;\r\nstatus.style.zIndex = 1;\r\nbody.append(status);\r\n\r\nconsole.info(`%c■ Powered by %cBasix %c${Basix.version}`, 'font-weight: bold', 'color: #E91E63;font-weight: bold', 'background: #00E676;color: #FFF;border-radius: 50px;font-size:9px;padding:2px 5px;');\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Basix);\n\n//# sourceURL=webpack:///./src/Lib/basix.js?");

/***/ }),

/***/ "./src/View/Block.View.js":
/*!********************************!*\
  !*** ./src/View/Block.View.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Block; });\n/* harmony import */ var _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lib/basix.js */ \"./src/Lib/basix.js\");\n/* harmony import */ var _Controller_Block_Controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Controller/Block.Controller.js */ \"./src/Controller/Block.Controller.js\");\n/* harmony import */ var _Node_View_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.View.js */ \"./src/View/Node.View.js\");\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../linkuage.js */ \"./src/linkuage.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nOffscreenCanvasRenderingContext2D.prototype.roundRect = CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {\r\n\tif (w < 2 * r) r = w / 2;\r\n\tif (h < 2 * r) r = h / 2;\r\n\tthis.beginPath();\r\n\tthis.moveTo(x+r, y);\r\n\tthis.arcTo(x+w, y, x+w, y+h, r);\r\n\tthis.arcTo(x+w, y+h, x, y+h, r);\r\n\tthis.arcTo(x, y+h, x, y, r);\r\n\tthis.arcTo(x, y, x+w, y, r);\r\n\tthis.closePath();\r\n\treturn this;\r\n}\r\n\r\nclass Block extends _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Element {\r\n\tconstructor(sketch, x, y, name, ipc, opc, _if = [], _of = []) {\r\n\t\tsuper({x, y, layer: 'Sketch'});\r\n\t\tthis.controller = new _Controller_Block_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](name, ipc, opc);\r\n\t\tthis.nodes = [];\r\n        this.if = _if;\r\n        this.of = _of;\r\n\t\tfor (let n = 0;n < this.controller.ipc;n++) {\r\n\t\t\tlet t = new _Node_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"](sketch, {block: this, io: 'IN', index: n}, 0, 0);\r\n\t\t\tt.merge(this.controller.inputs[n]);\r\n\t\t\tthis.nodes.push(t);\r\n\t\t}\r\n\t\tfor (let n = 0;n < this.controller.opc;n++) {\r\n\t\t\tlet t = new _Node_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"](sketch, {block: this, io: 'OUT', index: n}, 0, 0);\r\n\t\t\tt.merge(this.controller.outputs[n]);\r\n\t\t\tthis.nodes.push(t);\r\n\t\t}\r\n\t\tthis.controller.collect = (i, v, o) => {\r\n\t\t\tthis.collect(i, v, o)\r\n\t\t};\r\n\t\tthis.sketch = sketch;\r\n        this.layer.context.font = `${_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Size}px ${_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Name}`;\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].blocks.push(this);\r\n\t\tthis.width  = Math.ceil(this.layer.context.measureText(this.controller.name).width / this.sketch.scale) + _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelHPadding;\r\n\t\tthis.height = Math.max(this.controller.ipc, this.controller.opc) - 1 + (_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelVPadding * 2);\r\n\t\tthis.update = () => {\r\n\t\t\tthis.width  = Math.ceil(this.layer.context.measureText(this.controller.name).width / this.sketch.scale) + _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelHPadding;\r\n\t\t\t// this.height = Math.max(this.controller.ipc, this.controller.opc) - 1 + (Linkuage.config.BlockLabelVPadding * 2);\r\n\t\t\tlet osc = new OffscreenCanvas((this.width + 2) * this.sketch.scale, this.height * this.sketch.scale + 2);\r\n\t\t\tlet ctx = osc.getContext('2d');\r\n\t\t\tctx.strokeStyle = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockStrokeColor;\r\n\t\t\tctx.fillStyle = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFillColor;\r\n\t\t\tctx.lineWidth = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockBorderWidth;\r\n\t\t\tctx.roundRect(this.sketch.scale, 1, this.width * this.sketch.scale, this.height * this.sketch.scale, 1);\r\n\t\t\tctx.stroke();\r\n\t\t\tctx.fill();\r\n\t\t\tctx.fillStyle = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Color;\r\n\t\t\tctx.font = `${_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Size}px ${_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Name}`;\r\n\t\t\tctx.fillText(this.controller.name, this.sketch.scale + (this.width * this.sketch.scale - this.layer.context.measureText(this.controller.name).width) / 2, (this.height * this.sketch.scale + ctx.measureText('Z').width) / 2 + 1);\r\n            ctx.font = `${_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont.Size-2}px monospace`;\r\n\t\t\tfor (let n = 0;n < this.controller.ipc;n++) {\r\n                const flag = this.if[n] || '';\r\n                ctx.fillText(flag, this.sketch.scale * 1.3 , (_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelVPadding + n) * this.sketch.scale + ctx.measureText('Z').width / 2 + 1);\r\n\t\t\t\tctx.strokeRect(0, (_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelVPadding + n) * this.sketch.scale + 1, this.sketch.scale - 1, 0);\r\n\t\t\t}\r\n\t\t\tfor (let n = 0;n < this.controller.opc;n++) {\r\n                const flag = this.of[n] || '';\r\n                ctx.fillText(flag, (this.width + 1) * this.sketch.scale - this.sketch.scale * .3 - ctx.measureText(flag).width, (_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelVPadding + n) * this.sketch.scale + ctx.measureText('Z').width / 2 + 1);\r\n\t\t\t\tctx.strokeRect((this.width + 1) * this.sketch.scale, (_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockLabelVPadding + n) * this.sketch.scale + 1, this.sketch.scale - 1, 0);\r\n\t\t\t}\r\n\t\t\treturn osc;\r\n\t\t};\r\n\t\tthis.figure \t= this.update();\r\n\t\t// positional variables\r\n\t\tthis.dragged  \t= {state: false, x: null, y: null, px: null, py: null};\r\n\t}\r\n\ttick() {\r\n\t\tlet { dragged, x, y, width, height, mousepos, sketch } = this;\r\n\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x > sketch.x + x * sketch.scale && _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x < sketch.x + x * sketch.scale + width * sketch.scale) {\r\n\t\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y > sketch.y + y * sketch.scale && _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y < sketch.y + y * sketch.scale + height * sketch.scale) {\r\n\t\t\t\tthis.hovered = true;\r\n\t\t\t} else {\r\n\t\t\t\tthis.hovered = false;\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tthis.hovered = false;\r\n\t\t}\r\n\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft'] && !dragged.state && this.hovered && (sketch.ablock == this || sketch.ablock == null)) {\r\n\t\t\tsketch.ablock = this;\r\n\t\t\tdragged.x = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x;\r\n\t\t\tdragged.y = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y;\r\n\t\t\tdragged.px = x;\r\n\t\t\tdragged.py = y;\r\n\t\t\tdragged.state = true;\r\n\t\t}\r\n\t\tif (!_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft']) {\r\n\t\t\tif (dragged.state) {\r\n\t\t\t\tif (x >= sketch.width || x < 0 || y >= sketch.height || y < 0 || x + width + 2 > sketch.width || y + height > sketch.height) {\r\n\t\t\t\t\tthis.x = dragged.px;\r\n\t\t\t\t\tthis.y = dragged.py;\r\n\t\t\t\t}\r\n\t\t\t\tsketch.ablock = null;\r\n\t\t\t\tthis.dragged = {state: false, x: null, y: null, px: null, py: null};\r\n\t\t\t}\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tif (dragged.state) {\r\n\t\t\tthis.x = dragged.px + Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - dragged.x) / sketch.scale);\r\n\t\t\tthis.y = dragged.py + Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - dragged.y) / sketch.scale);\r\n\t\t}\r\n\t}\r\n\trender(context) {\r\n\t\tlet { figure, sketch, x, y } = this;\r\n\t\tcontext.drawImage(figure, sketch.x + x * sketch.scale, sketch.y + y * sketch.scale - 1);\r\n\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].keydown['Control']) {\r\n\t\t\tcontext.fillStyle = \"#888\";\r\n\t\t\tif (((((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - (sketch.x + (x + 1) * sketch.scale + sketch.scale / 3)) ** 2 + (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - (sketch.y + y * sketch.scale + sketch.scale / 3))) ** 2) ** 0.5 <= sketch.scale / 1.5)) {\r\n\t\t\t\tcontext.fillStyle = \"#f44336\";\r\n\t\t\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright']) {\r\n\t\t\t\t\tthis.delete();\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\tcontext.strokeStyle = \"#fff\";\r\n\t\t\tcontext.lineWidth = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockBorderWidth;\r\n\t\t\tcontext.roundRect(sketch.x + (x + 1) * sketch.scale, sketch.y + y * sketch.scale, sketch.scale / 1.5, sketch.scale / 1.5, 0);\r\n\t\t\tcontext.fill();\r\n\t\t\tcontext.beginPath();\r\n\t\t\tcontext.lineWidth = 1;\r\n\t\t\tcontext.moveTo(sketch.x + (x + 1) * sketch.scale, sketch.y + y * sketch.scale);\r\n\t\t\tcontext.lineTo(sketch.x + (x + 1) * sketch.scale + sketch.scale / 1.5, sketch.y + y * sketch.scale + sketch.scale / 1.5);\r\n\t\t\tcontext.moveTo(sketch.x + (x + 1) * sketch.scale, sketch.y + y * sketch.scale + sketch.scale / 1.5);\r\n\t\t\tcontext.lineTo(sketch.x + (x + 1) * sketch.scale + sketch.scale / 1.5, sketch.y + y * sketch.scale);\r\n\t\t\tcontext.stroke();\r\n\t\t}\r\n\t}\r\n\temit(i, v) {\r\n\t\tthis.controller.emit(i, v);\r\n\t}\r\n\treset() {\r\n\t\t// important\r\n\t}\r\n\tdelete() {\r\n\t\tthis.nodes.forEach(n => {\r\n\t\t\tn.delete(true);\r\n\t\t});\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].blocks = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].blocks.filter(b => b !== this);\r\n\t\tthis.remove();\r\n\t}\r\n}\n\n//# sourceURL=webpack:///./src/View/Block.View.js?");

/***/ }),

/***/ "./src/View/Node.View.js":
/*!*******************************!*\
  !*** ./src/View/Node.View.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Node; });\n/* harmony import */ var _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lib/basix.js */ \"./src/Lib/basix.js\");\n/* harmony import */ var _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Controller/Node.Controller.js */ \"./src/Controller/Node.Controller.js\");\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../linkuage.js */ \"./src/linkuage.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass Node extends _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Element {\r\n\tconstructor(sketch, attached = null, x, y, ghost = false) {\r\n\t\tsuper({x, y, layer: 'Sketch'});\r\n\t\tthis.sketch \t= sketch;\r\n\t\tthis.attached \t= attached;\r\n\t\tthis.ghost \t\t= ghost;\r\n\t\tthis.sketch.nodes.push(this);\r\n\t\tthis.merge \t\t= node => {\r\n\t\t\tdelete this.controller\r\n\t\t\tthis.controller = node;\r\n\t\t\tnode.flesh\t= this;\r\n\t\t}\r\n\t\tthis.merge(new _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]());\r\n\t\tthis.update = (color = \"#ccc\") => {\r\n\t\t\tlet osc = new OffscreenCanvas((_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1) * 2, (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1) * 2);\r\n\t\t\tlet ctx = osc.getContext('2d');\r\n\t\t\tctx.fillStyle = '#555';\r\n\t\t\tctx.strokeStyle = color;\r\n\t\t\tctx.beginPath();\r\n\t\t\tctx.lineWidth = 1;\r\n\t\t\tctx.arc(_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1, _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1, _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius, 0, Math.PI * 2);\r\n\t\t\tif (!this.ghost)\r\n\t\t\t\tctx.fill();\r\n\t\t\tctx.stroke();\r\n\t\t\treturn osc;\r\n\t\t};\r\n\t\tthis.figure \t= this.update();\r\n\t\t// positional variables\r\n\t\tthis.dragged  \t= {state: false, x: null, y: null, px: null, py: null};\r\n\t\tthis.hovered   = false;\r\n\t\tthis.lock \t\t= false;\r\n\t\tthis.rs  \t\t= true;\r\n\t}\r\n\ttick() {\r\n\t\tlet { figure, attached, sketch, x, y } = this;\r\n\t\tlet rx, ry;\r\n\t\tif (attached) {\r\n\t\t\tif (attached.io == 'IN')\r\n\t\t\t\trx = sketch.x + attached.block.x  * sketch.scale;\r\n\t\t\telse\r\n\t\t\t\trx = sketch.x + (attached.block.x + attached.block.width + 2) * sketch.scale;\r\n\t\t\try = sketch.y + (attached.block.y + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.BlockLabelVPadding + attached.index) * sketch.scale;\r\n\t\t} else {\r\n\t\t\trx = sketch.x + x * sketch.scale;\r\n\t\t\try = sketch.y + y * sketch.scale;\r\n\t\t}\r\n\t\tif (!this.ghost) {\r\n\t\t\tif (((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - rx) ** 2 + (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - ry) ** 2) ** 0.5 <= _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1) {\r\n\t\t\t\tif (!this.hovered) {\r\n\t\t\t\t\tthis.figure = this.update('#2ecc71');\r\n\t\t\t\t\tthis.rs = false;\r\n\t\t\t\t}\r\n\t\t\t\tthis.hovered = true;\r\n\t\t\t} else {\r\n\t\t\t\tif (this.sketch.anode != this && !this.rs) {\r\n\t\t\t\t\tthis.figure = this.update();\r\n\t\t\t\t\tthis.rs = true;\r\n\t\t\t\t}\r\n\t\t\t\tthis.hovered = false;\r\n\t\t\t}\r\n\t\t\tif (!this.lock && this.hovered && _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft']) {\r\n\t\t\t\tif (this.sketch.anode == null)\r\n\t\t\t\t\tthis.sketch.anode = this;\r\n\t\t\t}\r\n\t\t\tif (this.hovered && _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright'] && _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].keydown['Control']) {\r\n\t\t\t\tthis.delete();\r\n\t\t\t}\r\n\t\t}\r\n\t\tthis.lock = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft'];\r\n\t}\r\n\trender(context) {\r\n\t\tlet { figure, attached, sketch, x, y, hovered } = this;\r\n\t\tif (attached) {\r\n\t\t\tif (attached.io == 'IN') {\r\n\t\t\t\tcontext.drawImage(figure, sketch.x + attached.block.x  * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1), sketch.y + (attached.block.y + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.BlockLabelVPadding + attached.index) * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1));\r\n\t\t\t} else {\r\n\t\t\t\tcontext.drawImage(figure, sketch.x + (attached.block.x + attached.block.width + 2) * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1), sketch.y + (attached.block.y + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.BlockLabelVPadding + attached.index) * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1));\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tcontext.drawImage(figure, sketch.x + x * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1), sketch.y + y * sketch.scale - (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.NodeRadius + 1));\r\n\t\t}\r\n\t\tcontext.strokeStyle = _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireColor;\r\n\t\tcontext.beginPath();\r\n\t\tthis.controller.slaves.forEach(node => {\r\n\t\t\tcontext.lineWidth = _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireWidth;\r\n\t\t\tlet start = {x, y}, target = {x: node.flesh.x, y: node.flesh.y}, center = {};\r\n\t\t\tif (attached)\r\n\t\t\t\tstart = {x: attached.block.x + (attached.io == 'IN' ? 0 : (attached.block.width + 2)), y: attached.block.y + attached.index + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.BlockLabelVPadding};\r\n\t\t\tcontext.moveTo(sketch.x + start.x * sketch.scale, sketch.y + start.y * sketch.scale);\r\n\t\t\tif (node.flesh.attached) \r\n\t\t\t\ttarget = {x: node.flesh.attached.block.x + (node.flesh.attached.io == 'IN' ? 0 : (node.flesh.attached.block.width + 2)), y: node.flesh.attached.block.y + node.flesh.attached.index + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.BlockLabelVPadding};\r\n\t\t\tcontext.lineTo(sketch.x + target.x * sketch.scale, sketch.y + target.y * sketch.scale);\r\n\t\t\tcontext.stroke();\r\n\t\t\tcenter.x = sketch.x + (start.x + target.x) * sketch.scale / 2;\r\n\t\t\tcenter.y = sketch.y + (start.y + target.y) * sketch.scale / 2;\r\n\t\t\tlet angle = -Math.atan2((start.x - target.x) * sketch.scale, (start.y - target.y) * sketch.scale) * 180 / Math.PI;\r\n\t\t\tif (angle < 0) {\r\n\t\t\t\tangle = 180 - (-180 - angle)\r\n\t\t\t}\r\n\t\t\tangle = -angle / (180 / Math.PI);\r\n\t\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].keydown['Control']) {\r\n\t\t\t\tcontext.beginPath();\r\n\t\t\t\tlet vx = center.x + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize / 2 * Math.sin(angle);\r\n\t\t\t\tlet vy = center.y + _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize / 2 * Math.cos(angle);\r\n\t\t\t\tif (((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - vx) ** 2 + (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - vy) ** 2) ** 0.5 <= _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize) {\r\n\t\t\t\t\tcontext.strokeStyle = \"#f44336\";\r\n\t\t\t\t\tif (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright']) {\r\n\t\t\t\t\t\t_Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].disconnect(this.controller, node);\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\tcontext.arc(vx, vy, _linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize, 0, Math.PI * 2);\r\n\t\t\t\tcontext.stroke();\r\n\t\t\t}\r\n\t\t\tcontext.beginPath();\r\n\t\t\t// context.lineWidth = 0.6;\r\n\t\t\tcontext.moveTo(center.x, center.y);\r\n\t\t\tcontext.lineTo(center.x + (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize * Math.sin(angle + 0.6)), center.y + (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize * Math.cos(angle + 0.6)));\r\n\t\t\tcontext.moveTo(center.x, center.y);\r\n\t\t\tcontext.lineTo(center.x + (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize * Math.sin(angle - 0.6)), center.y + (_linkuage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].config.WireArrowSize * Math.cos(angle - 0.6)));\r\n\t\t\tcontext.stroke();\r\n\t\t});\r\n\t}\r\n\tconnect(node) {\r\n\t\t_Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].connect(this.controller, node.controller);\r\n\t}\r\n\tdisconnect(node) {\r\n\t\t_Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].disconnect(this.controller, node.controller);\r\n\t}\r\n\tdelete(hard = false) {\r\n\t\tif (this.attached && !hard) return;\r\n\t\tthis.controller.slaves.forEach(slave => {\r\n\t\t\t_Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].disconnect(this.controller, slave);\r\n\t\t});\r\n\t\tthis.controller.masters.forEach(master => {\r\n\t\t\t_Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].disconnect(master, this.controller);\r\n\t\t});\r\n\t\tthis.sketch.nodes = this.sketch.nodes.filter(n => n !== this);\r\n\t\tthis.remove();\r\n\t}\r\n}\n\n//# sourceURL=webpack:///./src/View/Node.View.js?");

/***/ }),

/***/ "./src/View/Sketch.View.js":
/*!*********************************!*\
  !*** ./src/View/Sketch.View.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Sketch; });\n/* harmony import */ var _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lib/basix.js */ \"./src/Lib/basix.js\");\n/* harmony import */ var _Node_View_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Node.View.js */ \"./src/View/Node.View.js\");\n/* harmony import */ var _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Controller/Node.Controller.js */ \"./src/Controller/Node.Controller.js\");\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../linkuage.js */ \"./src/linkuage.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].layers.add({\r\n   name: 'Sketch',\r\n   // monitor: true,\r\n   background: '#fff',\r\n   alpha: true,\r\n   tps: 120,\r\n   height: window.innerHeight - 29\r\n});\r\n\r\n_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].layers.list['Sketch'].context.font = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.BlockFont;\r\n\r\n// loading resources\r\n_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].resources.insert.sound('beep', './beep.mp3');\r\n_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].resources.load();\r\n\r\nclass Sketch extends _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Element {\r\n   constructor(x, y, width, height, scale = 10) {\r\n      super({x, y, layer: 'Sketch', z: -1});\r\n      this.width     = width;\r\n      this.height    = height;\r\n      this.scale     = scale;\r\n      this.map       = new Array(width);\r\n      this.mousepos  = {x: null, y: null};\r\n      this.nodes     = [];\r\n      this.anode     = null;\r\n      this.ablock    = null;\r\n      this.ghost     = new _Node_View_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this, null, 0, 0, true);\r\n      this.grid      = true;\r\n      this.ghost.visible = false;\r\n      for (let i = 0;i < height;i++) this.map[i] = new Array(height);\r\n      this.update    = () => {\r\n         let osc = new OffscreenCanvas(this.width * this.scale, this.height * this.scale);\r\n         let ctx = osc.getContext('2d');\r\n         ctx.strokeStyle = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.GridLineColor;\r\n         ctx.lineWidth = _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.GridLineWidth;\r\n         ctx.beginPath();\r\n         if (this.grid) {\r\n            for (let i = 0;i <= this.width;i++) {\r\n               ctx.moveTo(i * this.scale, 0);\r\n               ctx.lineTo(i * this.scale, this.height * this.scale);\r\n            }\r\n            for (let j = 0;j <= this.height;j++) {\r\n               ctx.moveTo(0, j * this.scale);\r\n               ctx.lineTo(this.width * this.scale, j * this.scale);\r\n            }\r\n         }\r\n         ctx.stroke();\r\n         return osc;\r\n      };\r\n      this.figure = this.update();\r\n      // positional variables\r\n      this.dragged   = {state: false, x: null, y: null};\r\n      this.lock   = false;\r\n   }\r\n   tick() {\r\n      let { dragged, x, y, width, height, scale, mousepos } = this;\r\n      if (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright'] && !dragged.state) {\r\n         dragged.x = x - _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x;\r\n         dragged.y = y - _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y;\r\n         dragged.state = true;\r\n      }\r\n      if (!_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright'])\r\n         dragged.state = false;\r\n      if (dragged.state) {\r\n         this.x = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x + dragged.x;\r\n         this.y = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y + dragged.y;\r\n      }\r\n      if (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x >= x &&\r\n          _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x <= x + width * scale &&\r\n          _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y >= y &&\r\n          _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y <= y + height * scale) {\r\n         mousepos.x = Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - x) / scale);\r\n         mousepos.y = Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - y) / scale);\r\n      } else {\r\n         mousepos    = {x: null, y: null};\r\n      }\r\n      if (this.anode) {\r\n         this.ghost.visible = true;\r\n         this.ghost.x = Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.x - x + scale / 2) / scale);\r\n         this.ghost.y = Math.floor((_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mouse.y - y + scale / 2) / scale);\r\n         if (!this.anode.controller.slaves.includes(this.ghost.controller)) {\r\n            _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].connect(this.anode.controller, this.ghost.controller);\r\n         }\r\n      }\r\n      if (this.anode) {\r\n         if (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseright']) {\r\n            _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].disconnect(this.anode.controller, this.ghost.controller);\r\n            this.anode = null;\r\n            this.ghost.visible = false;\r\n         }\r\n         if (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft'] && !this.lock) {\r\n            let f = false, temp;\r\n            // console.log(this.nodes);\r\n            this.nodes.forEach(node => {\r\n               let x, y;\r\n               if (node.attached) {\r\n                  if (node.attached.io == 'IN') {\r\n                     x = node.attached.block.x;\r\n                     y = node.attached.block.y + node.attached.index + 1;\r\n                  } else {\r\n                     x = node.attached.block.x + node.attached.block.width + 2;\r\n                     y = node.attached.block.y + node.attached.index + 1;\r\n                  }\r\n               } else {\r\n                  x = node.x;\r\n                  y = node.y;\r\n               }\r\n               // console.log({x, y}, this.ghost)\r\n               if (x == this.ghost.x && y == this.ghost.y && !node.ghost) {\r\n                  f = node;\r\n               }\r\n            });\r\n            if (f)\r\n               temp = f;\r\n            else \r\n               temp = new _Node_View_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this, null, this.ghost.x, this.ghost.y);\r\n            if (temp == this.anode) return;\r\n            _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].disconnect(this.anode.controller, this.ghost.controller);\r\n            _Controller_Node_Controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].connect(this.anode.controller, temp.controller);\r\n            setTimeout(() => {\r\n               this.anode = null;\r\n               if (_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].keydown['Control']) {\r\n                  this.anode = temp;\r\n               }\r\n            });\r\n            this.ghost.visible = false;\r\n         }\r\n      }\r\n      this.lock = _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mousedown['mouseleft'];\r\n   }\r\n   render(context) {\r\n      let { figure, x, y } = this;\r\n      context.drawImage(figure, x, y);\r\n      context.lineWidth = 0.08\r\n      context.roundRect(x, y, this.width * this.scale, this.height * this.scale, 1);\r\n      context.stroke();\r\n   }\r\n}\n\n//# sourceURL=webpack:///./src/View/Sketch.View.js?");

/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/*! exports provided: AND, NAND, OR, XOR, CONCAT, SUBTRACT, SUM, MULTIPLY, DIVIDE, COMPARE, NEGATE, ABS, ONCE, NOT, DELAY, REGISTER, COUNTER, ITERATOR, GATE, EXPONENT, ROOT, INT, STR, INPUT, PRINT, DISPLAY, CONST, START, RANDOM, PULSE, END, BEEP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AND\", function() { return AND; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NAND\", function() { return NAND; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OR\", function() { return OR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"XOR\", function() { return XOR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CONCAT\", function() { return CONCAT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SUBTRACT\", function() { return SUBTRACT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SUM\", function() { return SUM; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MULTIPLY\", function() { return MULTIPLY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DIVIDE\", function() { return DIVIDE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COMPARE\", function() { return COMPARE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NEGATE\", function() { return NEGATE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ABS\", function() { return ABS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ONCE\", function() { return ONCE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NOT\", function() { return NOT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DELAY\", function() { return DELAY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"REGISTER\", function() { return REGISTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COUNTER\", function() { return COUNTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ITERATOR\", function() { return ITERATOR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GATE\", function() { return GATE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EXPONENT\", function() { return EXPONENT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ROOT\", function() { return ROOT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"INT\", function() { return INT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"STR\", function() { return STR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"INPUT\", function() { return INPUT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PRINT\", function() { return PRINT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DISPLAY\", function() { return DISPLAY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CONST\", function() { return CONST; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START\", function() { return START; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RANDOM\", function() { return RANDOM; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PULSE\", function() { return PULSE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"END\", function() { return END; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BEEP\", function() { return BEEP; });\n/* harmony import */ var _Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lib/basix.js */ \"./src/Lib/basix.js\");\n/* harmony import */ var _View_Sketch_View_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./View/Sketch.View.js */ \"./src/View/Sketch.View.js\");\n/* harmony import */ var _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./View/Block.View.js */ \"./src/View/Block.View.js\");\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./linkuage.js */ \"./src/linkuage.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH = new _View_Sketch_View_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](50, 50, 120, 100, _linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].config.GridScale);\r\n\r\nclass AND extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'And', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, parseInt(temp[0]) && parseInt(temp[1]));\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass NAND extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Nand', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, !(temp[0] && temp[1]));\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass OR extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Or', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] || temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass XOR extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Xor', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] ^ temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass CONCAT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Concat', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] + \"\" + temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass SUBTRACT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Subtract', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] - temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass SUM extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Sum', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, parseInt(temp[0]) + parseInt(temp[1]));\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass MULTIPLY extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Multiply', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] * temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass DIVIDE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Divide', 2, 1);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tthis.emit(0, temp[0] / temp[1]);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass COMPARE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Compare', 2, 3, [], ['E', 'G', 'S']);\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.pins[i] = v;\r\n\t\tif (!this.pins.includes(null)) {\r\n\t\t\tlet temp = this.pins;\r\n\t\t\tthis.reset();\r\n\t\t\tif (temp[0] == temp[1]) {\r\n\t\t\t\tthis.emit(1, temp[0]);\r\n\t\t\t} else if (temp[0] > temp[1]) {\r\n\t\t\t\tthis.emit(0, temp[0]);\r\n\t\t\t} else {\r\n\t\t\t\tthis.emit(2, temp[1]);\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.pins = [null, null];\r\n\t}\r\n}\r\n\r\nclass NEGATE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Negate', 1, 1);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, -v);\r\n\t}\r\n}\r\n\r\nclass ABS extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Abs', 1, 1);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, Math.abs(v));\r\n\t}\r\n}\r\n\r\nclass ONCE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Once ◻', 1, 1);\r\n\t\tthis.flag = false;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tif (!this.flag) {\r\n\t\t\tthis.emit(0, v);\r\n\t\t\tthis.flag = true;\r\n\t\t\tthis.controller.name = 'Once ◼';\r\n\t\t\tthis.figure = this.update();\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.controller.name = 'Once ◻';\r\n\t\tthis.figure = this.update();\r\n\t\tthis.flag = false;\r\n\t}\r\n}\r\n\r\nclass NOT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Not', 1, 1);\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, (v ? 0 : 1));\r\n\t}\r\n}\r\n\r\nclass DELAY extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, d = 500) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Delay [${d}ms]`, 1, 1);\t\r\n\t\tthis.delay = d;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.timer = setTimeout(() => {\r\n\t\t\tthis.emit(0, v);\r\n\t\t}, this.delay);\r\n\t}\r\n\treset() {\r\n\t\tclearTimeout(this.timer);\r\n\t}\r\n}\r\n\r\nclass REGISTER extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, v = null) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Register [${v}]`, 2, 1, ['S', 'R']);\r\n\t\tthis.value = v;\r\n        this.default = v;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tif (i == 0) {\r\n\t\t\tthis.value = v;\r\n\t\t\tthis.controller.name = `Register [${this.value}]`;\r\n\t\t\tthis.figure = this.update();\r\n\t\t} else {\r\n\t\t\tthis.emit(0, this.value);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.value = this.default;\r\n        this.controller.name = `Register [${this.default}]`;\r\n        this.figure = this.update();\r\n\t}\r\n}\r\n\r\nclass COUNTER extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, l = Infinity, s = 1) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Counter / ${l}`, 1, 2, [], ['+', 'F']);\r\n\t\tthis.limit = l;\r\n\t\tthis.step = s;\r\n\t\tthis.value = 0;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.value += this.step;\r\n\t\tif (this.value >= this.limit) {\r\n\t\t\tthis.value = 0;\r\n\t\t\tthis.emit(1, true);\r\n\t\t} else {\r\n\t\t\tthis.emit(0, this.value);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.value = 0;\r\n\t}\r\n}\r\n\r\nclass ITERATOR extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Iterator`, 1, 1, ['I']);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tfor (let x = 0;x < v;x++) {\r\n\t\t\tthis.emit(0, x);\r\n\t\t}\r\n\t}\r\n}\r\n\r\nclass GATE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, l = 8) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Gate (${l})`, 1, 1);\r\n\t\tthis.loop = l;\r\n\t\tthis.index = 0;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tif (this.index < this.loop) {\r\n\t\t\tthis.index++;\r\n\t\t\tthis.emit(0, v);\r\n\t\t}\r\n\t}\r\n\treset() {\r\n\t\tthis.index = 0;\r\n\t}\r\n}\r\n\r\nclass EXPONENT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, p = 2) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Exponent [${p}]`, 1, 1);\r\n\t\tthis.power = p;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, v ** this.power);\r\n\t}\r\n}\r\n\r\nclass ROOT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, d = 2) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Root [${d}]`, 1, 1);\r\n\t\tthis.degree = d;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, v ** (1 / this.degree));\r\n\t}\r\n}\r\n\r\nclass INT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Int`, 1, 1);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, +v);\r\n\t}\r\n}\r\n\r\nclass STR extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Str`, 1, 1);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.emit(0, v + '');\r\n\t}\r\n}\r\n\r\nclass INPUT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, l = 'input : ') {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Input`, 1, 1);\r\n\t\tthis.label = l;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tconst p = prompt(this.label);\r\n\t\tthis.emit(0, p);\r\n\t}\r\n}\r\n\r\nclass PRINT extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'Print', 1, 0);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tconsole.log('[Print] :', v);\r\n\t}\r\n}\r\n\r\nclass DISPLAY extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, l = 15) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, 'O'.repeat(l), 1, 0);\r\n\t\tthis.length = l;\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\tthis.controller.name = v;\r\n\t\tthis.figure = this.update();\r\n\t}\r\n\treset() {\r\n\t\tthis.controller.name = 'O'.repeat(this.length);\r\n\t\tthis.figure = this.update();\r\n\t}\r\n}\r\n\r\nclass CONST extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, v = 5, p = 0) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Const [${v}]`, 0, 1);\r\n\t\tthis.value = v;\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].starts.push(this);\r\n\t\tthis.priority = p;\r\n\t}\r\n\ttrigger() {\r\n\t\tthis.emit(0, this.value);\r\n\t}\r\n}\r\n\r\nclass START extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, p) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Start`, 0, 1);\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].starts.push(this);\r\n\t\tthis.priority = p;\r\n\t}\r\n\ttrigger() {\r\n\t\tthis.emit(0, true);\r\n\t}\r\n}\r\n\r\nclass RANDOM extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, p) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Random`, 0, 1);\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].starts.push(this);\r\n\t\tthis.priority = p;\r\n\t}\r\n\ttrigger() {\r\n\t\tthis.emit(0, Math.random());\r\n\t}\r\n}\r\n\r\nclass PULSE extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y, i = 300, p = 0) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Pulse [${i}ms]`, 0, 1);\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].starts.push(this);\r\n\t\tthis.priority = p;\r\n\t\tthis.interval = i;\r\n\t}\r\n\ttrigger() {\r\n\t\tthis.timer = setInterval(() => {\r\n\t\t\tthis.emit(0, true);\r\n\t\t}, this.interval);\r\n\t}\r\n\treset() {\r\n\t\tclearInterval(this.timer);\r\n\t}\r\n}\r\n\r\nclass END extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `End`, 1, 0);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\talert(`Program Ended [Final Value : ${v}]`);\r\n\t\tdocument.querySelector('#stop').onclick();\r\n\t}\r\n}\r\n\r\nclass BEEP extends _View_Block_View_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\tconstructor(x, y) {\r\n\t\tsuper(_linkuage_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].SKETCH, x, y, `Beep`, 1, 0);\r\n\t}\r\n\tcollect(i, v, o) {\r\n\t\t_Lib_basix_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].resources.list.sfx['beep'].play();\r\n\t}\r\n}\n\n//# sourceURL=webpack:///./src/blocks.js?");

/***/ }),

/***/ "./src/bootstrap.js":
/*!**************************!*\
  !*** ./src/bootstrap.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _linkuage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linkuage.js */ \"./src/linkuage.js\");\n/* harmony import */ var _blocks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blocks.js */ \"./src/blocks.js\");\n\r\n\r\n\r\ndocument.querySelector('#search').oninput = function() {\r\n\tlet key = this.value.toUpperCase();\r\n\tconst list = Object.keys(_blocks_js__WEBPACK_IMPORTED_MODULE_1__).sort().filter(v => v.indexOf(key) > -1);\r\n\tdocument.querySelector('#blocks').innerHTML = '';\r\n\tfor (let block of list) {\r\n\t\tconst li = document.createElement('li');\r\n\t\tli.setAttribute('class', 'add');\r\n\t\tli.setAttribute('data-name', block.toUpperCase());\r\n\t\tli.innerHTML = `<ion-icon class='button' name=\"cube\"></ion-icon>${block}`\r\n\t\tdocument.querySelector('#blocks').appendChild(li);\r\n\t\tli.onclick = function() {\r\n\t\t\tconst v = prompt('Value : ');\r\n\t\t\tnew _blocks_js__WEBPACK_IMPORTED_MODULE_1__[this.getAttribute('data-name')](0, 0, v);\r\n\t\t\tdocument.querySelector('.blocks').classList.toggle('hide');\r\n\t\t};\r\n\t}\r\n}; document.querySelector('#search').oninput();\r\n\r\nconsole.log(_blocks_js__WEBPACK_IMPORTED_MODULE_1__);\r\n\r\n// toolbar buttons function\r\ndocument.querySelector('#run').onclick = function() {\r\n\tthis.classList.add(\"active\");\r\n\tdocument.getElementById('stop').classList.remove(\"active\");\r\n\tdocument.getElementById('pause').classList.remove(\"active\");\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pause = false;\r\n\tif (!_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].running) {\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].running = true;\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].starts.sort(function(a, b) {\r\n\t\t\tif (a.priority < b.priority) return -1;\r\n\t\t\treturn 1;\r\n\t\t});\r\n\t\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].starts.forEach(s => {\r\n\t\t\ts.trigger();\r\n\t\t});\r\n\t}\r\n}\r\n\r\ndocument.querySelector('#pause').onclick = function() {\r\n\tthis.classList.add(\"active\");\r\n\tdocument.getElementById('stop').classList.remove(\"active\");\r\n\tdocument.getElementById('run').classList.remove(\"active\");\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pause = true;\r\n}\r\n\r\ndocument.querySelector('#stop').onclick = function() {\r\n\tthis.classList.add(\"active\");\r\n\tdocument.getElementById('run').classList.remove(\"active\");\r\n\tdocument.getElementById('pause').classList.remove(\"active\");\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].running = false;\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].blocks.forEach(b => {\r\n\t\tb.reset();\r\n\t});\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pause = false;\r\n}; document.querySelector('#stop').onclick();\r\n\r\n/* key bindings */\r\ndocument.onkeydown = e => {\r\n\tswitch (_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].config.KeyBinding[e.code]) {\r\n\t\t\tcase 'RunPauseToggle':\r\n\t\t\t\tif (_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].running) {\r\n\t\t\t\t\tif (_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pause) {\r\n\t\t\t\t\t\tdocument.querySelector('#run').onclick();\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tdocument.querySelector('#pause').onclick();\r\n\t\t\t\t\t}\r\n\t\t\t\t} else {\r\n\t\t\t\t\tdocument.querySelector('#run').onclick();\r\n\t\t\t\t}\r\n\t\t\t\tbreak;\r\n\t\t\tcase 'Stop':\r\n\t\t\t\tdocument.querySelector('#stop').onclick();\r\n\t\t\t\tbreak;\r\n\t\t\tcase 'OpenBlocksList':\r\n\t\t\t\tdocument.querySelector('.blocks #close').onclick();\r\n\t\t\t\tbreak;\r\n\t}\r\n}\r\n\r\ndocument.querySelector('.blocks #close').onclick = document.querySelector('#addblock').onclick = function() {\r\n\tdocument.querySelector('#search').focus();\r\n\tdocument.querySelector('.blocks').classList.toggle('hide');\r\n\tsetTimeout(() => {\r\n\t\tdocument.querySelector('#search').value = '';\r\n\t\tdocument.querySelector('#search').oninput();\r\n\t}, 0);\r\n};\r\n\r\ndocument.querySelector('#gridtoggle').onclick = function() {\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SKETCH.grid = !_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SKETCH.grid;\r\n\t_linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SKETCH.figure = _linkuage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SKETCH.update();\r\n\tthis.classList.toggle('active');\r\n}\n\n//# sourceURL=webpack:///./src/bootstrap.js?");

/***/ }),

/***/ "./src/linkuage.js":
/*!*************************!*\
  !*** ./src/linkuage.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n/**\r\n * Copyright (c) 2020\r\n *\r\n * @summary create Linkuage namespace and store configuration for environment\r\n * @author somebie <soomebie@gmail.com>\r\n *\r\n */\r\n\r\nconst Linkuage \t= {};\r\n\r\n// flow states\r\nLinkuage.running \t= false;\r\nLinkuage.pause \t= false;\r\n\r\n// store all Start blocks\r\nLinkuage.starts \t= [];\r\n\r\n// store all blocks\r\nLinkuage.blocks \t= [];\r\n\r\n// debuge mode\r\nLinkuage.debuge \t= true;\r\n\r\n// Linkuage UI configuration\r\nLinkuage.config = {\r\n\tTheme\t\t\t\t\t: '#2ecc71',\r\n\tBlockBorderWidth\t\t: 0.3, \t// in pixel\r\n\tBlockLabelHPadding\t\t: 5,  \t// in tile\r\n    BlockLabelVPadding      : 1,    // in tile\r\n\tBlockFillColor\t\t\t: '#fff',\r\n\tBlockStrokeColor\t\t: '#000',\r\n\tBlockFont\t\t\t\t: {\r\n        Size: '10', // in pixel\r\n        Name: 'Recursive',\r\n        Color: '#000'\r\n    },\r\n\tWireWidth\t\t\t\t: .4,\t// in pixel\r\n\tWireColor\t\t\t\t: '#212121',\r\n\tWireArrowSize\t\t\t: 5,\r\n\tNodeRadius \t\t\t\t: 3,\r\n\tGridScale\t\t\t    : 12,\t// in pixel\r\n    GridLineWidth           : 0.1,  // in pixel\r\n\tGridLineColor\t\t\t: '#000',\r\n\tFlowDelay \t\t\t\t: 0,\r\n\tKeyBinding \t\t\t\t: {\r\n\t\t'Space'\t\t: 'RunPauseToggle',\r\n\t\t'Escape'\t: 'Stop',\r\n\t\t'Backquote'\t: 'OpenBlocksList'\r\n\t}\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Linkuage);\n\n//# sourceURL=webpack:///./src/linkuage.js?");

/***/ })

/******/ });