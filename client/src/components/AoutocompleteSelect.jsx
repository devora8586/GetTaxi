import React, { useState } from "react";
import Autocomplete from 'react-google-autocomplete';
import { FaLocationArrow } from "react-icons/fa6";
import { geocodeAddress } from "../functions";
import '../styles.css';


export default function AoutocompleteSelect({ setValue, type }) {
    
    const [location, setLocation] = useState()

    function getLocation() {
        navigator.geolocation.getCurrentPosition((loc) => {
            const { latitude, longitude } = loc.coords;
            setValue('location', { latitude, longitude });
            geocodeAddress({ latitude, longitude })
                .then(location => setLocation(location))
        });
    }

    return (<div className="input-group">
        <Autocomplete
            apiKey="YOUR_API_KEY"
            onPlaceSelected={(place) => {
                const latitude = place.geometry.location.lat();
                const longitude = place.geometry.location.lng();
                setValue(type.toLowerCase(), { latitude, longitude });
            }}
            options={{
                componentRestrictions: { country: "il" },
                types: ["address"]
            }}
            defaultValue={location}
            placeholder={`Enter ${type}`}
        />
        {type == 'Location' && <FaLocationArrow className="fa-location-arrow" onClick={getLocation} />}
    </div>)
}