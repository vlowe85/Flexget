<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Settings, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="Seen" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical">
                    <StackLayout height="100%">

                        <StackLayout width="95%" marginTop="15" backgroundColor="#FFFFFF" borderRadius="5" paddingTop="5">
                            <ListView ref="listView" for="item in seenData" @loadMoreItems="onLoadMoreItems">
                                <v-template>
                                    <GridLayout columns="*, 80" rows="*, *, *, *, *" paddingLeft="10" paddingTop="5" paddingBottom="5" paddingRight="5">
                                        <Label col="0" row="0" fontSize="11" class="font-weight-normal"
                                               :text="item.title" textWrap="true" verticalAlignment="top"></Label>
                                        <Label col="0" row="1" fontSize="10" class="font-weight-normal" :text="item.task"
                                               textWrap="true"></Label>
                                        <Label v-if="item.fields.length > 0" col="0" row="2" fontSize="10" class="font-weight-normal" :text="item.fields[0].field_name+': '+item.fields[0].value"
                                               textWrap="true"></Label>
                                        <Label v-if="item.fields.length === 2" col="0" row="3" fontSize="10" class="font-weight-normal" :text="item.fields[1].field_name+': '+item.fields[1].value"
                                               textWrap="true"></Label>
                                        <Label col="0" row="4" fontSize="10" class="font-weight-normal" :text="item.added"
                                               textWrap="true"></Label>
                                        <Button col="1" row="0" rowSpan="5" text="Delete" marginRight="5" height="40" @tap="deleteItem(item)"></Button>
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
    import axios from "axios";
    import common from "./mixins/common";
    const moment = require('moment');

    export default {
        mixins: [common],
        mounted() {
            this.loading = true;
            console.log();
            axios.get(this.api+"/seen", {
                params: {
                    per_page: 50,
                    page: this.page,
                }
            }).then((response) => {
                if(response.data.length > 0) {
                    this.seenData = response.data;
                }
                this.loading = false;
            }).catch((error) => {
                this.loading = false;
            });
        },
        methods: {
            onLoadMoreItems() {
                if(this.loadMoreEnabled && !this.loading) {
                    this.loading = true;
                    axios.get(this.api+"/seen", {
                        params: {
                            per_page: 50,
                            page: ++this.page,
                        }
                    }).then((response) => {
                        if(response.data.length > 0) {
                            response.data.forEach(item => {
                                this.seenData.push(item);
                            });
                        } else {
                            this.loadMoreEnabled = false;
                        }
                        this.loading = false;
                    }).catch((error) => {
                        this.loading = false;
                    });
                }
            },
            deleteItem(item) {
                confirm({
                    title: "Are you sure?",
                    message: "Did you mean to delete "+item.title+"?",
                    okButtonText: "Yes",
                    cancelButtonText: "No"
                }).then(result => {
                    if(result) {
                        axios.delete(this.api+"/seen/"+item.id).then(response => {
                            this.seenData = this.seenData.filter(data => data.id !== item.id);
                            alert({
                                title: "Success",
                                message: "Entry deleted",
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
                });
            }
        },
        data() {
            return {
                page: 1,
                seenData: [],
                loading: false,
                loadMoreEnabled: true,
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
