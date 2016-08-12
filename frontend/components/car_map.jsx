const React = require('react');
const ReactDOM = require('react-dom');

const Link = require('react-router').Link;
const ErrorStore = require('../stores/error_store');
const hashHistory = require('react-router').hashHistory;

const CarActions = require('../actions/car_actions')
const CarStore = require('../stores/car_store')
const CarIndex = require('./car_index')

const CarMap = React.createClass({

  componentDidMount(){
    this.infowindow = new google.maps.InfoWindow();
    this.markers = [];

    const mapDOMNode = ReactDOM.findDOMNode(this.refs.map);
    const mapOptions = {
      center: {lat: this.props.lat, lng: this.props.lng},
      zoom: 12
    };

    this.map = new google.maps.Map(mapDOMNode, mapOptions);

    CarStore.addListener(this.createMarkers);
    this._searchLocationListener();

    let map = this.map
    let center = {lat: this.props.lat, lng: this.props.lng}
    let latlng = new google.maps.LatLng(center)
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        // alert(map.getBounds().contains(latlng))
    });
  },


  createMarkers(){
    const cars = CarStore.all();
    const cars_arr = [];

    for (var index in cars){
      cars_arr.push(cars[index]);
    };

    cars_arr.forEach(car => {
      let marker = new google.maps.Marker({
        position: this.position(car.lat, car.lng),
        map: this.map,
        carId: car.id
      });

      const content = `<img id='map-pic' src=${car.image_url} class='map-picture'/>` +
                `<div class='infowindow-detail'>
                    <h3 class='map-car-name'>${car.year} ${car.manufacturer} ${car.model}</h3>
                    <h3>$${car.price} / day</h3>
                  </div>`

      marker.addListener('click', () => {
        const markerCar = marker.carId;
        this.infowindow.setContent(content);
        this.infowindow.open(this.map, marker);

        google.maps.event.addDomListener(document.getElementById('map-pic'), 'click', () => {
          hashHistory.push('/cars/' + markerCar)
        })
      });

      this.markers.push(marker);
    });
  },

  position(x, y){
    return {lat: x, lng: y};
  },

  _searchLocationListener(){
    let map = this.map;

    window.autocomplete.addListener('place_changed', () => {
      const address = window.autocomplete.getPlace().geometry.location
      const coords = {
        lat: address.lat(),
        lng: address.lng()
      }
      map.setCenter(coords);
      map.setZoom(12);
    });
  },


  // inBounds(latLng){
  //   let map = this.map
  //
  //   google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
  //     return map.getBounds().contains(latLng)
  //   });
  //
  // },

  render(){
    return(
      <div>
        <div className='map' ref='map'>
        </div>

        <div>
          <CarIndex inBounds={this.inBounds} />
        </div>
      </div>
    );
  }
});

module.exports = CarMap;
