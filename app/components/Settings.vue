<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Home, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="Settings" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical" width="100%" class="main-bg" height="100%">

                    <StackLayout marginTop="15" marginLeft="5" marginRight="5">

                        <Button text="Config" @tap="goToPage($routes.Config)" ios:class="settings-button"></Button>
                        <Button text="Tasks" @tap="goToPage($routes.Tasks)" ios:class="settings-button"></Button>
                        <Button text="Seen" @tap="goToPage($routes.Seen)" ios:class="settings-button"></Button>
                        <Button text="Database Management" @tap="goToPage($routes.Database)" ios:class="settings-button"></Button>
                        <Button text="Log out" @tap="logout" ios:class="settings-button"></Button>

                        <StackLayout marginTop="20">
                            <Label :text="'API Version '+$settings.getString('api-version')" horizontalAlignment="center" fontSize="12"></Label>
                        </StackLayout>
                        <StackLayout>
                            <Label :text="'App Version '+version" horizontalAlignment="center" fontSize="12"></Label>
                        </StackLayout>
                    </StackLayout>
                </ScrollView>
            </StackLayout>

        </GridLayout>
    </page>
</template>

<script>
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
            logout() {
                this.$store.dispatch('logout');
            },
        },
        data() {
            return {
                //
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
