## About

This one page mapping tool shows differences between 2000 and 2010 census tracts in Illinois.

## Data Source

Tract relationships data is from [Census relationship files](https://www.census.gov/geo/maps-data/data/relationship.html).

Geo data is from [Tiger shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html).

The detailed [explanation of census tract changes](https://www.census.gov/geo/maps-data/data/pdfs/rel/tractrelfile.pdf) provides helpful background reading. 

## Processing

`process.py` takes the CSV in the `data` folder and creates a `2000.json` and `2010.json`. The script takes each row of the CSV related to one tract, and create an object containing all related tracts from the alternate year. For example, it takes a 2010 tract and fills the object with all related 2000 tracts, as seen in this snippet from the `2010.json`.

![](http://i.imgur.com/2mBj9QK.png)


These files are then referenced in `site.js` when a user clicks on the map, to pull the appropriate 2000 tracts that appear under the 2010 tracts. See inline comments in [script.js](https://github.com/developmentseed/census-tracts/blob/gh-pages/script.js#L77). 


## TopoJSON

[Tiger shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html) of Illinois tracts were converted to TopoJSON since GeoJSONs would take too long to load in the browser. 

First install topojson (requires node)

`npm install topojson`

Then specify the input file, output file name, and any additional options. The topoJSONs used on this site are simplified to 20% quality to reduce file size. The ID of the features is also promoted to the top of the properties, so that it can later be referenced with the [`findwhere` function](https://github.com/developmentseed/census-tracts/blob/gh-pages/script.js#L84) in script.js. 

`topojson -s [input file name] -0 --simplify-proportion=0.2 --id-property=GEOID -o il_tracts_2000.json`

*The input shapefiles are not included in this repository since only TopoJSONs are used on the site.*

See the [command line reference](https://github.com/mbostock/topojson/wiki/Command-Line-Reference#properties) for more options when creating TopoJSON files.

### Limitations of TopoJSON


Since the TopoJSON is very simplified, it limits the tool's ability to detect fine changes. For example, [tract 17111871500](http://developmentseed.org/census-tracts/#17111871500) is composed of parts of four 2000 tracts, two of which don't appear to fall within the 2010 border due to simplification. 

[![](http://i.imgur.com/FV3iStz.png)](
http://developmentseed.org/census-tracts/#17111871500)

The purple 2000 tract contributes 0 percent population and area because Census calculates all percentages to 2 decimal places. 

## Javascript

The site uses underscore.js, and jquery (included in [ext folder](https://github.com/developmentseed/census-tracts/tree/gh-pages/ext)). 

[Mapbox.js](mapbox.com/mapbox.js) and [Topojson](https://github.com/mbostock/topojson) libraries are referenced externally. 


Inline comments in `script.js` explain functionality. 

## Contribute

Contributions to this site are welcome, please open a ticket for features, bugs or to discuss pull requests. Or fork the site to replicate the process for your own state. 