<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <Image class="logo" src="~/assets/images/flexget_logo.png"></Image>
                <!--<LottieView width="300" height="300" src="lottie-action.json" loop="true" autoplay="true"></LottieView>-->

                <GridLayout rows="auto, auto, auto, auto">
                    <StackLayout row="0" class="input-field">
                        <TextField class="input" hint="Username" :isEnabled="!processing" autocorrect="false"
                                   autocapitalizationType="none" v-model="user.username"
                                   returnKeyType="next"></TextField>
                        <StackLayout class="hr-light-blue"></StackLayout>
                    </StackLayout>

                    <StackLayout row="1" class="input-field">
                        <TextField class="input" ref="password" :isEnabled="!processing"
                                   hint="Password" secure="true" v-model="user.password"
                                   returnKeyType="next"></TextField>
                        <StackLayout class="hr-light-blue"></StackLayout>
                    </StackLayout>

                    <StackLayout row="2" class="input-field">
                        <TextField class="input" ref="host" :isEnabled="!processing"
                                   hint="Server url" v-model="user.server"
                                   returnKeyType="done"></TextField>
                        <StackLayout class="hr-light-blue"></StackLayout>
                    </StackLayout>

                    <ActivityIndicator rowSpan="4" :busy="processing"></ActivityIndicator>
                </GridLayout>

                <Button text="Log In" :isEnabled="!processing"
                        @tap="submit" class="btn btn-primary btn-rounded-lg"></Button>
            </StackLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import axios from "axios";
    export default {
        data() {
            return {
                isLoggingIn: true,
                processing: false,
                user: {
                    username: "flexget",
                    password: "",
                    server: "",
                }
            };
        },
        methods: {
            submit() {
                if (!this.user.username || !this.user.password) {
                    this.alert(
                        "Please provide both your username and password."
                    );
                    return;
                }

                this.processing = true;
                this.login();
            },
            login() {
                axios.post(this.user.server+"/auth/login/?remember=true", {
                    username: this.user.username,
                    password: this.user.password
                })
                    .then(() => {
                        this.processing = false;
                        this.$store.dispatch('login', this.user);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.processing = false;
                        this.alert(
                            "Unable to connect to server."
                        );
                    });
            },
            alert(message) {
                return alert({
                    title: "Error",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }

    .logo {
        margin-bottom: 50;
        height: 200;
        font-weight: bold;
    }

    .input-field {
        margin-bottom: 25;
    }

    .hr-light-blue {
        background-color: $light-blue;
        height: 1px;
        border: 0;
    }

    .input {
        font-size: 18;
        placeholder-color: #A8A8A8;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .bold {
        color: #000000;
    }
</style>
