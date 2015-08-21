============
User's guide
============

Dependencies
------------

GeoJS depends on several Javascript libraries that must be loaded
prior to use as well as a few recommended libraries for optional
features.  As a convenience, we provide a bundle containing all
required and optional dependencies in a single minified file.
This bundle is built as ``dist/built/geo.ext.min.js``.  If you
are just building a simple page out of GeoJS like in the
:ref:`quick start guide <quick-start-guide>`, this will probably
work well; however, when using GeoJS as part of an application,
you may need to customize the loading order or versions of the
bundled applications.  In this case, you may need to include the
sources manually or bundle them yourself.  The following is a
list of libraries used by GeoJS.

.. table:: GeoJS dependencies

    +---------------------------+------------+---------------------------+
    | Library                   | Version    | Component                 |
    +===========================+============+===========================+
    | `jQuery`_                 | 2.1        | Core                      |
    +---------------------------+------------+---------------------------+
    | `proj4`_                  | 2.2        | Core                      |
    +---------------------------+------------+---------------------------+
    | `GL matrix`_              | 2.1        | GL renderer               |
    +---------------------------+------------+---------------------------+
    | `pnltri`_                 | 2.1        | GL renderer               |
    +---------------------------+------------+---------------------------+
    | `d3`_                     | 3.3        | D3 renderer, UI widgets   |
    +---------------------------+------------+---------------------------+

.. note::

    The versions listed are what is provided in the bundle,
    but other versions may work as well.

.. _jQuery: http://jquery.com/
.. _proj4: http://proj4js.org/
.. _GL matrix: http://glmatrix.net/
.. _pnltri: https://github.com/jahting/pnltri.js/
.. _d3: http://d3js.org/


Software conventions
--------------------

At it's core, GeoJS is an object oriented framework designed to be extended
and customized.  The inheritance mechanism used provides an isolated closure
inside the constructor to maintain private methods and variables.  Prototypal
inheritance is performed by a helper method called ``geo.inherit``.  This
method copies public methods declared on the parent class's prototype.  In general,
classes inside GeoJS do not declare methods on the class prototype.  Instead,
methods are typically bound to the instance inside the constructor.  This
provides access to the private scope.  As a consequence, a class should
always call its parent's constructor before extending the implementation.

Another convention used by GeoJS eliminates the need to use the ``new`` keyword
when constructing a new instance.  This is done by checking ``this``
of the current context.  If it is not an instance of the current class, then
the constructor is called again on a new object and the result is returned
to the caller.

The conventions we use result in the following boilerplate code in every
class definition inside GeoJS.

.. code-block:: js

    // New class, 'B', added to the geo module derived from class, 'A'.
    geo.B = function (args) {

        // Constructors take a single object to hold options passed to each
        // constructor in the class hierarchy.  The default is usually an
        // empty object.
        args = args || {};

        // Here we handle calling the constructor again with a new object
        // when necessary.
        if (!(this instanceof geo.B)) {

            // Note: this will only happen in the constructor called by the
            // user directly, not by all the constructors in the hierarchy.
            return new geo.B(args);
        }

        // Call the parent class's constructor.
        geo.A.call(this, args);

        // Declare private variables and save overridden superclass methods.
        var m_this = this,
            s_func = this.func,
            m_var = 1;

        this.func = function () {

            // Call the super method.
            s_func();

            m_var += 1;
            return m_this;
        };

        return this;
    };

    // Static methods and variables can be added here.
    geo.B.name = 'Class B';

    // Initialize the class prototype.
    geo.inherit(geo.B, geo.A);

.. note::

        * Variable naming conventions

            * The instance (``this``) is saved as ``m_this``.
            * Super class methods are saved with the prefix ``s_``.
            * Private variables are prefixed with ``m_``.

        * Methods beginning with ``_`` are meant to be protected so they should
          only be called from within the class itself or by an inherited class.
        * Use ``m_this`` to reference the instantiation inside public methods.
        * Constructor options are passed inside a single object argument.  Defaults
          should be used whenever possible.
        * When possible, functions should return the class instance to support method
          chaining.  This is particularly true for class property setters.
        * In many cases, class methods return ``null`` to indicate an error.

Class overview
---------------

GeoJS is made up of the following core classes.  Click on the link to go to the
documentation for each of the classes.

`geo.map <http://opengeoscience.github.io/geojs/apidocs/geo.map.html>`_
    The map object is attached to a DOM element and contains all visible layers and
    features.

`geo.renderer <http://opengeoscience.github.io/geojs/apidocs/geo.renderer.html>`_
    A renderer is responsible for drawing geometries and images on the map.  This is an
    abstract class which serves to define the minimal interface for a renderer.  Renderers
    can provide an extended interface so that they can be used as a *base renderer*.  The
    base renderer provides support methods for conversion between world and screen coordinates
    and must respond to the map's request for navigation commands. Every map must have exactly
    one layer attached to a base renderer.  Currently,
    `geo.gl.vglRenderer <http://opengeoscience.github.io/geojs/apidocs/geo.gl.vglRenderer.html>`_
    is the only available base renderer.
    `geo.d3.d3Renderer <http://opengeoscience.github.io/geojs/apidocs/geo.d3.d3Renderer.html>`_
    is also availabe for renderering features as SVG elements.

`geo.layer <http://opengeoscience.github.io/geojs/apidocs/geo.layer.html>`_
    Layer objects are created by the map's ``createLayer`` method.  This is an abstract
    class defining the interfaces required for all layers.  Every layer must have a
    specific renderer.  The following are useful layer implementations.

    `geo.featureLayer <http://opengeoscience.github.io/geojs/apidocs/geo.featureLayer.html>`_
        This is the primary container for features such as lines, points, etc.
    
    `geo.osmLayer <http://opengeoscience.github.io/geojs/apidocs/geo.osmLayer.html>`_
        This layer displays tiled imagery from an openstreetmaps compatible tile server.

    `geo.gui.uiLayer <http://opengeoscience.github.io/geojs/apidocs/geo.gui.uiLayer.html>`_
        This layer contains user interface widgets that should generally be placed on
        top of all other layers.

