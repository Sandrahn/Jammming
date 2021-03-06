import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends  React.Component {
    constructor(props){
        console.log("entro en contructor")

        super(props)
        this.state= {
            "searchResults": [],
            "playlistName": "New PlayList",
            "playlistTracks": []
    }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        let tracks = this.state.playlistTracks;
        if (!tracks.find(trackIndex => trackIndex.id === track.id))
          {
            tracks.push(track);
            this.setState({playlistTracks: tracks});
          }
    }

    removeTrack(track) {
        let tracks = this.state.playlistTracks;
        let newTracks = tracks.filter(trackIndex => trackIndex.id !== track.id);
        this.setState({playlistTracks: newTracks});
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    savePlaylist() {
        let tracks = this.state.playlistTracks;
        if(tracks.length && this.state.playlistName) {
            Spotify.savePlaylist(this.state.playlistName, tracks.map(oneTrack => oneTrack.uri)).then(() => {
                this.setState({
                    playlistName: 'New PlayList',
                    playlistTracks: []
                });
                document.getElementById('PlayList-name').value = this.state.playlistName;
            });
        }
    }

    search(searchTerm) {
        console.log("entro en search")
        Spotify.search(searchTerm).then(results => {
            this.setState({searchResults: results});
        });
    }

  render() {
    return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
                <SearchBar onSearch={this.search} />
                <div className="App-playlist">
                    <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                    <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
                </div>
            </div>
        </div>
    );
  }
}

export default App;
