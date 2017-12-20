/**
 * В языке Scala подсмотрел такую возможность, называемую "каррированием".
 * Это когда функция ожидает от вас некоторое количество аргументов и
 * по каким-то причинам вы хотите передать не все аргументы сразу, а поэтапно.
 * Для этого подставляем прочерк на место ожидаемого аргумента, в знак того, что
 * в дальнейшем коде место прочерка займёт действительное значение.
 */

function getFullInfo(name, age, gender, profession, city, nationality) {
  return `NAME: ${name}` + "\n" +
    `AGE: ${age}` + "\n" +
    `GENDER: ${gender}` + "\n" +
    `PROFESSION: ${profession}` + "\n" +
    `CITY: ${city}` + "\n" +
    `NATIONALITY: ${nationality}`;
}

const _ = null;

function Binding(initFunc) {

  var argsCount = initFunc.length;
  var argsBinding = {};
  for (var i = 0; i < argsCount; i++) {
    argsBinding[i] = undefined;
  }

  var bound = function() {

    // Последний вызов
    if (arguments.length < 1) {
      argsBinding.length = argsCount;
      var filledArgs = Array.prototype.slice.call(argsBinding);
      if (filledArgs.some(arg => typeof arg == 'undefined')) {
        throw new Error('Not all arguments was filled by values');
      }
      return initFunc.apply(initFunc, filledArgs);
    }

    // Найти все argsBinding, которые не заняты
    var emptyArgs = [];
    for (let key in argsBinding) {
      if (argsBinding[key] === undefined) {
        emptyArgs.push({ key });
      }
    }
    if (emptyArgs.length < 1) {
      throw new Error('All arguments already filled. Please, call function without arguments');
    }

    // Обходим аргументы bound
    for (let key in arguments) {
      let value = arguments[key];
      if (value !== null) {
        let argsBindingKey = emptyArgs[key].key;
        argsBinding[ argsBindingKey ] = value;
      }
    }
    return bound;
  };
  return bound;
}

var b = Binding(getFullInfo);

b = b(_, _, _, 'Developer', _, _);
b = b(_, _, _, _, _);
b = b(_, 31, _, _, 'russian');
b = b(_, 'Man', 'Bishkek');
b = b(_);
b = b('Stanislav');

var result = b();
console.log(result);

/**
NAME: Stanislav
AGE: 31
GENDER: Man
PROFESSION: Developer
CITY: Bishkek
NATIONALITY: russian
 */
