<template>
    <Page class="page" actionBarHidden="false" backgroundSpanUnderStatusBar="true">

        <ActionBar title="Settings" class="action-bar" />

        <ScrollView orientation="vertical" width="100%" class="main-bg">
            <StackLayout marginTop="15">

                <ScrollView orientation="horizontal" scrollBarIndicatorVisible="false" width="100%">
                    <StackLayout orientation="horizontal" width="100%">
                        <CardView margin="10" height="50dp" width="95%" @tap="logout" backgroundColor="#FFFFFF"
                                   elevation="40" radius="5" verticalAlignment="center">
                            <StackLayout horizontalAlignment="left" verticalAlignment="center">
                                <Label fontSize="16" color="#000000" text="Log out" marginLeft="20"></Label>
                            </StackLayout>
                        </CardView>

                    </StackLayout>
                </ScrollView>
            </StackLayout>
        </ScrollView>

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
    .action-bar {
        background-color: #3A6073;
    }

    .main-bg {
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    }
</style>
