# Documentation

Documentation for the web components is available at 

https://epiviz.github.io/components/

# Usage from cdn

Add this to HTML head (loads dependencies)

    <script src="https://cdn.jsdelivr.net/gh/epiviz/epiviz-chart/cdn/jquery/dist/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/epiviz/epiviz-chart/cdn/jquery-ui/jquery-ui.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/epiviz/epiviz-chart/cdn/renderingQueues/renderingQueue.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/epiviz/epiviz-chart/cdn/webcomponentsjs/webcomponents-lite.js"></script>

    <link rel="import" href="https://cdn.jsdelivr.net/gh/epiviz/epiviz-chart/cdn/epiviz-components.html">

# For development

To locally setup `epiviz-chart`

- Clone the repo 
  `git clone https://github.com/epiviz/epiviz-chart`
- Install Bower from bower.io
- install bower dependencies 
  `bower install`
- Install polymer-cli
  `polymer server`

# Dependency in an application

`bower install --save epiviz/epiviz-chart`

# Demos

demo folder contains examples of various epiviz components

- `index-json.html` should work as it contains static data in the html

most other examples, require an instance of EFS running. 

To run a local instance of polymer-server

`polymer serve -p 8080`

Then navigate to any files inside the demo folder

http://localhost:8080/components/epiviz-charts/demo/<FILE_NAME.html>

# Epiviz-environment or Epiviz-nav elements

(also checkout `demo/index-readme.html`)

Imagine a html page containing a navigational element (a genome browser)

```
<epiviz-navigation 
    id="nav" 
    chr="chr11" 
    start=101322295 
    end=131454659>
</epiviz-navigation>
```

We can add a visualization with static data assigned to the element.

```
elem = document.createElement('epiviz-scatter-plot'); 
elem.setAttribute('json-data', '{ \
  "rows": { \
         "end": [101454659,0,417130,0,0,83502,0,148863,0,0], \
         "start": [101322295,0,463451,0,0,132428,0,63018,0,0], \
         "chr": ["chr11","chr11","chr11","chr11","chr11","chr11","chr11","chr11","chr11","chr11"] \
  }, \
  "cols": { \
         "ExpressionA": [-0.188,0.153,-0.762,0.53,-0.776,-0.32,-0.731,6.503,11.087,10.569], \
         "ExpressionB": [-0.325,-0.289,-0.523,1.417,-0.636,-0.89,-0.786,4.885,9.112,8.862] \
  } \
}'); 
elem.setAttribute('dim-s', '["ExpressionA", "ExpressionB"]');
// instead can also set `json-data` on the component
elem.slot="charts"
```

Add the plot to the dom

```
nav = document.querySelector('#nav')
nav.appendChild(elem)
```

We can programmatically update any of the attributes on the visualization. This should be similar to updating attributes in JS.

```
// get chart
chart = document.querySelector("epiviz-scatter-plot")

// get current chart settings
currentSettings = chart.chartSettings;
// modify chart settings
currentSettings["circleRadiusRatio"] = 0.1;

// set settings back to chart
chart.setAttribute("chart-settings", JSON.stringify(currentSettings));
```

Similarly, can also update `chart-colors`  & other attributes


# Optimize elements for production 
```
npm install -g polymer-bundler

polymer-bundler --inline-scripts --inline-css --strip-comments epiviz-charts.html > dist/epiviz-charts.html
```

# Docker Instructions

The docker setup, runs polymer server to serve the components and/or app pages, and nginx as a proxy.

To build,

`docker build . -t epiviz-chart`

`--no-cache` for rebuilding during development

To run,

`docker run -p 80:80 -dt epiviz-chart`

## Development

For development, also expose port 8081 on the container. 

`docker run -p 80:80 -p 8081:8081 -dt epiviz-chart`

To use the container for serving app pages,

copy html files to /app/, 
there's an nginx route (\<HOSTNAME\>/app/) configured to serve these pages. 
The included `index.html` uses the loader.
