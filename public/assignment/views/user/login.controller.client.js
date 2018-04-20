/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, $rootScope, UserService)
    {
        var vm = this;
        vm.login = login;

        function login(user)
        {
            vm.clicked = true;
            //var username = document.getElementById("username");
            //console.log(username.checkValidity());
            if(undefined !== user && undefined !== user.username && undefined !== user.password)
            {
                UserService
                    .login(user)
                    .success(function(user){
                        if( '0' === user) {
                            vm.error = "No such user";
                        } else{
                            $rootScope.currentUser = user;
                            $location.url("/user");
                        }
                    })
                    .error(function(msg){
                        console.log(msg);
                        vm.error = "No such user";
                    });

            }
        }
    }
})();