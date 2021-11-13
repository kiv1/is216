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
                center: { lat: 1.352083, lng: 103.819839 },
                zoom: 15,
                componentRestrictions: { country: 'SG' },
            },
            placesRequest: {
                location: { lat: 1.352083, lng: 103.819839 },
                radius: '500',
                query: ['places to study'],
            },
            query: 'places to study',
            userLocation: null,
            isLoading: false,
            markers: [],
            placesService: null,
            placesRequestFields: [
                'name',
                'geometry',
                'business_status',
                'formatted_address',
                'opening_hours',
                'url',
                'website',
                'rating',
                'reviews',
                'photos',
                'user_ratings_total',
            ],
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
        async getMap() {
            await this.getUserLocation();
            this.loader.load().then(() => {
                console.log(this.mapOptions);
                console.log(this.userLocation);
                if (this.userLocation != null) {
                    this.mapOptions.center = this.userLocation;
                    this.placesRequest.location = this.userLocation;
                }
                console.log(this.mapOptions);

                this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
                this.infowindow = new google.maps.InfoWindow();
                this.placesService = new google.maps.places.PlacesService(this.map);

                this.markers = [
                    new google.maps.Marker({
                        position: this.mapOptions.center,
                        map: this.map,
                        label: 'You',
                    }),
                ];

                if (this.markers.length === 1) {
                    this.placesService.textSearch(this.placesRequest, (results, status) => {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (let i = 0; i < results.length; i++) {
                                const place = results[i];
                                let placeId = place.place_id;
                                let request = {
                                    placeId: placeId,
                                    fields: this.placesRequestFields,
                                };
                                this.placesService.getDetails(request, this.callback);
                            }
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
                    this.markers.forEach((marker) => {
                        marker.setMap(null);
                    });
                    this.markers = [];

                    // For each place, get the icon, name and location.
                    const bounds = new google.maps.LatLngBounds();

                    for (let i = 0; i < places.length; i++) {
                        const place = places[i];
                        if (!place.geometry || !place.geometry.location) {
                            console.log('Returned place contains no geometry');
                            return;
                        }

                        let request = {
                            placeId: place.place_id,
                            fields: this.placesRequestFields,
                        };

                        this.placesService.getDetails(request, this.callback);

                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    }
                    this.map.fitBounds(bounds);
                });
            });
        },
        callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                this.markers.push(this.createMarker(place));
            }
        },
        createMarker(place) {
            if (!place.geometry || !place.geometry.location) return;

            const marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, 'click', () => {
                let infoHtml = `<div>`;
                if (place.name) {
                    if (place.website || place.url) {
                        let placeUrl = place.website || place.url || '';
                        infoHtml += `<h5><a href='${placeUrl}' target="_blank">${place.name}</a></h5>`;
                    }
                }
                if (place.formatted_address) {
                    infoHtml += `<p>Located at ${place.formatted_address}</p><a class="btn btn-info text-white" target="_blank" href="/weather?location=${place.formatted_address}">Get Weather&nbsp&nbsp<i class="bi bi-cloud-fill"></i></a><br/>`;
                }
                if (place.price_level && place.price_level > 0) {
                    infoHtml += `<p>Price: ${place.price_level}/5</p>`;
                }
                if (place.rating && place.rating > 0 && place.user_ratings_total) {
                    infoHtml += `<p><span>Rated</span><span class="rating"> `;
                    for (let i = 0; i < Math.floor(place.rating); i++) {
                        infoHtml += `<i class="bi bi-star-fill me-1 text-warning"></i>`;
                    }
                    for (let i = 0; i < 5 - Math.floor(place.rating); i++) {
                        infoHtml += `<i class="bi bi-star me-1 text-warning"></i>`;
                    }
                    infoHtml += `</span><span>by ${place.user_ratings_total} people</span></p>`;
                }
                if (place.photos.length > 0) {
                    infoHtml += `
                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel" data-interval="false">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img class="d-block mx-auto img-fluid" style="height:250px" src=${place.photos[0].getUrl()}>
                            </div>

                    `;
                    for (let i = 1; i < place.photos.length; i++) {
                        const photo = place.photos[i];
                        infoHtml += `
                        <div class="carousel-item">
                            <img class="d-block mx-auto img-fluid" style="height:250px" src=${photo.getUrl()}">
                        </div>
                        `;
                    }
                    infoHtml += `
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon text-light bg-dark" aria-hidden="true"></span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon text-light bg-dark" aria-hidden="true"></span>
                        </a>
                    </div>`;
                }
                infoHtml += `</div>`;
                this.infowindow.setContent(infoHtml);
                this.infowindow.open(this.map, marker);
                this.map.panTo(place.geometry.location);
            });

            return marker;
        },
        getCoordinates() {
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        },
        async getUserLocation() {
            try {
                let position = await this.getCoordinates();
                if (position) {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                } else {
                    this.userLocation = null;
                }
            } catch (error) {
                this.userLocation = null;
            }
        },
    },
};
</script>
