let accessToken;
const clientId = 'a114096af96548baa8a4f3d22976bec5';
const redirectURI = 'http://localhost:3000/';

const Spotify = {

    getAccessToken() {
        console.log("entro en busqueda de token")

        if (accessToken) {
            console.log("ya tengo token")

            return accessToken;

        } else {
            console.log("Busco el token")
            const newToken = window.location.href.match(/access_token=([^&]*)/);
            const Expires = window.location.href.match(/expires_in=([^&]*)/);
            console.log("que tengo: "+newToken+" "+Expires)
            if (newToken && Expires) {
                accessToken = newToken[1];
                window.setTimeout(() => accessToken = '', Number(Expires[1]) * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirectURI}`;
            }
        }
    },
    search(inputTerm) {
        console.log("entro en search")

        const header = {
            Authorization: `Bearer ${Spotify.getAccessToken()}`
        }
        console.log(header)

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${inputTerm}`, {headers: header}).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => {
            console.log(networkError.message);
        }).then(responseJson => {

            if (!responseJson.tracks) {
                console.log("no hay nada")

                return [];
            }
            console.log("habia algo")


            return responseJson.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));


        })


    },
    savePlaylist(playlistName, arrayOfUris) {
        if (!(playlistName && arrayOfUris.length)){
            return
        }
        const header = {
            Authorization: `Bearer ${Spotify.getAccessToken()}`
        }
        let user;
        let playlist;
       return fetch(`https://api.spotify.com/v1/me`, {headers: header})
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed!');
            }, networkError => {
                console.log(networkError.message);
            })
            .then(responseJson => {

            user = responseJson.id;
            return fetch(`https://api.spotify.com/v1/users/${user}/playlists`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify({name: playlistName})
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed!');
            }, networkError => {
                console.log(networkError.message);
            }).then(responseJson => {
                playlist = responseJson.id;
                return fetch(`https://api.spotify.com/v1/users/${user}/playlists/${playlist}/tracks`, {
                        method: 'POST',
                        headers: header,
                        body: JSON.stringify({uris: arrayOfUris})
                    }
                )
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed!');
                }, networkError => {
                    console.log(networkError.message);
                })
                .then(response => response)


        })

    }
}
export default Spotify;

