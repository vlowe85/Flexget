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

                            <GridLayout columns="auto,*,auto" rows="auto" paddingBottom="5">
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

                            <!--<StackLayout>-->
                                <!--<LottieView height="130" width="auto" src="lottie-action.json" :autoplay="true" :loop="true" @loaded="lottieLoaded"></LottieView>-->
                            <!--</StackLayout>-->

                            <ScrollView v-show="history.length > 0" orientation="horizontal" scrollBarIndicatorVisible="false" class="fadeInDown">
                                <StackLayout orientation="horizontal">
                                    <CardView v-for="item in history" :key="item.id" margin="5" height="162dp" width="108dp" backgroundColor="transparent"
                                              elevation="40" radius="5" verticalAlignment="center" @tap="showDetails(item)">
                                        <StackLayout>
                                            <GridLayout rows="*" columns="*">
                                                <ImageCacheIt :ios:imageUri="item.poster_url && item.poster_url.length > 0 ? item.poster_url : '~/assets/images/20_dark.png'"
                                                              :android:imageUri="item.poster_url && item.poster_url.length > 0 ? item.poster_url : '~/assets/images/transparent.png'"
                                                              placeHolder="~/assets/images/20_dark.png"
                                                              errorHolder="~/assets/images/20_dark.png"
                                                              stretch="aspectFill"
                                                              borderRadius="5"
                                                              row="0" col="0"
                                                              height="162dp">
                                                </ImageCacheIt>
                                                <Label row="0" col="0" v-show="!item.poster_url || !item.poster_url.length" fontSize="10" padding="5" class="font-weight-normal"
                                                       horizontalAlignment="left" verticalAlignment="top" color="#FFFFFF" :text="item.title" textWrap="true"></Label>
                                            </GridLayout>
                                        </StackLayout>
                                    </CardView>

                                </StackLayout>
                            </ScrollView>


                            <StackLayout v-show="popularItem" backgroundColor="#FFFFFF" class="popularAnim"
                                         borderRadius="5" margin="10" @tap="showDetails(popularItem)">
                                <ImageCacheIt :imageUri="popularItem ? popularItem.backdrop_url : ''"
                                              placeHolder="~/assets/images/flexget_logo.png"
                                              borderTopRightRadius="5"
                                              borderTopLeftRadius="5"
                                              stretch="fill"
                                              height="162dp">
                                </ImageCacheIt>
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

                            <StackLayout backgroundColor="#FFFFFF" borderRadius="5" margin="10">
                                <Label fontSize="16" class="font-weight-normal" text="Upcoming Episodes" color="#2c3e50" margin="10"></Label>
                                <GridLayout columns="auto,*" rows="*, *, *, *" v-for="item in upcomingEpisodes"
                                            paddingLeft="10" paddingTop="5" paddingBottom="5" paddingRight="5">
                                    <ImageCacheIt col="0" row="0"
                                                  :imageUri="item.backdrop_url && item.backdrop_url.length > 0 ? item.backdrop_url : '~/assets/images/thumbnail_placeholder.jpg'"
                                                  stretch="aspectFill"
                                                  borderRadius="5"
                                                  marginRight="10"
                                                  height="50"
                                                  width="70"
                                                  rowSpan="4">
                                    </ImageCacheIt>
                                    <Label col="1" row="0" fontSize="11" class="font-weight-normal"
                                           :text="item.name+' Season '+item.next_season_number+' Episode '+item.next_episode_number" textWrap="true" verticalAlignment="top"></Label>
                                    <Label col="1" row="1" fontSize="10" class="font-weight-normal" :text="item.next_episode_name"
                                           textWrap="true"></Label>
                                    <!--<Label col="1" row="2" fontSize="10" class="font-weight-normal" :text="item.details"-->
                                           <!--textWrap="true"></Label>-->
                                    <Label col="1" row="3" fontSize="10" class="font-weight-normal" :text="readableDate(item.next_air_date)"
                                           textWrap="true"></Label>
                                </GridLayout>
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
            },
            upcomingEpisodes() {
                return this.$store.getters.upcomingEpisodes;
            }
        },
        mounted() {
            const vm = this;
            this.$cycle.init(vm);

            setTimeout(() => {
                this.$store.dispatch('getHistory').then(() => {
                    this.$store.dispatch('queryHistory');
                });
            }, 1000);
        },
        methods: {
            readableDate(date) {
                let parsedDate = moment(date);
                return "airs on "+parsedDate.format('Do MMM YYYY') + " "+parsedDate.fromNow();
            },
            lottieLoaded(args) {
                this.anim = args.object;
                this.anim.playAnimation();
                this.anim.playAnimation();
            },
            refresh(args) {
                let pullRefresh = args.object;
                this.$store.dispatch('getHistory').then(() => {
                    this.$store.dispatch('queryHistory');
                    pullRefresh.refreshing = false;
                });
            },
        },
        data() {
            return {
                anim: null,
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

    .popularAnim {
        /*opacity: 0;*/
        /*animation-name: bounceIn;*/
        /*animation-duration: 0.5s;*/
        /*animation-fill-mode: forwards;*/
        /*animation-delay: 0.2s;*/
        /*z-index: 100000;*/
    }

</style>
