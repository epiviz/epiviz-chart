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

# Installation from source

`bower install epiviz/epiviz-chart`

# Demo

demo folder contains examples of various epiviz components

- `index-json.html` should work as it contains static data in the html

most other examples, require an instance of EFS running. 

To run a local instance of polymer-server
`polymer serve`

Then navigate to any files inside the demo folder

http://localhost:8080/components/epiviz-chart/demo/<FILE_NAME.html>

# Epiviz-environment or Epiviz-nav elements

for example

if the page contains

```
<epiviz-environment id="env">
</epiviz-environment>
```

to add an epiviz chart for example a scatter plot,
We create an element with attributes assigned to the 
component.

```
elem = document.createElement('epiviz-scatter-plot'); 
elem.dimS = ['affy1', 'affy2']; 
// instead can also set `json-data` on the component
elem.slot="charts"
```

query dom for environment or navigation element

`env = document.querySelector('#env')`

and appent the new element

`env.appendChild(elem)`

After the chart is rendered, we can also update any of the attributes. this is similar to modifying attributes of a html element in JS.

```
# get chart
chart = document.querySelector("#chart1");
# get current chart settings
currentSettings = chart.chartSettings;
# modify chart settings
...

# set settings back to chart
chart.setAttribute("chart-settings", JSON.stringify(currentSettings));
```


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

