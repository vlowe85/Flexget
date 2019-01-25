<template>
    <Page class="page" actionBarHidden="true" backgroundSpanUnderStatusBar="true">

        <GridLayout orientation="vertical" width="100%" height="100%" columns="*" rows="*,auto">

            <StackLayout col="0" row="0" backgroundColor="#f8f8f8">

                <ScrollView orientation="vertical">
                    <StackLayout>

                        <StackLayout backgroundColor="#f8f8f8" paddingBottom="15">
                            <Label text="History" class="font-weight-bold" horizontalAlignment="center"
                                   color="#000000" padding="15" fontSize="18"></Label>
                        </StackLayout>

                        <ListView ref="listView" for="item in listViewData">
                            <v-template>
                                <StackLayout>
                                    <Label :text="item.title"></Label>
                                </StackLayout>
                            </v-template>
                        </ListView>

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
            listViewData() {
                return this.$store.getters.allHistory;
            }
        },
        methods: {
            //
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

</style>
