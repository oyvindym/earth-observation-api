Earth Observation API
===

This repository is a sample application for my thesis work, spring 2016, at Norwegian University of Science and Technology (NTNU).

Sign up at the satellite imagery services
----
To use the application you need to be signed up at the different satellite imagery services.

- [Astro Digital](https://fetch.astrodigital.com/)
- [DigitalGlobe](https://gbdx.geobigdata.io/account/self_registration/)
- [ECHO](https://urs.earthdata.nasa.gov/users/new)
- [Planet Labs](https://www.planet.com/explorers/)
- [Sentinels Scientific Data Hub (SciHub)](https://scihub.copernicus.eu/dhus/#/self-registration)
- [UrtheCast](https://developers.urthecast.com/create-account)

Set up credentials
----
After signing up and retrieving the necessary credentials from the service, remember to fill in the credentials in the `config.js` file. The `endpoints` objects stores one object for each of the services.

Run with only a few of the services
----

Simply comment out the services found in `app.js`

    const endpoints = [
        // AstroDigital,
        // DigitalGlobe,
        // ECHO,
        // PlanetLabs,
        SciHub,
        // UrtheCast
    ];

    // Running the application with SciHub only.

Define area-of-interests
----
The two areas already included in the application are Oslo, Norway and San Francisco, US. If you want to add your own area-of-interests, add them to the `locations` object in `config.js`. A location is defined as follows:

    locationName: {
        polygon: <GeoJSON Polygon>
    }

Where the `<GeoJSON Polygon>` has the full structure as defined [here](http://geojson.org/). A convenient tool for defining GeoJSON polygons can be found [here](http://geojson.io/).

Installing dependencies
----

The application uses `Node.js` and the dependencies can be installed using:

    $ npm install

Running the application
----

The application can be run with the following command.

    $ npm start <locationName>

    # For Oslo, Norway
    $ npm start oslo

The `<locationName>` should match the location defined in the `locations` object in `config.js`. Please note that this is case-sensitive.

The output from the application can be found in `outputs` with the following filenames: `location_endpoint.json`. For example: `oslo_SciHub.json`.
