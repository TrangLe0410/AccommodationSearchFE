import React, { memo, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import icons from '../ultils/icons';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const { MdLocationPin } = icons;
const Position = ({ text, icon }) => <div>{icon}</div>;

const Map = ({ address }) => {
    const [coords, setCoords] = useState(null)
    useEffect(() => {
        const getCoords = async () => {
            try {
                const results = await geocodeByAddress(address);
                const latLng = await getLatLng(results[0]);
                setCoords(latLng);
            } catch (error) {
                console.error('Error while fetching coordinates:', error);
            }
        };

        if (address && window.google && window.google.maps) {
            getCoords();
        } else if (!address) {
            navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
                setCoords({ lat: latitude, lng: longitude });
            });
        } else {
            console.error('Google Maps API or address not available.');
        }
    }, [address]);

    return (
        <div className='h-[350px] w-full relative'>
            {address && <div className='absolute max-w-[250px] top-[10px] left-[10px] z-50 bg-white shadow-md p-4 text-xs'>
                {address}
            </div>}
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
                defaultCenter={coords}
                defaultZoom={11}
                center={coords}
            >
                <Position
                    lat={coords?.lat}
                    lng={coords?.lng}
                    icon={<MdLocationPin color='red' size={38} />}
                    text={address}
                />
            </GoogleMapReact>
        </div>
    );
};

export default memo(Map);
