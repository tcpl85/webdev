(function() {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    function FlickrService($http) {
        var api = {
            "searchPhotos"   : searchPhotos,
        };

        return api;

        function searchPhotos(searchTerm) {
            var key = "d8ffad4687f1de676dcb9e009d097ace";
            var secret = "80990bf23ede0ba6";
            var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();