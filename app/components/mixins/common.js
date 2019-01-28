import * as app from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'

let common = {
    computed: {
        //
    },
    methods: {
        pageLoaded() {
            // if (app.android && platform.device.sdkVersion >= "21") {
            //     const window = app.android.foregroundActivity.getWindow();
            //     window.setStatusBarColor(new color.Color("#123f94").android);
            // }
        },
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