(function () {
  'use strict';

  //////////////////////////////////////////////////////////////////////////////
  /**
   * This class defines a common interface for all coordinate types that can
   * be used as a mixin for coordinate classes or applied directly onto bare
   * objects.  The default implementation assumes that the object has keys
   * ``x``, ``y``, and ``z`` containing numeric values representing coordinates
   * of a position.
   * @mixin
   */
  //////////////////////////////////////////////////////////////////////////////
  geo.xyz = {
  };

  // Define default coordinate accessors, these can be overridden to extend
  // the behavior of the class.
  Object.defineProperties(
    geo.xyz,
    /** @lends geo.xyz */
    {
      'x_':
        {
          get: function () {return this.x;},
          set: function (x) {this.x = x;}
        },
      'y_':
        {
          get: function () {return this.y;},
          set: function (y) {this.y = y;}
        },
      'z_':
        {
          get: function () {return this.z;},
          set: function (z) {this.z = z;}
        }
    }
  );
})();
