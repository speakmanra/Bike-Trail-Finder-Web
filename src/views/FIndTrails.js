import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import Axios from "axios";

import "./FindTrails.css";

class FindTrails extends Component {
  state = {
    isLoading: false,
    firstLoad: true,
    trails: [],
    error: null,
    zip: "",
    lon: null,
    lat: null,
    distance: "50",
    redirect: false
  };

  apiRequest() {
    const { lat, lon, distance } = this.state;
    const locationSearch = `https://www.mtbproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=${distance}&maxResults=500&sort=distance&key=200482461-145880d2afee92517e23bef39c761571`;
    Axios.get(locationSearch)
      // .then(response => console.log(response))
      // pull the data
      .then(response =>
        response.data.trails.map(trail => ({
          name: `${trail.name}`,
          id: `${trail.id}`,
          stars: `${trail.stars}`,
          pic: `${trail.imgSqSmall}`,
          location: `${trail.location}`
        }))
      )
      //Update trails object
      .then(trails =>
        this.setState({
          trails,
          isLoading: false,
          firstLoad: false
        })
      )
      //Handle Errors
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getLocation() {
    this.setState({ isLoading: true });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null
        });
        this.apiRequest();
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  getAddressLocation = zip => {
    Axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyAj-LLHtQtEnncUguRkUKl6g7vPXkUrxOs`
    ).then(result => {
      this.setState({
        lat: result.data.results[0].geometry.location.lat,
        lon: result.data.results[0].geometry.location.lng
      });
      this.apiRequest();
    });
  };

  handleOnClick = () => {
    this.setState({ redirect: true });
  };

  onValueChange(value) {
    this.setState({
      distance: value
    });
    this.getLocation();
  }
  //Update search state
  updateSearch = e => {
    this.setState({ zip: e.target.value });
  };

  searchAddress = () => {
    this.setState({ isLoading: true });
    this.getAddressLocation(this.state.zip);
  };

  //Get location on startup
  componentDidMount() {
    this.getLocation();
  }

  render() {
    console.log(this.state.lat + this.state.lon);
    const { isLoading, trails } = this.state;
    if (this.state.redirect) {
      return <Redirect push to={`/findtrails/${this.state.trails.id}`} />;
    }
    return (
      <div>
        <div className='ui secondary  menu'>
          <Link to='/'>
            <button className='active item back-button'>
              <i className='angle left icon'></i>Back
            </button>
          </Link>

          <div className='right menu'>
            <div className='item'>
              <div className='ui icon input'>
                <input
                  type='text'
                  placeholder='Address'
                  onChange={this.updateSearch}
                  value={this.state.zip}
                  onSubmit={this.searchAddress}
                />
                <i
                  className='search link icon'
                  onClick={this.searchAddress}
                ></i>
              </div>
            </div>
          </div>
        </div>
        {/* 
              <Form>
                <Picker
                  mode='dropdown'
                  placeholder='50 Miles'
                  placeholderStyle={{ color: "#2874F0" }}
                  textStyle={{ color: "white" }}
                  note={false}
                  selectedValue={this.state.distance}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label='10 Miles' value='10' />
                  <Picker.Item label='50 Miles' value='50' />
                  <Picker.Item label='100 Miles' value='100' />
                  <Picker.Item label='200 Miles' value='200' />
                </Picker>
              </Form>
            </div>

            {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
          </div>
        ) : (
          <p></p>
        )} */}

        {!isLoading ? (
          <div className='ui inverted segment massive' id='mtb-list'>
            <div className='ui inverted relaxed divided list'>
              {trails.map(trail => (
                <div key={trail.id} className='item'>
                  <div className='right floated content'>
                    <i className='angle right icon'></i>
                  </div>
                  <img className='ui avatar image' src={trail.pic} alt='pic' />
                  <div className='content'>
                    <div className='header'>{trail.name}</div>
                    {trail.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className='ui active centered inline loader massive'
            id='loading'
          ></div>
        )}
      </div>
    );
  }
}

export default FindTrails;
