/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;

        function register(newUser, verifypassword) {
            if(undefined !== newUser && undefined !== newUser.username &&
                undefined !== newUser.password && undefined !== verifypassword) {
                if (newUser.password !== verifypassword) {
                    vm.error = "Verify Password must be the same as password";
                } else {

                    UserService
                        .register(newUser)
                        .success (function(user){
                            if('0' === user) {
                                vm.error = "The username already exists"
                            } else {
                                $rootScope.currentUser = user;
                                $location.url("/user/"+user._id);
                            }
                        })
                        .error(function(msg){
                           console.log(msg);
                        });
                }

            }
        }
    }
})();