let common = {
    computed: {
        //
    },
    methods: {
        goToPage(pageComponent, trans) {
            let transitionObj = (typeof(trans) === "undefined") ? {} : trans;
            // use the manual navigation method
            this.$navigateTo(pageComponent, {
                transition: transitionObj
            });
        },
    },
    data() {
        return {
            //
        }
    }
};
export default common;