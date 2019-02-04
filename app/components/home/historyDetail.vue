<template>
    <Frame>
        <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
            <ScrollView top="0" left="0" height="100%" width="100%">
                <GridLayout rows="auto, *">
                    <GridLayout row="0" verticalAlignment="top" height="300">
                        <ImageCacheIt :imageUri="item.backdrop_url && item.backdrop_url.length > 0 ? item.backdrop_url : '~/assets/images/transparent.png'"
                                      verticalAlignment="top"
                                      stretch="aspectFill"
                                      resize="620,500"
                                      marginTop="-40"
                                      width="100%">
                        </ImageCacheIt>
                        <!--<Image :src="item.backdrop_url" marginTop="-40" verticalAlignment="top" height="500" width="100%" stretch="aspectFill"></Image>-->
                        <GridLayout  rows="auto, *, auto, auto, auto"
                                    columns="auto, *, auto" padding="15 10" height="100%"
                                    style="background: linear-gradient(to bottom, #253a46, rgba(0,0,0,0), rgba(0,0,0,0))">

                            <GridLayout row="0" col="0" columns="auto,*" rows="auto" @tap="$modal.close" android:marginTop="20">
                                <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" height="15" marginLeft="10" marginTop="10"></Image>
                                <Label col="1" row="0" fontSize="15" class="font-weight-normal text-left" horizontalAlignment="left" marginLeft="5"
                                       marginTop="10" color="#FFFFFF" text="Back"></Label>
                            </GridLayout>
                            <Label row="1" col="0" colSpan="3"
                                   padding="20" class="fa text-center" color="rgba(255, 255, 255, 0.6)"
                                   fontSize="100" text="" ></Label>
                            <Label row="2" col="0"
                                   colSpan="3" color="#fff" fontSize="25" fontWeight="bold"
                                   letterSpacing="0.05" :text="title"></Label>
                            <StackLayout row="3" col="0" colSpan="3" orientation="horizontal" marginTop="5">
                                <Label v-show="item.quality" padding="5 15" marginRight="2.5" color="#fff"
                                       :text="item.quality" class="round-corners"></Label>
                                <Label v-show="item.resolution" padding="5 15" marginRight="2.5" color="#fff"
                                       :text="item.resolution" class="round-corners"></Label>
                                <Label v-show="item.codec" padding="5 15" marginRight="2.5" color="#fff"
                                       :text="item.codec" class="round-corners"></Label>
                            </StackLayout>
                            <Label row="4" col="0"
                                colSpan="3" color="#fff" fontSize="15" :text="item.details"
                                opacity="0.6" marginTop="5"></Label>
                        </GridLayout>
                    </GridLayout>
                    <StackLayout row="1" marginTop="5" padding="10">
                        <GridLayout columns="auto, *, auto">
                            <Label col="0" textAlignment="left" class="synopsis--title" text="Synopsis"></Label>
                            <Label v-show="language.length > 0" col="2" padding="3 10" textAlignment="right" class="round-corners"
                                   color="#FFF" :text="language.toUpperCase()"></Label>
                        </GridLayout>
                        <Label marginTop="5" class="details--synopsis" color="#FFFFFF" :text="item.overview"
                               textWrap="true" letterSpacing="0.02" lineHeight="2"></Label>

                        <Label marginTop="15" textAlignment="left" class="details--title" text="Cast"></Label>

                        <StackLayout marginTop="5">
                            <ScrollView orientation="horizontal">
                                <StackLayout orientation="horizontal">
                                    <GridLayout rows="auto, auto, auto" v-for="actor in cast" :key="actor.id"
                                                marginRight="15">
                                        <ImageCacheIt borderRadius="5%" row="0"
                                                      :imageUri="actor.profile_path ? 'https://image.tmdb.org/t/p/w200'+actor.profile_path : 'https://via.placeholder.com/100/3A6073/FFFFFF?text=N/A'"
                                                      height="100" width="100" stretch="aspectFill"></ImageCacheIt>
                                        <Label row="1" fontSize="14" color="#fff"
                                               :text="actor.name"></Label>
                                        <Label row="2" fontSize="11" color="#fff"
                                               opacity="0.7" :text="actor.character"></Label>
                                    </GridLayout>
                                </StackLayout>
                            </ScrollView>
                        </StackLayout>

                        <StackLayout marginTop="15" v-for="ep in episode" :key="ep.id">
                            <GridLayout columns="auto, *, auto">
                                <Label col="0" textAlignment="left" class="details--title" :text="'Episode '+ep.episode_number+': '+ep.name"></Label>
                            </GridLayout>
                            <Label v-if="ep.overview.length > 0" marginTop="5" class="details--synopsis" color="#FFFFFF"
                                   :text="ep.overview" textWrap="true" letterSpacing="0.02" lineHeight="2"></Label>
                            <ImageCacheIt v-show="ep.still_path" :imageUri="ep.still_path && ep.still_path.length > 0 ? 'https://image.tmdb.org/t/p/original'+ep.still_path : '~/assets/images/20_dark.png'"
                                          ios:width="calc(100% +20px)"
                                          android:width="100%"
                                          marginRight="-10"
                                          marginLeft="-10"
                                          stretch="fill"
                                          marginTop="5"
                                          height="200">
                            </ImageCacheIt>
                        </StackLayout>

                        <StackLayout marginTop="15" >
                            <ScrollView orientation="horizontal">
                                <StackLayout orientation="horizontal">
                                    <GridLayout col="0" row="0" columns="auto,*" rows="auto" marginRight="15">
                                        <Image col="0" row="0" src="~/assets/images/icons/love.png" height="12"></Image>
                                        <Label col="1" row="0" fontSize="12" class="font-weight-normal" horizontalAlignment="left" marginLeft="5"
                                               color="#FFFFFF" :text="'Popularity '+item.popularity"></Label>
                                    </GridLayout>
                                    <GridLayout col="0" row="0" columns="auto,*" rows="auto" marginRight="15">
                                        <Image col="0" row="0" src="~/assets/images/icons/smiley.png" height="12"></Image>
                                        <Label col="1" row="0" fontSize="12" class="font-weight-normal" horizontalAlignment="left" marginLeft="5"
                                               color="#FFFFFF" :text="'Votes '+item.vote_count"></Label>
                                    </GridLayout>
                                    <GridLayout col="0" row="0" columns="auto,*" rows="auto" marginRight="15">
                                        <Image col="0" row="0" src="~/assets/images/icons/star.png" height="12"></Image>
                                        <Label col="1" row="0" fontSize="12" class="font-weight-normal" horizontalAlignment="left" marginLeft="5"
                                               color="#FFFFFF" :text="'Average '+item.vote_average"></Label>
                                    </GridLayout>
                                </StackLayout>
                            </ScrollView>
                        </StackLayout>

                    </StackLayout>
                </GridLayout>
            </ScrollView>

        </page>
    </Frame>
