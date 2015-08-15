(function () {
  'use strict';

  //////////////////////////////////////////////////////////////////////////////
  /**
   * This class defines the raw interface for a "tile" on a map.  A tile is
   * defined as a rectangular section of a map.  The base implementation
   * is independent of the actual content of the tile, but assumes that
   * the content is loaded asynchronously via a url.  The tile object
   * has a promise-like interface.  For example,
   *
   * tile.then(function (data) {...}).catch(function (data) {...});
   *
   * @class
   * @param {Object} spec The tile specification object
   *
   * @param {Object} spec.index The global position of the tile
   * @param {Number} spec.index.x The x-coordinate (usually the column number)
   * @param {Number} spec.index.y The y-coordinate (usually the row number)
   *
   * @param {Object} spec.size The size of each tile
   * @param {Number} spec.size.x Width (usually in pixels)
   * @param {Number} spec.size.y Height (usually in pixels)
   *
   * @param {Object|String} spec.url A url or jQuery ajax config object
   *
   * @param {Object?} spec.overlap The size of overlap with neighboring tiles
   * @param {Number} [spec.overlap.x=0]
   * @param {Number} [spec.overlap.y=0]
   */
  //////////////////////////////////////////////////////////////////////////////
  geo.tile = function (spec) {
    if (!(this instanceof geo.tile)) {
      return new geo.tile(spec);
    }

    this._index = spec.index;
    this._size = spec.size;
    this._overlap = spec.overlap || {x: 0, y: 0};
    this._wrap = spec.wrap || {x: 1, y: 1};
    this._url = spec.url;
    this._fetched = false;

    /**
     * Return the index coordinates.
     */
    Object.defineProperty(this, 'index', {
      get:
        function () { return this._index; }
    });

    /**
     * Return the tile sizes.
     */
    Object.defineProperty(this, 'size', {
      get: function () { return this._size; }
    });

    /**
     * Return the tile overlap sizes.
     */
    Object.defineProperty(this, 'overlap', {
      get: function () { return this._overlap; }
    });

    /**
     * Initiate the ajax request and add a promise interface
     * to the tile object.  This method exists to allow
     * derived classes the ability to override how the tile
     * is obtained.  For example, imageTile uses an Image
     * element rather than $.get.
     */
    this.fetch = function () {
      if (!this._fetched) {
        $.get(this._url).promise(this);
      }
      return this;
    };

    /**
     * Add a method to be called with the data when the ajax request is
     * successfully resolved.
     *
     * @param {function?} onSuccess The success handler
     * @param {function?} onFailure The failure handler
     * @returns {this} Supports chained calling
     *
     */
    this.then = function (onSuccess, onFailure) {
      this.fetch(); // This will replace the current then method

      // Call then on the new promise
      this.then(onSuccess, onFailure);
      return this;
    };

    /**
     * Add a method to be called with the data when the ajax fails.
     *
     * @param {function} method The rejection handler
     * @returns {this} Supports chained calling
     *
     */
    this.catch = function (method) {
      this.then(undefined, method);
      return this;
    };

    /**
     * Return a unique string representation of the given tile useable
     * as a hash key.  Possibly extend later to include url information
     * to make caches aware of the tile source.
     * @returns {string}
     */
    this.toString = function () {
      return [this._index.level || 0, this._index.y, this._index.x].join('_');
    };

    /**
     * Computes the global coordinates of the bottom edge relative to
     * some given offset.  The offset can be provided to handle precision loss
     * due to global dimensions as commonly occurs in pyramid tiling schemes.
     *
     * @param {Number?} offset The index to compute the coordinates relative to
     * @returns {Object}
     */
    this.bottom = function (offset) {
      var y = this.index.y - (offset || 0);
      return this.size.y * y - this.overlap.y;
    };

    /**
     * Computes the global coordinates of the left edge relative to
     * some given offset.  The offset can be provided to handle precision loss
     * due to global dimensions as commonly occurs in pyramid tiling schemes.
     *
     * @param {Number?} offset The index to compute the coordinates relative to
     * @returns {Object}
     */
    this.left = function (offset) {
      var x = this.index.x - (offset || 0);
      return this.size.x * x - this.overlap.x;
    };

    /**
     * Computes the global coordinates of the top edge relative to
     * some given offset.  The offset can be provided to handle precision loss
     * due to global dimensions as commonly occurs in pyramid tiling schemes.
     *
     * @param {Number?} offset The index to compute the coordinates relative to
     * @returns {Object}
     */
    this.top = function (offset) {
      var y = this.index.y - (offset || 0) + 1;
      return this.size.y * y + this.overlap.y;
    };

    /**
     * Computes the global coordinates of the right edge relative to
     * some given offset.  The offset can be provided to handle precision loss
     * due to global dimensions as commonly occurs in pyramid tiling schemes.
     *
     * @param {Number?} offset The index to compute the coordinates relative to
     * @returns {Object}
     */
    this.right = function (offset) {
      var x = this.index.x - (offset || 0) + 1;
      return this.size.x * x + this.overlap.x;
    };
    return this;
  };
})();