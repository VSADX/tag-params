self.tagParams = (function (exports) {
  'use strict';

  /**
   * @typedef {object} ParseResult an object with parsed results
   * @property {string[]} template - the list of chunks around interpolations
   * @property {string[]} values - interpolations as strings
   */

  /**
   * @typedef {[string[], ...any[]]} TagArguments an array to use as template
   *                                              literals tag arguments
   */

  /**
   * @callback Partial a callback that re-evaluate each time new data associated
   *                   to the same template-like array.
   * @param {object} [object] the optional data to evaluate as interpolated values
   * @returns {TagArguments} an array to use as template literals tag arguments
   */

  /**
  * The default `transform` callback
  * @param {string} value the interpolation value as string
  */
  var noop = function noop(value) {
    return value;
  };
  /**
   * The default "null" fallback when no object is passed to the Partial.
   */


  var fallback = Object.create(null);
  /**
   * Given a string and an optional object carrying references used through
   * such string interpolation, returns an array that can be used within any
   * template literal function tag.
   * @param {string} content the string to parse/convert as template chunks
   * @param {object} [object] the optional data to evaluate as interpolated values
   * @returns {TagArguments} an array to use as template literals tag arguments
   */

  var params = function params(content, object) {
    return partial(content)(object);
  };
  /**
   * Given a string and an optional function used to transform each value
   * found as interpolated content, returns an object with a `template` and
   * a `values` properties, as arrays, containing the template chunks,
   * and all its interpolations as strings.
   * @param {string} content the string to parse/convert as template chunks
   * @param {function} [transform] the optional function to modify string values
   * @returns {ParseResult} an object with `template` and `values` arrays.
   */

  var parse = function parse(content, transform) {
    var fn = transform || noop;
    var template = [];
    var values = [];
    var length = content.length;
    var i = 0;

    while (i <= length) {
      var open = content.indexOf('${', i);

      if (-1 < open) {
        template.push(content.slice(i, open));
        open = i = open + 2;
        var close = 1; // TODO: this *might* break if the interpolation has strings
        //       containing random `{}` chars ... but implementing
        //       a whole JS parser here doesn't seem worth it
        //       for such irrelevant edge-case ... or does it?

        while (0 < close && i < length) {
          var c = content[i++];
          close += c === '{' ? 1 : c === '}' ? -1 : 0;
        }

        values.push(fn(content.slice(open, i - 1)));
      } else {
        template.push(content.slice(i));
        i = length + 1;
      }
    }

    return {
      template: template,
      values: values
    };
  };
  /**
   * Given a string and an optional function used to transform each value
   * found as interpolated content, returns a callback that can be used to
   * repeatedly generate new content from the same template array.
   * @param {string} content the string to parse/convert as template chunks
   * @param {function} [transform] the optional function to modify string values
   * @returns {Partial} a function that accepts an optional object to generate
   *                    new content, through the same template, each time.
   */

  var partial = function partial(content, transform) {
    var _parse = parse(content, transform),
        template = _parse.template,
        values = _parse.values;

    var args = [template];
    var rest = Function('return function(){with(arguments[0])return[' + values + ']}')();
    return function (object) {
      return args.concat(rest(object || fallback));
    };
  };
  /**
   * Create a template result
   * @param {function} contentfn a function that has multiline comments to string.
   * @param {function} [transform] the optional function to modify string values
   * @param {function} [othereval] the optional function to eval the values
   * @returns {ParseResult} a function that accepts an optional object to generate
   *                    new content, through the same template, each time.
   */
  
  var multiline = function multiline(contentfn, transform, othereval) {
    var content = contentfn.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
    var _parse = parse(content, transform),
        template = _parse.template,
        values = _parse.values;

    var exec = othereval || contentfn;
    values = exec("[" + values + "]");

    return {
      template: tempalte, 
      values: values
    }
  };

  exports.params = params;
  exports.parse = parse;
  exports.partial = partial;
  exports.multiline = multiline;

  return exports;

}({}));
