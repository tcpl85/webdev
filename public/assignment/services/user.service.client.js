/**
 * Created by allday85 on 10/4/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http)
    {
        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "login" : login,
            "logout" : logout,
            "register" : register,
            "findCurrentUser" : findCurrentUser
        };

        return api;

        function register(user) {
            return $http.post("/api/register", user);
        }

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function findCurrentUser(){
            var url = "/api/user";
            return $http.get(url);
        }

        function findUserById(userId) {
            var url = "/api/user/"+userId;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + '&password=' + password;
           return $http.get(url);
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }

        function login(user){
            return $http.post("/api/login", user);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }
    }
})();