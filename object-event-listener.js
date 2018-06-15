// Класс позволяет слушать изменения свойств объектов
// Документация:
// https://github.com/abak-press/apress-application/blob/synchronize-config-between-browser-tabs
//   /docs/classes/object_event_listener.md

function ObjectEventListener(object) {
  this.objectToListen = object;

  this._eventsRouter = {};
}

ObjectEventListener.prototype = {
  _setObjectValueByPath: function(path, value) {
    var
      pathParts = path.split('.'),
      self = this;

    pathParts.shift();

    pathParts.reduce(function(result, currentKey, index) {
      if (index === pathParts.length - 1) { self.objectToListen[currentKey] = value; }

      return self.objectToListen[currentKey];
    }, self.objectToListen);
  },

  _getValueFromObjectByPath: function(path, sourceObject) {
    var array = path.split('.');

    array.shift();

    return array.reduce(function(result, currentKey) {
      return result ? result[currentKey] : null;
    }, sourceObject);
  },

  _createProxy: function(object, pathToObject) {
    var self = this;

    return new Proxy(object, {
      set: function(object, property, value) {
        object[property] = value;

        self._eventsRouter[pathToObject].handlers.forEach(function(handler) {
          handler.apply(null, [object, property, value]);
        });
      },
    });
  },

  set: function(pathToObjectKey, value) {
    var
      arrayWithPathParts = pathToObjectKey.split('.'),
      keyName = arrayWithPathParts.pop(),
      controller = this._eventsRouter[arrayWithPathParts.join('.')];

    if (!controller || !controller.handlers.length) { return this; }

    this._setObjectValueByPath(pathToObjectKey, value);

    controller.proxy[keyName] = value;

    return this;
  },

  addEventListener: function(pathToObject, handler) {
    var eventsRouter = this._eventsRouter;

    if (!eventsRouter[pathToObject]) {
      eventsRouter[pathToObject] = {
        handlers: [],
        proxy: this._createProxy(
          this._getValueFromObjectByPath(pathToObject, this.objectToListen),
          pathToObject
        ),
      };
    }

    eventsRouter[pathToObject].handlers.push(handler);
  },

  removeEventListener: function(pathToObject) {
    var eventsRouter = this._eventsRouter;

    if (!eventsRouter[pathToObject]) { return; }

    eventsRouter[pathToObject].handlers = [];
  },
};
