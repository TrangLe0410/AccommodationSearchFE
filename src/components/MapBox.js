import React, { useEffect, useState } from 'react';
import ReactMapGL, { NavigationControl, Marker, Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import CSS file
import icons from '../ultils/icons';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const { MdLocationPin } = icons;

const TOKEN = process.env.REACT_APP_MAP_BOX_TOKEN;

const MapBox = ({ address, showCurrentLocation = false }) => {
    const [viewState, setViewState] = useState({
        latitude: null,
        longitude: null,
        zoom: 11,

    });
    const [addressMarker, setAddressMarker] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [route, setRoute] = useState(null);
    const [popupInfo, setPopupInfo] = useState(null);

    // Fetch coordinates for the provided address
    useEffect(() => {
        if (address) {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${TOKEN}`)
                .then(response => {
                    const coordinates = response.data.features[0].center;
                    console.log("Fetched coordinates from address:", { latitude: coordinates[1], longitude: coordinates[0] });
                    setAddressMarker({ latitude: coordinates[1], longitude: coordinates[0] });
                    setViewState(prevState => ({
                        ...prevState,
                        latitude: coordinates[1],
                        longitude: coordinates[0],
                    }));
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [address]);

    // Fetch the current geolocation of the user
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Current position:", { latitude, longitude });
                    setCurrentPosition({ latitude, longitude });
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const checkDistance = (addressMarker, currentPosition) => {
        axios
            .get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${addressMarker.longitude},${addressMarker.latitude};${currentPosition.longitude},${currentPosition.latitude}.json?access_token=${TOKEN}`
            )
            .then(function (responseloca) {
                const distance = (responseloca.data.routes[0].distance / 1000).toFixed(2); // Rounded to two decimal places
                console.log("distance", distance);
                setPopupInfo({ latitude: (addressMarker.latitude + currentPosition.latitude) / 2, longitude: (addressMarker.longitude + currentPosition.longitude) / 2, distance });
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    useEffect(() => {
        if (addressMarker && currentPosition) {
            checkDistance(addressMarker, currentPosition);
        }
    }, [addressMarker, currentPosition]);

    // Function to fetch the route and update state
    const fetchRoute = (addressMarker, currentPosition) => {
        axios
            .get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${addressMarker.longitude},${addressMarker.latitude};${currentPosition.longitude},${currentPosition.latitude}.json?access_token=${TOKEN}`
            )
            .then(response => {
                const route = response.data.routes[0].geometry;

                const decodedRoute = polyline.decode(route);
                const geojson = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: decodedRoute.map(coord => [coord[1], coord[0]]),
                    },
                };
                setRoute(geojson);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // Call fetchRoute when both markers are available
    useEffect(() => {
        if (addressMarker && currentPosition) {
            fetchRoute(addressMarker, currentPosition);
        }
    }, [addressMarker, currentPosition]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '350px' }}>
            <ReactMapGL
                {...viewState}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onMove={evt => setViewState(evt.viewState)}
                mapboxAccessToken={TOKEN}
                center={addressMarker}
            >
                <NavigationControl position='bottom-right' />

                {/* Display the marker for the address */}
                {addressMarker && (
                    <Marker latitude={addressMarker.latitude} longitude={addressMarker.longitude}>
                        <MdLocationPin color='red' size={34} />
                    </Marker>
                )}

                {/* Optionally display the marker for the current position */}
                {showCurrentLocation && currentPosition && (
                    <Marker latitude={currentPosition.latitude} longitude={currentPosition.longitude}>
                        <MdLocationPin color='blue' size={34} />
                    </Marker>
                )}

                {/* Display the route */}
                {showCurrentLocation && route && (
                    <Source id="route" type="geojson" data={route}>
                        <Layer
                            id="route"
                            type="line"
                            source="route"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round',
                            }}
                            paint={{
                                'line-color': '#1a73e8',
                                'line-width': 6,

                            }}
                        />

                    </Source>
                )}
                {showCurrentLocation && popupInfo && (
                    <Popup
                        latitude={popupInfo.latitude}
                        longitude={popupInfo.longitude}
                        closeButton={false}
                        closeOnClick={false}
                        anchor="top"

                    >
                        <div className='flex'>
                            <img src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-car-icon-png-image_1024782.jpg" alt="Car Icon" style={{ width: '20px', marginRight: '5px' }} />
                            {popupInfo.distance} km
                        </div>
                    </Popup>
                )}
            </ReactMapGL>
        </div>
    );
};

export default MapBox;
