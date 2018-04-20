/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, $rootScope, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.updateUser = updateUser;
        vm.init = init;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {

            UserService
                .findCurrentUser()
                .success(function(user){
                    if('0' !== user) {
                        vm.user = user;
                        if(!vm.userId)
                            vm.userId = vm.user._id;
                    }
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function updateUser() {
            var promise = UserService.updateUser(vm.userId, vm.user);
            promise
                .success(function(status){
                    init();
                })
                .error(function(error){
                    console.log(error);
                });
         }

        function deleteUser() {
            var promise = UserService.deleteUser(vm.userId);
            promise
                .success(function(){
                    $location.url("/login");
                })
                .error(function(msg){
                    console.log(msg);
                });
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    },
                    function(error){
                        console.log(msg);
                    }
                );
        }
    }
})();