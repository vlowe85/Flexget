<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Home, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="History" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical">
                    <StackLayout height="100%">

                        <StackLayout width="95%" marginTop="15" backgroundColor="#FFFFFF" borderRadius="5" paddingTop="5">
                            <ListView ref="listView" for="item in listViewData" @itemTap="onItemTap" @loadMoreItems="onLoadMoreItems">
                                <v-template>
                                    <GridLayout columns="auto,*" rows="*, *, *, *" paddingLeft="10" paddingTop="5" paddingBottom="5" paddingRight="5">
                                        <ImageCacheIt col="0" row="0"
                                                      :imageUri="hasPoster(item) ? item.poster_url : '~/assets/images/thumbnail_placeholder.jpg'"
                                                      stretch="aspectFill"
                                                      borderRadius="5"
                                                      marginRight="10"
                                                      height="100"
                                                      width="70"
                                                      rowSpan="4">
                                        </ImageCacheIt>
                                        <Label col="1" row="0" fontSize="11" class="font-weight-normal"
                                               :text="item.title" textWrap="true" verticalAlignment="top"></Label>
                                        <Label col="1" row="1" fontSize="10" class="font-weight-normal" :text="item.task"
                                               textWrap="true"></Label>
                                        <Label col="1" row="2" fontSize="10" class="font-weight-normal" :text="item.details"
                                               textWrap="true"></Label>
                                        <Label col="1" row="3" fontSize="10" class="font-weight-normal" :text="readableDate(item)"
                                               textWrap="true"></Label>
                                    </GridLayout>
                                </v-template>
                            </ListView>
                            <ActivityIndicator ios:marginTop="-30" color="orange" :busy="loading"></ActivityIndicator>
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
            hasPoster(item) {
                return item.poster_url && item.poster_url.length > 0 && !item.poster_url.endsWith('null');
            },
            readableDate(item) {
                return moment(item.dl_time).format('Do MMM YYYY h:mm a');
            },
            onItemTap(event) {
                this.showDetails(event.item);
            },
            onLoadMoreItems() {
                if(this.loadMoreEnabled && !this.loading) {
                    this.loading = true;
                    this.$store.dispatch('getHistory', this.page++).then((results) => {
                        if(!results) {
                            setTimeout(() => {
                                this.loading = false;
                                return this.loadMoreEnabled = false;
                            }, 1000);
                        }
                        this.$store.dispatch('queryHistory');
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                    }).catch(() => {
                        this.loadMoreEnabled = false;
                        this.loading = false;
                    });
                }
            }
        },
        data() {
            return {
                page: 1,
                loading: false,
                loadMoreEnabled: true,
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
