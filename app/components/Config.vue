<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Settings, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="Config" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <StackLayout height="100%">
                    <StackLayout width="95%" marginTop="15" backgroundColor="#FFFFFF" borderRadius="5" paddingTop="5">
                        <GridLayout columns="*,*,*" rows="auto">
                            <Button col="0" text="Revert" @tap="config = backupConfig"></Button>
                            <Button col="1" :text="!editable ? 'Edit' : 'Stop'" @tap="editable = !editable"></Button>
                            <Button col="2" text="Save" @tap="save"></Button>
                        </GridLayout>
                        <TextView v-show="error" v-model="error" fontSize="12" editable="false" backgroundColor="#f8d7da" color="#721c24" marginLeft="5" marginRight="5"></TextView>
                        <TextView v-model="config" fontSize="11" :editable="editable"
                                  :backgroundColor="!editable ? '#EEEEEE' : '#ffffe0'"
                                  marginLeft="5" marginRight="5"
                                  borderWidth="1" :borderColor="!editable ? '#d6d8db' : '#ffeeba'"></TextView>
                        <ActivityIndicator ios:marginTop="-30" color="orange" :busy="loading"></ActivityIndicator>
                    </StackLayout>

                </StackLayout>
            </StackLayout>

        </GridLayout>
    </page>
</template>

<script>
    import axios from "axios";
    import common from "./mixins/common";
    const yamlLint = require('yaml-lint');
    const moment = require('moment');
    const base64 = require('base-64');
    const utf8 = require('utf8');

    export default {
        mixins: [common],
        mounted() {
            this.loading = true;
            console.log();
            axios.get(this.api+"/server/raw_config").then((response) => {
                this.config = base64.decode(response.data.raw_config);
                this.backupConfig = this.config;
                this.loading = false;
            }).catch((error) => {
                this.loading = false;
            });
        },
        methods: {
            save() {
                this.error = null;
                yamlLint.lint(this.config).then(() => {
                    const bytes = utf8.encode(this.config);
                    const encodedStr = base64.encode(bytes);
                    axios.post(this.api+"/server/raw_config", {
                        raw_config: encodedStr
                    }).then(response => {
                        alert({
                            title: response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1),
                            message: response.data.message,
                            okButtonText: "Ok"
                        });
                    }).catch(error => {
                        alert({
                            title: "Update failed",
                            message: error,
                            okButtonText: "Ok"
                        });
                    });
                }).catch((error) => {
                    this.error = error;
                });
            }
        },
        data() {
            return {
                error: null,
                config: null,
                loading: false,
                editable: false,
                backupConfig: null,
                api: this.$store.getters.getServerUrl,
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .bottom-gradient {
        background: #16222A;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to bottom, #3A6073, #16222A);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to bottom, #3A6073, #16222A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
</style>
