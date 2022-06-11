import React from 'react';

import './App.css';
import  {SearchBar}  from '../SearchBar/SearchBar';
import  {SearchResults}  from '../SearchResults/SearchResults';
import  {Playlist}  from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

Spotify.getAccessToken();

class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: []
    };


    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }




//renamed from addTrackToPlaylist make sure to catch all the renames
//the dots are spread operators
addTrack(track) {
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track]
      }));
    }
  }

  //update playlist function that accepts a name and resets the playlistName state
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }


  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName("");
    console.info(trackUris);
  }

  search(term) {
    Spotify.search(term)
      .then(searchResults => this.setState({
        searchResults: searchResults
      }));
  }

//methods are bound to 'addTrack', 'updatePlaylistName'
// 'removeTrack', 'savePlaylist', 'search' so there is no need to put the ()
  
render() {

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults 
            searchResults={this.state.searchResults}
            onAdd={this.addTrack}/>

          <Playlist 
            name={this.state.playlistName} 
            tracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} 
            onNameChange={this.updatePlaylistName} 
            onSave={this.savePlaylist}/>
      </div>
    </div>
  </div>
  );
  }

  }

export default App;
