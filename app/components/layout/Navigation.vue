<template>
    <StackLayout col="0" row="1" orientation="horizontal"
                 backgroundColor="#FFFFFF" height="60">
        <GridLayout rows="*" columns="*,*,*">
            <StackLayout v-for="(page, i) in pages" :col="i" row="0" @tap="goToPage(page.component)" :key="i">
                <Image height="25" width="25" margin="10" :src="page.icon"></Image>
                <Label fontSize="12" color="#999999"
                       :text="page.name"
                       horizontalAlignment="center"
                       verticalAlignment="center"></Label>
            </StackLayout>
        </GridLayout>
    </StackLayout>
</template>

<script>
    export default {
        computed: {
            //
        },
        methods: {
            onButtonTap(page) {
                this.$emit("nav", page);
            },
            goToPage(pageComponent) {
                // use the manual navigation method
                this.$navigateTo(pageComponent, {
                    clearHistory: true
                });
            }
        },
        data() {
            return {
                pages: [
                    { name: 'Home', component: this.$routes.Home, icon: "~/assets/images/nav/home.png" },
                    { name: 'History', component: this.$routes.History, icon: "~/assets/images/nav/insights.png" },
                    { name: 'Modules', component: this.$routes.Home, icon: "~/assets/images/nav/modules.png" }
                ]
            }
        }
    };
</script>
