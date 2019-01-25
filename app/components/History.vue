<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Home, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="History" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical">
                    <StackLayout>

                        <StackLayout width="95%" marginTop="15" backgroundColor="#FFFFFF" borderRadius="5" paddingTop="5">
                            <ListView ref="listView" for="item in listViewData" >
                                <v-template>
                                    <GridLayout columns="auto,*" rows="*, *" paddingLeft="10" paddingTop="5" paddingBottom="5" paddingRight="5">
                                        <Image col="0" row="0" v-show="item.poster_url.length > 0" :src="item.poster_url" marginRight="10"
                                               stretch="aspectFill" height="100" borderRadius="5" rowSpan="2"></Image>
                                        <Label col="1" row="0" fontSize="11" class="font-weight-normal"
                                               :text="item.title" textWrap="true" verticalAlignment="top"></Label>
                                        <Label col="1" row="1" fontSize="10" class="font-weight-normal" :text="readableDate(item)" textWrap="true"></Label>
                                    </GridLayout>
                                </v-template>
                            </ListView>
                        </StackLayout>

                    </StackLayout>
                </ScrollView>
            </StackLayout>

        </GridLayout>
    </page>
</template>

<script>
    import common from "./mixins/common";
    const moment = require('moment');

    export default {
        mixins: [common],
        computed: {
            listViewData() {
                return this.$store.getters.allHistory;
            }
        },
        methods: {
            readableDate(item) {
                return moment(item.dl_time).format('Do MMM YYYY h:mm a');
            }
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
</style>
