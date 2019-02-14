<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Settings, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="Database Management" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical" width="100%" class="main-bg" height="100%">
                    <StackLayout marginTop="15" marginLeft="5" marginRight="5">
                        <Label text="Cleaning up removes all old/un-needed data from the database."
                               textWrap="true"></Label>
                        <Button text="Cleanup" @tap="submit('cleanup')" ios:class="settings-button"></Button>
                        <Label text="Vacuuming potentially increases performance and decreases database size."
                               textWrap="true"></Label>
                        <Button text="Vacuum"  @tap="submit('vacuum')" ios:class="settings-button"></Button>
                    </StackLayout>
                </ScrollView>
            </StackLayout>

        </GridLayout>
    </page>
</template>

<script>
    import axios from "axios";
    import common from "./mixins/common";

    export default {
        mixins: [common],
        computed: {
            //
        },
        mounted() {
            //
        },
        methods: {
            submit(operation) {
                axios.post(this.api+"/database", {
                    operation: operation
                }).then(response => {
                    alert({
                        title: response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1),
                        message: response.data.message,
                        okButtonText: "Ok"
                    });
                }).catch(error => {
                    alert({
                        title: "Operation failed",
                        message: error,
                        okButtonText: "Ok"
                    });
                });
            }
        },
        data() {
            return {
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

    .main-bg {
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    }
</style>
