This one page mapping tool shows differences between 2000 and 2010 census tracts in Illinois.

## Data Source

Data is from [Census relatinoship files](https://www.census.gov/geo/maps-data/data/relationship.html), with a detailed explanatino of census tract changes in this [PDF](https://www.census.gov/geo/maps-data/data/pdfs/rel/tractrelfile.pdf).

## Processing

`process.py` takes the CSV in the `data` folder and creates a `200.json` and `2010.json`. These files are then referenced in `site.js` when a user clicks on the map, to pull the appropriate 2000 tracts that appear under the 2010 tracts. 

See inline comments in `process.py` and `script.js` to understand functionality. 

## TopoJSON

[Tiger shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html) of Illinois tracts were converted to TopoJSON since GeoJSONs were too large. The two TopoJSON files were created with the [command line reference](https://github.com/mbostock/topojson/wiki/Command-Line-Reference#properties).