(function() {

	function Namespace(path) {
		if (typeof path == 'undefined' || !_validatePath(path)) {
			_printError('Namespace(\'' + path + '\')', '\'' + path + '\' is invalid.');
			return null;
		}
		return new NamespaceObject(path);
	}

	function NamespaceObject(path) {
		var self = this;

		//----------------------------------------
		// PRIVATE MEMBER
		//----------------------------------------
		var _names = path.split(_separator);
		var _space = _getSpace(path);
		var _scope = _defaultScope;

		//----------------------------------------
		// PRIVATE MEMBER
		//----------------------------------------

		var _allocate = function() {
			_space = _setSpace(path);
		};

		var _extern = function(classname) {
			_scope[classname] = _space[classname];
		};

		//----------------------------------------
		// PUBLIC METHOD
		//----------------------------------------

		/**
		 * 名前空間にオブジェクトを登録する
		 */
		self.register = function(classname, object, ignoreConflict) {
			if (typeof ignoreConflict == 'undefined') ignoreConflict = false;

			//argument error
			if (typeof classname == 'undefined' || typeof object == 'undefined') {
				_printError('Namespace(\'' + path + '\').register', 'one of arguments is not defined');
				return self;
			}

			//register object to namespace
			_allocate();
			if (ignoreConflict || typeof _space[classname] == 'undefined') {
				_space[classname] = object;
				return self;
			}

			//conflict error
			_printError('Namespace(\'' + path + '\').register', '\'' + classname + '\' is already registered.');
			return self;
		};

		/**
		 * 名前空間上のクラスをインポートする
		 */
		self.import = function(classname) {
			classname = _defaultValue(classname, '*');
			_allocate();

			//import();
			//import('*');
			if (classname == '*') {
				for (var key in _space) {
					_extern(key);
				}
				return self;
			}

			//import(['Hoge', 'Fuga']);
			if (classname instanceof Array){
				var n = classname.length;
				for (var i = 0; i < n; ++i) {
					var key = classname[i];
					_extern(key);
				}
				return self;
			}

			//import('Moja');
			if (typeof _space[classname] != 'undefinede') {
				_extern(classname);
				return self;
			}

			//argument error
			_printError('Namespace(\'' + path + '\').import', '\'' + classname + '\' is not defined');
			return self;
		};

		/**
		 * 名前空間を取得する
		 */
		self.exist = function() {
			return _existSpace(path);
		};

		/**
		 * 名前空間を利用する
		 */
		self.use = function() {
			_allocate();
			var n = _names.length, ns = _scope, name;
			for (var i = 0; i < n; ++i) {
				name = _names[i];
				if (typeof ns[name] == 'undefined') {
					ns[name] = {};
				}
				ns = ns[name];
			}
			for (var key in _space) {
				ns[key] = _space[key];
			}
			return self;
		};

		/**
		 * スコープを変更する
		 */
		self.scope = function(scope) {
			_scope = _defaultValue(scope, _defaultScope);
			return self;
		};

		/**
		 * パスを取得する
		 */
		self.getPath = function() {
			return path;
		};
	}

	//----------------------------------------
	// STATIC PRIVATE MEMBER
	//----------------------------------------

	var _spaces = {};
	var _separator = '.';
	var _defaultScope = window;

	//----------------------------------------
	// STATIC PRIVATE METHOD
	//----------------------------------------

	var _defaultValue = function(value, defaultValue) {
		return typeof value == 'undefined' ? defaultValue : value;
	};

	var _getSpace = function(path) {
		return _spaces[path];
	};

	var _setSpace = function(path) {
		if (typeof _spaces[path] == 'undefined') _spaces[path] = {};
		return _spaces[path];
	};

	var _existSpace = function(path) {
		return typeof _spaces[path] != 'undefined';
	};

	var _validatePath = function(path) {
		return path.match(/^[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)*$/) !== null;
	};

	var _printError = function(func, message) {
		console.log('###ERROR### at ' + func + ' : ' + message);
	};

	//register myself
	Namespace('net.alumican.util').register('Namespace', Namespace).use();
})();