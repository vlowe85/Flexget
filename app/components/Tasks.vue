<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" class="bottom-gradient" android:paddingTop="30">

                <StackLayout>
                    <GridLayout columns="auto,*" rows="auto">
                        <Image col="0" row="0" src="~/assets/images/icons/back-icon.png" marginLeft="10"
                               stretch="aspectFill" height="20" @tap="goToPage($routes.Settings, {name:'slideRight'})"></Image>
                        <Label col="1" row="0" text="Tasks" class="font-weight-normal" horizontalAlignment="center"
                               color="#FFFFFF" padding="15" fontSize="18" marginLeft="-20"></Label>
                    </GridLayout>
                </StackLayout>

                <ScrollView orientation="vertical">
                    <StackLayout height="100%">

                        <StackLayout width="95%" marginTop="15" backgroundColor="#FFFFFF" borderRadius="5" paddingTop="5">
                            <ListView ref="listView" for="item in tasks" height="100%">
                                <v-template>
                                    <StackLayout>
                                        <GridLayout columns="auto, *, auto, auto" rows="*">
                                            <Image col="0" row="0" width="20" :src="item.status.succeeded ? '~/assets/images/icons/ok.png' : '~/assets/images/icons/error.png'"
                                                   margin="10" v-if="item.hasOwnProperty('status')"></Image>
                                            <Label col="1" paddingTop="15" row="0" :text="item.name" textWrap="true"></Label>
                                            <Button col="2" row="0" text="Execute" @tap="execute(item.name)"></Button>
                                            <Button col="3" row="0" text="Delete" marginRight="5" @tap="deleteTask(item.name)"></Button>
                                        </GridLayout>
                                        <GridLayout columns="*, *, *, *" rows="*, *, *" v-if="item.hasOwnProperty('status')">
                                            <Label col="0" colSpan="1" row="0" paddingLeft="10" paddingTop="5" text="Start time" textWrap="true"></Label>
                                            <Label col="1" colSpan="3" row="0" paddingLeft="10" paddingTop="5" :text="item.status.start" textWrap="true"></Label>
                                            <Label col="0" row="1" paddingLeft="10" paddingTop="5" text="Produced" textWrap="true"></Label>
                                            <Label col="1" row="1" paddingLeft="10" paddingTop="5" text="Accepted" textWrap="true"></Label>
                                            <Label col="2" row="1" paddingLeft="10" paddingTop="5" text="Rejected" textWrap="true"></Label>
                                            <Label col="3" row="1" paddingLeft="10" paddingTop="5" text="Failed" textWrap="true"></Label>
                                            <Label col="0" row="2" paddingLeft="10" paddingTop="5" paddingBottom="5" :text="item.status.produced" textWrap="true"></Label>
                                            <Label col="1" row="2" paddingLeft="10" paddingTop="5" paddingBottom="5" :text="item.status.accepted" textWrap="true"></Label>
                                            <Label col="2" row="2" paddingLeft="10" paddingTop="5" paddingBottom="5" :text="item.status.rejected" textWrap="true"></Label>
                                            <Label col="3" row="2" paddingLeft="10" paddingTop="5" paddingBottom="5" :text="item.status.failed" textWrap="true"></Label>
                                        </GridLayout>
                                    </StackLayout>
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

    export default {
        mixins: [common],
        computed: {
            //
        },
        mounted() {
            axios.get(this.api+"/tasks").then(response => {
                this.tasks = response.data;
                this.getTaskStatus();
            }).catch(error => {
                console.log(error);
            });
        },
        methods: {
            getTaskStatus() {
                axios.get(this.api+"/tasks/status").then(response => {
                    response.data.forEach(task => {
                        let found = this.tasks.find(item => item.name === task.name);
                        if (found) {
                            this.$set( found, 'status', task.last_execution);
                        }
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            execute(task) {
                axios.post(this.api+"/tasks/execute", {
                    tasks: [task]
                }).then(response => {
                    alert({
                        title: "Success",
                        message: "Task submitted",
                        okButtonText: "Ok"
                    });
                }).catch(error => {
                    alert({
                        title: "Operation failed",
                        message: error,
                        okButtonText: "Ok"
                    });
                });
            },
            deleteTask(task) {
                confirm({
                    title: "Are you sure?",
                    message: "That seems a bit drastic!",
                    okButtonText: "Yes",
                    cancelButtonText: "No"
                }).then(result => {
                    if(result) {
                        axios.delete(this.api+"/tasks/"+task).then(response => {
                            this.tasks = this.tasks.filter(data => data.name !== task);
                            alert({
                                title: "Success",
                                message: "Task deleted",
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
                tasks: [],
                loading: false,
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
