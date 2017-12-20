/**
 * Задача: последовательно вызывать каждый промис и помещать
 * результат им возвращаемый в массив, который будет в конечном итоге
 * представлять из себя массив всех результатов промисов в
 * последовательном порядке.
 */

var p1 = new Promise(function(resolve, reject) {
  resolve('ONE');
});

var p2 = new Promise(function(resolve, reject) {
  resolve('TWO');
});

var p3 = new Promise(function(resolve, reject) {
  resolve('THREE');
});

var p4 = new Promise(function(resolve, reject) {
  resolve('FOUR');
});

/**
 * Решение 1-ое: ад кэлбэков
 */
p1.then(function(data) {
  var arr = [data];
  p2.then(function(data) {
    arr.push(data);
    p3.then(function(data) {
      arr.push(data);
      p4.then(function(data) {
        arr.push(data);

        // arr = [ 'ONE', 'TWO', 'THREE', 'FOUR' ]
      });
    });
  });
});

/**
 * Решение 2-ое: прибегание к помощи библиотеки bluebird и метода "props"
 */
var Bluebird = require("bluebird");

p1.then(function(data) {
  return Bluebird.props({
    data: [data],
    nextValue: p2
  });
})
.then(function({data, nextValue}) {
  data.push(nextValue);

  return Bluebird.props({
    data: data,
    nextValue: p3
  });
})
.then(function({data, nextValue}) {
  data.push(nextValue);

  return Bluebird.props({
    data: data,
    nextValue: p4
  });
})
.then(function({data, nextValue}) {
  data.push(nextValue);

  // data = [ 'ONE', 'TWO', 'THREE', 'FOUR' ]
});


/**
 * Решение 3-ее: задействование рекурсии
 */
 function promiseIterator() {
   var result = [];
   var promises = Array.prototype.slice.call(arguments);

   var innerIterator = function() {
     return new Promise(function(resolve, reject) {

       if (promises.length > 0) {
         promises[0].then(function(data) {
           result.push(data);
           promises.shift();

           innerIterator(promises).then(resolve);
         });
       } else {
         resolve(result);
       }
     });
   };
   return innerIterator();
 }

 promiseIterator(p1, p2, p3, p4).then(function(data) {
   console.log(data); // [ 'ONE', 'TWO', 'THREE', 'FOUR' ]
 });
