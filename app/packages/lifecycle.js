import axios from "axios";

const application = require("tns-core-modules/application");

export default function (Vue)  {
    Vue.cycle = {
        init(vm) {
            console.log('!@# starting init in lifecycle');

            application.on(application.launchEvent, (args) => {
                if (args.android) {
                    // For Android applications, args.android is an android.content.Intent class.
                    console.log("Launched Android application with the following intent: " + args.android + ".");
                } else if (args.ios !== undefined) {
                    // For iOS applications, args.ios is NSDictionary (launchOptions).
                    console.log("Launched iOS application with options: " + args.ios);
                }
                vm.$store.dispatch('getLoggedInUser').then(response => {
                    if(response.data.length > 0) {
                        axios.post(response.data[0][3]+"/auth/login/?remember=true", {
                            username: response.data[0][1],
                            password: response.data[0][2]
                        })
                            .then((response2) => {
                                vm.$settings.setString("api-version", response2.headers['api-version']);
                                vm.$store.dispatch('getHistory').then(() => {
                                    vm.$store.dispatch('updateMovieDb').then(() => {
                                        vm.$store.dispatch('queryHistory');
                                    });
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                return alert({
                                    title: "Damn it!",
                                    okButtonText: "OK",
                                    message: "Unable to connect to server."
                                });
                            });
                    }
                }, error => {
                    console.error("Failed to auto login user.")
                });
            });

            application.on(application.suspendEvent, (args) => {
                if (args.android) {
                    // For Android applications, args.android is an android activity class.
                    console.log("!@# suspendEvent Activity: " + args.android);
                } else if (args.ios) {
                    // For iOS applications, args.ios is UIApplication.
                    console.log("!@# suspendEvent UIApplication: " + args.ios);
                }

            });

            application.on(application.resumeEvent, (args) => {
                if (args.android) {
                    // For Android applications, args.android is an android activity class.
                    console.log("!@# resumeEvent Activity: " + args.android);
                } else if (args.ios) {
                    // For iOS applications, args.ios is UIApplication.
                    console.log("!@# resumeEvent UIApplication: " + args.ios);
                }
                console.log('!@# resuming for both platforms');
                vm.$store.dispatch('getLoggedInUser').then(response => {
                    if(response.data.length > 0) {
                        axios.post(response.data[0][3]+"/auth/login/?remember=true", {
                            username: response.data[0][1],
                            password: response.data[0][2]
                        })
                            .then((response2) => {
                                vm.$settings.setString("api-version", response2.headers['api-version']);
                                vm.$store.dispatch('getHistory').then(() => {
                                    vm.$store.dispatch('updateMovieDb').then(() => {
                                        vm.$store.dispatch('queryHistory');
                                    });
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                return alert({
                                    title: "Damn it!",
                                    okButtonText: "OK",
                                    message: "Unable to connect to server."
                                });
                            });
                    }
                }, error => {
                    console.error("Failed to auto login user.")
                });
            });

            application.on(application.displayedEvent, (args) => {
                // args is of type ApplicationEventData
                console.log("displayedEvent");
            });

            application.on(application.orientationChangedEvent, (args) => {
                // args is of type OrientationChangedEventData
                console.log(args.newValue); // "portrait", "landscape", "unknown"
            });


            application.on(application.exitEvent, (args) => {
                if (args.android) {
                    // For Android applications, args.android is an android activity class.
                    console.log("!@# exitEvent Activity: " + args.android);
                } else if (args.ios) {
                    // For iOS applications, args.ios is UIApplication.
                    console.log("!@# exitEvent UIApplication: " + args.ios);
                }
            });

            application.on(application.lowMemoryEvent, (args) => {
                if (args.android) {
                    // For Android applications, args.android is an android activity class.
                    console.log("!@# lowMemoryEvent Activity: " + args.android);
                } else if (args.ios) {
                    // For iOS applications, args.ios is UIApplication.
                    console.log("!@# lowMemoryEvent UIApplication: " + args.ios);
                }
            });

            application.on(application.uncaughtErrorEvent, (args) => {
                console.log("!@# uncaughtErrorEvent Error: " + args.error);
            });

        },

    }

    Object.defineProperties(Vue.prototype, {
        $cycle: {
            get() {
                return Vue.cycle;
            }
        }
    })
}