</template>

<script>
    import MovieDatabase from "../../services/the-movie-database";
    const movieDb = new MovieDatabase();
    export default {
        props: {
            item: null,
        },
        mounted() {
            movieDb.details(this.item.media_type, this.item.tmdb_id).then(response => {
                this.cast = response.data.credits.cast;
                this.language = response.data.original_language;
            }).catch(error => {
                console.log(error);
            });
            if(this.item.season) {
                movieDb.episode(this.item.tmdb_id, this.item.season, this.item.episode).then(response => {
                    this.episode.push(response.data);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            title() {
                if(this.item.season && this.item.episode) {
                    return this.item.parsed_title+" S"+this.item.season+" E"+this.item.episode;
                }
                return this.item.parsed_title;
            }
        },
        methods: {
            //
        },
        data() {
            return {
                cast: [],
                episode: [],
                language: "",
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../../app-variables';
    // End custom common variables

    // Custom styles
    .page {
        background: #16222A;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to bottom, #3A6073, #16222A);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to bottom, #3A6073, #16222A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    /* details */
    .synopsis--title {
        color: #fff;
        font-size: 20;
        font-weight: bold;
    }
    .details--title {
        color: #fff;
        font-size: 18;
        font-weight: bold;
    }
    .details--synopsis {
        color: #fff;
        font-size: 15;
        opacity: 0.8;
    }

    /* misc */
    .round-corners {
        border-radius: 50%;
        border-color: rgba(255, 255, 255, 0.6);
        border-width: 1;
    }
</style>
