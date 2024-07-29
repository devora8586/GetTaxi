
import cookies from 'js-cookie';

export function signOut() {
    cookies.remove('user');
    cookies.remove('type');
    cookies.remove('available');
    cookies.remove('token');
    window.location.replace('../')
}


export async function loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key='YOUR_API_KEY'&libraries=places`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function geocodeAddress(location) {
    return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: location.latitude, lng: location.longitude };
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK')
                resolve(results[0].formatted_address);
            else
                reject('Error geocoding address');
        });
    });
}