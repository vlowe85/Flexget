<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true" @loaded="pageLoaded">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <PullToRefresh @refresh="refresh">
                    <ScrollView orientation="vertical">
                        <StackLayout>

                            <GridLayout verticalAlignment="top" height="40"
                                        width="100%" rows="auto" columns="*,auto">
                                <Label col="0" row="0" text="Home" class="font-weight-normal"
                                       color="#ffffff" padding="10" fontSize="18"></Label>
                                <Image col="1" row="0" horizontalAlignment="right" height="24" width="24" marginRight="10"
                                       padding="10" @tap="goToPage($routes.Settings)" src="~/assets/images/icons/more_icon.png"></Image>
                            </GridLayout>

                            <GridLayout columns="auto,*,auto" rows="auto">
                                <Label col="0" row="0" class="font-weight-normal"
                                       paddingLeft="10" fontSize="15" color="#ffffff"
                                       text="Latest downloads"></Label>
                                <GridLayout col="2" row="0"  columns="auto,auto" rows="auto" @tap="goToPage($routes.History)">
                                    <Label col="0" row="0" class="font-weight-normal" marginRight="5" marginBottom="2"
                                           fontSize="14" color="#ffffff" text="History"></Label>
                                    <Image col="1" row="0" horizontalAlignment="right" height="12" marginRight="10"
                                           src="~/assets/images/icons/fwd-icon.png"></Image>
                                </GridLayout>
                            </GridLayout>

                            <ScrollView v-show="history.length > 0" orientation="horizontal" scrollBarIndicatorVisible="false">
                                <StackLayout orientation="horizontal">
                                    <CardView v-for="item in history" :key="item.id" margin="5" height="162dp" width="108dp" backgroundColor="transparent"
                                              elevation="40" radius="5" verticalAlignment="center" @tap="showDetails(item)">
                                        <StackLayout>
                                            <Image v-show="item.poster_url.length > 0" :src="item.poster_url"
                                                   stretch="aspectFill" height="162dp" borderRadius="5"></Image>
                                            <StackLayout horizontalAlignment="left" marginLeft="5"
                                                         verticalAlignment="center">
                                                <Label fontSize="18" class="font-weight-normal" horizontalAlignment="left"
                                                       color="#FFFFFF" :text="item.title"></Label>
                                            </StackLayout>
                                        </StackLayout>
                                    </CardView>

                                </StackLayout>
                            </ScrollView>


                            <StackLayout v-show="popularItem" height="300" backgroundColor="#FFFFFF" borderRadius="5" margin="10" @tap="showDetails(popularItem)">
                                <Image v-show="popularItem" :src="popularItem ? popularItem.backdrop_url : ''"
                                       stretch="aspectFill" height="162dp" borderTopLeftRadius="5" borderTopRightRadius="5"></Image>

                                <GridLayout columns="auto,*,auto" rows="auto, auto">
                                    <GridLayout col="0" row="0" columns="auto,*" rows="auto">
                                        <Image col="0" row="0" src="~/assets/images/icons/love.png" height="12" marginLeft="10" marginTop="10"></Image>
                                        <Label col="1" row="0" fontSize="12" class="font-weight-normal" horizontalAlignment="left" marginLeft="5"
                                               marginTop="10" color="#2c3e50" text="popular"></Label>
                                    </GridLayout>
                                    <Label col="2" row="0" class="font-weight-normal" marginTop="10"
                                           marginRight="20" fontSize="12" color="#2c3e50" horizontalAlignment="right"
                                           text="release date"></Label>
                                    <Label col="0" row="1" fontSize="16" class="font-weight-normal" horizontalAlignment="left" marginLeft="10"
                                           color="#2c3e50" :text="popularItem ? popularItem.parsed_title : 'Popular item'"></Label>
                                    <Label col="2" row="1" class="font-weight-normal" horizontalAlignment="right"
                                           marginRight="20" fontSize="14" color="#2c3e50"
                                           :text="popularItemDate"></Label>
                                </GridLayout>
                                <Label fontSize="12" class="font-weight-normal" horizontalAlignment="left" margin="10" textWrap="true"
                                       color="#2c3e50" :text="popularItem ? popularItem.overview : ''"></Label>
                            </StackLayout>

                        </StackLayout>
                    </ScrollView>
                </PullToRefresh>
            </StackLayout>

        </GridLayout>
    </page>
</template>

<script>
    import common from "./mixins/common";
    import details from "./home/historyDetail";
    const ptn = require('parse-torrent-name');
    const moment = require('moment');

    export default {
        mixins: [common],
        computed: {
            history() {
                return this.$store.getters.latestDownloads;
            },
            popularItem() {
                return this.$store.getters.mostPopularRecently;
            },
            popularItemDate() {
                return this.popularItem ? this.popularItem.release_date ?
                    moment(this.popularItem.release_date, "YYYY-MM-DD").format("Do MMM YYYY") : this.popularItem.first_air_date : '';
            }
        },
        created() {
            this.$store.dispatch('getHistory').then(() => {
                this.$store.dispatch('queryHistory');
            });
        },
        mounted() {
            const vm = this;
            this.$cycle.init(vm);
        },
        methods: {
            refresh(args) {
                let pullRefresh = args.object;
                this.$store.dispatch('getHistory').then(() => {
                    pullRefresh.refreshing = false;
                });
            },
            showDetails(item) {
                this.$showModal(details, {
                    props: { item: item },
                    fullscreen: true,
                });
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

</style>
