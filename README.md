# template-literals-for-es3
  
this repo adds a function to `tag-params` library by WebReflections.  
this library uses `tagParams` as the name in JS.  
  
```js
function MyComponent() {
  
  var year = 1999
  var now = new Date().getFullYear()
  
  return tagParams.multiline(function(fn){/*!
    <div>
      <h1> Hi guys, it's ${year} </h1>
      <br><br>
      <p>This JavaScript worked <i>${now - year}</i> years ago.</p>
    </div>
    */
    return eval(fn)
  })
}
```
  
How does it work?
1. JS keeps comments in code.
2. `/*!` tells multiline to string this comment.
3. `return eval` can detect the variables for you!
4. `tag-params` library finds `${` to `}` then it is evalled.
  