`geo.feature <http://opengeoscience.github.io/geojs/apidocs/geo.feature.html>`_
    Feature objects are created by the featureLayers's ``createFeature`` method.  Features
    are created from an arbitrary array of objects given by the ``feature.data`` method.
    Properties of the features can be given as constant values or as functional accessors
    into the provided data object.  The styles provided are largely independent of the
    renderer used; however, some differences are necessary due to internal limitations.
    The following are feature types currently available.

        * `geo.pointFeature <http://opengeoscience.github.io/geojs/apidocs/geo.pointFeature.html>`_
        * `geo.lineFeature <http://opengeoscience.github.io/geojs/apidocs/geo.lineFeature.html>`_
        * `geo.pathFeature <http://opengeoscience.github.io/geojs/apidocs/geo.pathFeature.html>`_
        * `geo.graphFeature <http://opengeoscience.github.io/geojs/apidocs/geo.graphFeature.html>`_
        * `geo.vectorFeature <http://opengeoscience.github.io/geojs/apidocs/geo.vectorFeature.html>`_

.. note::

    Some features types are only available for specific renderers.

`geo.gui.widget <http://opengeoscience.github.io/geojs/apidocs/geo.gui.widget.html>`_
    This is an abstract interface for creating widgets that the user can interact with.

        * `geo.gui.domWidget <http://opengeoscience.github.io/geojs/apidocs/geo.gui.domWidget.html>`_
        * `geo.gui.svgWidget <http://opengeoscience.github.io/geojs/apidocs/geo.gui.svgWidget.html>`_

         * `geo.gui.sliderWidget <http://opengeoscience.github.io/geojs/apidocs/geo.gui.sliderWidget.html>`_
         * `geo.gui.legendWidget <http://opengeoscience.github.io/geojs/apidocs/geo.gui.legendWidget.html>`_


`geo.mapInteractor <http://opengeoscience.github.io/geojs/apidocs/geo.mapInteractor.html>`_
    This class handles all mouse and keyboard events for the map.  Users can customize
    the mouse and keyboard bindings through this class.

`geo.fileReader <http://opengeoscience.github.io/geojs/apidocs/geo.fileReader.html>`_
    This is an abstract class defining the interface for file readers.  Currently,
    the only implemented reader is
    `geo.jsonReader <http://opengeoscience.github.io/geojs/apidocs/geo.jsonReader.html>`_,
    which is an extendable geojson reader.

`geo.clock <http://opengeoscience.github.io/geojs/apidocs/geo.clock.html>`_
    The clock object is attached to the map and is resposible for maintaining a user
    definable concept of time.  The clock can run, paused, and restarted.  The
    clock triggers events on the map to synchronize animations.

The API documentation is in the process of being updated.  You can always find the latest version
at `http://opengeoscience.github.io/geojs/apidocs/geo.html <http://opengeoscience.github.io/geojs/apidocs/geo.html>`_.

Coordinate systems and conversions
----------------------------------

A major component of GeoJS's core library involves managing several coordinate systems that
are used to keep layers aligned on the screen.  The following conventions are used in GeoJS's
documentation and codebase when refering to coordinates:

Latitude/longitude coordinates
    Expressed in degrees relative to the WGS84 datum as objects using keys ``x`` for longitude and ``y``
    for latitude.  Longitudes are assumed to be in the range ``[-180, 180]``.  Some map projections
    (such as the default ``EPSG:3857``) are periodic in ``x`` and handle automatic wrapping of
    longitudes.

GCS coordinates
    Expressed in standard units (usually meters) as defined by Proj.4, which is used to perform coordinate
    transformations internally.  The coordinate system ``EPSG:4326`` is equivalent to latitude/longitude
    coordinates described above.  Points in these coordinate systems are given as an object with keys
    x and y providing the horizontal (left to right) and vertical (bottom to top) positions respectively.
    GCS coordinates have an optional ``z`` value that is ``0`` by default.  The units of ``z`` should
    be expressed in the same units as ``x`` and ``y``.

Display coordinates
    Expressed in units of pixels relative to the top-left corner of the current viewport from top to bottom.

World coordinates
    These are the coordinates used internally as coordinates of the 3D scene in much the sense as defined
    in 3D graphics.  The world coordinates are a rescaled and translated version of the GCS coordinates so
    that the world coordinates of the current viewport is near ``1`` in each axis.  This is done to
    provide well conditioned transformation matrices that can be used acurately in contexts of limited precision
    such as GL or CSS.  In order to achieve this, the world coordinate system is dynamic at run time
    and will change as the user pans and zooms the map.  By convention, the world coordinates are given
    relative to a dynamic "scale" and "origin".  Changes to these values trigger events on the map that
    allow layers and features to respond and update their views as necessary.

Layer coordinates
    To allow flexibility for layer/renderer implementation, layers are allowed to use their own custom
    coordinate system via the functions ``toLocal`` and ``fromLocal``.  Features inside a layer should
    always pass coordinates through these methods to access the coordinates inside the layer's context.

Feature coordinates
    Features have a GCS property attached to them that should be taken to mean a geographic coordinate
    system for the data passed into the feature.  For features such as points, coordinates are automatically
    transformed into the map's GCS by Proj.4, then transformed into world coordinates, and finally into
    layer coordinates before being passed to the layer's rendering methods.
