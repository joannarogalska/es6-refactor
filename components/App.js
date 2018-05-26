var GIPHY_PUB_KEY = 'Esuzoqt6EbFxIYm2MHpVgTuSUBj1NdtD';
var GIPHY_API_URL = 'http://api.giphy.com';

App = React.createClass({

    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1.
        this.setState({
            loading: true  // 2.
        });
        this.getGif(searchingText).then(function(gif){
            this.setState({  // 4
                loading: false,  // a
                gif: gif,  // b
                searchingText: searchingText  // c
            });
        }.bind(this)).catch(function(error){
            console.log(error);
            this.setState({
                loading: false,
            });
        }.bind(this));
    },

    getGif: function(searchingText) {  // 1.
        return new Promise(
            function (resolve, reject) {
                var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
                var xhr = new XMLHttpRequest();  // 3.
                xhr.open('GET', url);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText).data; // 4.
                        var gif = {  // 5.
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        };
                        resolve(gif);
                    }
                    else {
                        reject(new Error(xhr.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
                    }
                };
                xhr.send();
            });

    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});