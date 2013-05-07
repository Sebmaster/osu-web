﻿(function (f) {
	function n(a) { this.name = a.name; this.__defineSetter__("code", function () { }) } function q(a, c) { var b = c; c[0] != g && (b = a, b = a != g ? b + (g + c) : b + c); for (var b = b.split(g), d = 0; d < b.length; ++d) ".." == b[d] && (b[d - 1] = "", b[d] = ""); b = b.filter(function (a) { return a }).join(g); b[0] != g && (b = g + b); b = b.replace(/\.\//g, g); b = b.replace(/\/\//g, g); b = b.replace(/\/\./g, g); b[b.length - 1] == g && b != g && (b = b.substring(0, b.length - 1)); return b } function r(a) {
		var c = null; this.size = a.size || 0; this.name = a.name || ""; this.type = a.type || ""; this.__defineGetter__("blob_",
		function () { return c }); this.__defineSetter__("blob_", function (a) { c = a; this.size = c.size; this.name = c.name; this.type = c.type }.bind(this))
	} function w(a) {
		if (!a) throw Error("Expected fileEntry argument to write."); var c = 0, b = a.file_ ? a.file_.blob_ : null; this.__defineGetter__("position", function () { return c }); this.__defineGetter__("length", function () { return b ? b.size : 0 }); this.seek = function (a) { c = a; if (c > this.length) c = this.length; 0 > c && (c += this.length); 0 > c && (c = 0) }; this.truncate = function (a) {
			b = a < this.length ? b.slice(0,
			a) : new Blob([b, new Uint8Array(a - this.length)], { type: b.type }); c = 0; this.write(b)
		}; this.write = function (d) { if (!d) throw Error("Expected blob argument to write."); if (this.onwritestart) this.onwritestart(); if (b) { var e = b.slice(0, c), g = b.slice(c + d.size), f = c - e.size; 0 > f && (f = 0); b = new Blob([e, new Uint8Array(f), d, g], { type: b.type }) } else b = new Blob([d], { type: d.type }); a.file_.blob_ = b; h.put(a, function () { c += d.size; if (this.onwriteend) this.onwriteend() }.bind(this), this.onerror) }
	} function x(a) {
		var c = !1; this.readEntries =
		function (b, d) { if (!b) throw Error("Expected successCallback argument."); c ? b([]) : h.getAllEntries(a.fullPath, function (a) { c = !0; b(a) }, d) }
	} function p() { } function j(a) { var c = null; this.__defineGetter__("file_", function () { return c }); this.__defineSetter__("file_", function (a) { c = a }); this.__defineGetter__("isFile", function () { return !0 }); this.__defineGetter__("isDirectory", function () { return !1 }); if (a) this.file_ = a.file_, this.name = a.name, this.fullPath = a.fullPath, this.filesystem = a.filesystem } function i(a) {
		this.__defineGetter__("isFile",
		function () { return !1 }); this.__defineGetter__("isDirectory", function () { return !0 }); if (a) this.name = a.name, this.fullPath = a.fullPath, this.filesystem = a.filesystem
	} function y(a) { s = a == f.TEMPORARY ? "Temporary" : "Persistent"; this.name = (location.protocol + location.host).replace(/:/g, "_") + ":" + s; this.root = new i; this.root.fullPath = g; this.root.filesystem = this; this.root.name = "" } function k(a) {
		switch (a.target.errorCode) {
			case 12: console.log("Error - Attempt to open db with a lower version than the current one."); break;
			default: console.log("errorCode: " + a.target.errorCode)
		} console.log(a, a.code, a.message)
	} if (!f.requestFileSystem && !f.webkitRequestFileSystem) {
		var u = f.indexedDB || f.mozIndexedDB || f.msIndexedDB; f.TEMPORARY = 0; f.PERSISTENT = 1; if (void 0 === f.FileError) window.FileError = function () { }, FileError.prototype.prototype = Error.prototype; FileError.INVALID_MODIFICATION_ERR = 9; FileError.NOT_FOUND_ERR = 1; n.prototype = FileError.prototype; n.prototype.toString = Error.prototype.toString; var l = new n({
			code: FileError.INVALID_MODIFICATION_ERR,
			name: "INVALID_MODIFICATION_ERR"
		}), o = new n({ code: 1E3, name: "Not implemented" }), v = new n({ code: FileError.NOT_FOUND_ERR, name: "Not found" }), m = null, s = "temporary", h = { db: null }, g = "/", t = String.fromCharCode(g.charCodeAt(0) + 1); r.prototype.constructor = r; p.prototype = {
			name: null, fullPath: null, filesystem: null, copyTo: function () { throw o; }, getMetadata: function () { throw o; }, getParent: function () { throw o; }, moveTo: function () { throw o; }, remove: function (a, c) {
				if (!a) throw Error("Expected successCallback argument."); h.delete(this.fullPath,
				function () { a() }, c)
			}, toURL: function () { return "filesystem:" + (location.protocol + "//" + location.host) + g + s.toLowerCase() + this.fullPath }
		}; j.prototype = new p; j.prototype.constructor = j; j.prototype.createWriter = function (a) { a(new w(this)) }; j.prototype.file = function (a, c) { if (!a) throw Error("Expected successCallback argument."); if (null == this.file_) if (c) c(v); else throw v; else a(null == this.file_.blob_ ? this.file_ : this.file_.blob_) }; i.prototype = new p; i.prototype.constructor = i; i.prototype.createReader = function () { return new x(this) };
		i.prototype.getDirectory = function (a, c, b, d) { a = q(this.fullPath, a); h.get(a, function (e) { !0 === c.create && !0 === c.exclusive && e ? d && d(l) : !0 === c.create && !e ? (e = new i, e.name = a.split(g).pop(), e.fullPath = a, e.filesystem = m, h.put(e, b, d)) : !0 === c.create && e ? e.isDirectory ? b(new i(e)) : d && d(l) : (!c.create || !1 === c.create) && !e ? a == g ? (e = new i, e.name = "", e.fullPath = g, e.filesystem = m, b(e)) : d && d(l) : (!c.create || !1 === c.create) && e && e.isFile ? d && d(l) : b(new i(e)) }, d) }; i.prototype.getFile = function (a, c, b, d) {
			a = q(this.fullPath, a); h.get(a, function (e) {
				!0 ===
				c.create && !0 === c.exclusive && e ? d && d(l) : !0 === c.create && !e ? (e = new j, e.name = a.split(g).pop(), e.fullPath = a, e.filesystem = m, e.file_ = new r({ size: 0, name: e.name }), h.put(e, b, d)) : !0 === c.create && e ? e.isFile ? b(new j(e)) : d && d(l) : (!c.create || !1 === c.create) && !e ? d && d(l) : (!c.create || !1 === c.create) && e && e.isDirectory ? d && d(l) : b(new j(e))
			}, d)
		}; i.prototype.removeRecursively = function (a, c) { if (!a) throw Error("Expected successCallback argument."); this.remove(a, c) }; h.open = function (a, c, b) {
			var d = this, a = u.open(a.replace(":", "_"));
			a.onerror = b || k; a.onupgradeneeded = function (a) { d.db = a.target.result; d.db.onerror = k; d.db.objectStoreNames.contains("entries") || d.db.createObjectStore("entries") }; a.onsuccess = function (a) { d.db = a.target.result; d.db.onerror = k; c(a) }; a.onblocked = b || k
		}; h.close = function () { this.db.close(); this.db = null }; h.drop = function (a, c) { if (this.db) { var b = u.deleteDatabase(this.db.name); b.onsuccess = function (b) { a(b) }; b.onerror = c || k; h.close() } }; h.get = function (a, c, b) {
			if (this.db) {
				var d = this.db.transaction(["entries"], "readonly"),
				a = IDBKeyRange.bound(a, a + t, !1, !0), e = d.objectStore("entries").get(a); d.onabort = b || k; d.oncomplete = function () { c(e.result) }
			}
		}; h.getAllEntries = function (a, c, b) {
			if (this.db) {
				var d = [], e = null; a != g && (e = IDBKeyRange.bound(a + g, a + t, !1, !0)); var f = this.db.transaction(["entries"], "readonly"); f.onabort = b || k; f.oncomplete = function () { d = d.filter(function (b) { var c = b.fullPath.split(g).length, d = a.split(g).length; if (a == g && c < d + 1 || a != g && c == d + 1) return b }); c(d) }; f.objectStore("entries").openCursor(e).onsuccess = function (a) {
					if (a =
					a.target.result) { var b = a.value; d.push(b.isFile ? new j(b) : new i(b)); a.continue() }
				}
			}
		}; h.delete = function (a, c, b) { if (this.db) { var d = this.db.transaction(["entries"], "readwrite"); d.oncomplete = c; d.onabort = b || k; a = IDBKeyRange.bound(a, a + t, !1, !0); d.objectStore("entries").delete(a) } }; h.put = function (a, c, b) { if (this.db) { var d = this.db.transaction(["entries"], "readwrite"); d.onabort = b || k; d.oncomplete = function () { c(a) }; d.objectStore("entries").put(a, a.fullPath) } }; f.addEventListener("beforeunload", function () { h.db.close() },
		!1); f.requestFileSystem = function (a, c, b, d) { a != f.TEMPORARY && a != f.PERSISTENT && d ? d(l) : (m = new y(a, c), h.open(m.name, function () { b(m) }, d)) }; f.resolveLocalFileSystemURL = function (a, c, b) { b && b(o) }; if (f === window && f.RUNNING_TESTS) f.Entry = p, f.FileEntry = j, f.DirectoryEntry = i, f.resolveToFullPath_ = q
	}
})(self);