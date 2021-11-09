<template>
    <div id="mapContainer">
        <!-- <input type="text" name="searchInput" id="searchInput" v-bind="query"/> -->
        <div id="map"></div
    ></div>
</template>
<script>
export default {
    name: 'google-map',
    data() {
        return {
            infowindow: null,
            loader: null,
            singaporePosition: { lat: 1.352083, lng: 103.819839 },
            map: '',
            mapOptions: {
                center: this.singaporePosition,
                zoom: 15,
                componentRestrictions: { country: 'SG' },
            },
            placesRequest: {
                location: { lat: 1.352083, lng: 103.819839 },
                radius: '500',
                query: ['places to study'],
            },
            query: 'places to study',
            userLocation: {},
            isLoading: false,
        };
    },
    mounted() {
        this.getAPILoader(this.getMap);
    },
    methods: {
        getAPILoader(callback) {
            axios
                .get('../services/GetGoogleAPI')
                .then((result) => {
                    const apiKey = result.data;
                    this.loader = new mapLoader({
                        apiKey,
                        version: 'weekly',
                        libraries: ['places'],
                    });

                    callback();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getMap() {
            console.log(`getMap`);
            this.getUserLocation();

            this.loader.load().then(() => {
                this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
                this.infowindow = new google.maps.InfoWindow();

                let markers = [];

                if (markers.length === 0) {
                    let placesService = new google.maps.places.PlacesService(this.map);
                    placesService.textSearch(this.placesRequest, (results, status) => {
                        console.log(status, google.maps.places.PlacesServiceStatus.OK);
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (let i = 0; i < results.length; i++) {
                                const place = results[i];
                                markers.push(this.createMarker(place));
                            }
                            this.map.setCenter(results[0].geometry.location);
                            console.log(results[0])
                        }
                    });
                }

                var inputGroup = document.createElement('div');
                inputGroup.id = 'input-wrapper';
                inputGroup.classList = ['input-group'];
                var inputIcon = document.createElement('span');
                inputIcon.classList = ['input-group-text'];
                inputIcon.innerText = 'Search';
                var inputField = document.createElement('input');
                inputField.id = 'pac-input';
                inputField.classList = ['form-control'];
                inputField.value = this.query;
                inputGroup.appendChild(inputIcon);
                inputGroup.appendChild(inputField);

                const searchBox = new google.maps.places.SearchBox(inputField);
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputGroup);

                this.map.addListener('bounds_changed', () => {
                    searchBox.setBounds(this.map.getBounds());
                });

                searchBox.addListener('places_changed', () => {
                    const places = searchBox.getPlaces();

                    if (places.length == 0) {
                        return;
                    }

                    // Clear out the old markers.
                    markers.forEach((marker) => {
                        marker.setMap(null);
                    });
                    markers = [];

                    // For each place, get the icon, name and location.
                    const bounds = new google.maps.LatLngBounds();

                    places.forEach((place) => {
                        if (!place.geometry || !place.geometry.location) {
                            console.log('Returned place contains no geometry');
                            return;
                        }

                        // Create a marker for each place.
                        let marker = this.createMarker(place);

                        markers.push(marker);
                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    this.map.fitBounds(bounds);
                    console.log(markers[0])
                    this.map.setCenter(markers[0].getPosition());
                });
            });
        },
        createMarker(place) {
            if (!place.geometry || !place.geometry.location) return;

            const marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, 'click', () => {
                console.log(`marker click`, place.name);
                console.log(place);
                let infoHtml = `<div>`;
                if (place.name) {
                    infoHtml += `<h5>${place.name}</h5>`;
                }
                if (place.formatted_address) {
                    infoHtml += `<p>Located at ${place.formatted_address}</p>`;
                }
                if (place.price_level > 0) {
                    infoHtml += `<p>Price: ${place.price_level}/5</p>`;
                }
                if (place.rating > 0 && place.user_ratings_total) {
                    infoHtml += `<p>Rated ${place.rating} out of 5 by ${place.user_ratings_total} people</p>`;
                }
                if (place.photos.length > 0) {
                    for (var photo of place.photos) {
                        infoHtml += `<img style="height: 150px" src=${photo.getUrl()} />`;
                    }
                }
                infoHtml += `</div>`;
                this.infowindow.setContent(infoHtml);
                this.infowindow.open(this.map, marker);
            });

            return marker;
        },
        getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.lat,
                            lng: position.coords.longitude,
                        };
                    },
                    () => {
                        this.userLocation = this.singaporePosition;
                    }
                );
            }
        },
    },
};
</script>
