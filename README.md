# ObjectEventListener

```javascript
// Имеется некоторый объект с данными
const someObject = {
  someKey: 'someValue',
  oneMoreKey: {
    andOneMoreKey: 'oneMoreValue',
  },
};

// Создаем обёртку над объектом, чтобы иметь возможность слушать изменения данного объекта и реагировать на них.

// Для более краткой записи предлагается придерживаться следующего соглашения при именовании слушателя объекта:
// %имя объекта%EL (EL - Event Listener)
const someObjectEL = new ObjectEventListener(someObject);

// Слушать изменения можно на любом уровне вложенности

// Добавим обработчик события изменения значениий ключей/добавления новых ключей объекта someObject.
// Слушаться будут только изменения/довавлнения ключей непосредственно самого объекта someObject.
someObjectEL.addEventListener('someObject', (resultObject, keyName, value) => {
  console.log('Слушаем изменение объекта someObject');

  // В обработчик передаётся ряд аргументов:
  // resultObject - мутированный объект someObject
  // keyName - название ключа, значение которого было изменено
  // value - новое значение ключа.
});


// Слушать изменения/добавления можно на любом уровне вложенности
// Название имени события совпадает с названием пути к объекту на том или ином уровне вложенности
someObjectEL.addEventListener('someObject.oneMoreKey', (resultObject, keyName, value) => {
  console.log('Слушаем изменения объекта someObject.oneMoreKey');
});


// Чтобы услышать изменения ключи следует добавлять с помощью метода set
someObjetEL.set('someObject.oneMoreKey.andOneMoreKey', 'andOneMoreValue');

// Удалить обработчики события объекта можно с помощью метода removeEventListener
someObjetEL.removeEventListener('someObject.oneMoreKey');
// Перестаём обрабатывать результаты изменения/добавления ключей объекта someObject.oneMoreKey.
`````
