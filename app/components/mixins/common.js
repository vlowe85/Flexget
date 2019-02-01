import { VersionNumber } from "nativescript-version-number";
import * as platform from 'tns-core-modules/platform';
import * as app from 'tns-core-modules/application';
import * as color from 'tns-core-modules/color';
import details from "../home/historyDetail";

let common = {
    mounted() {
        this.width = platform.screen.mainScreen.widthDIPs;
        this.height = platform.screen.mainScreen.heightDIPs;
        this.platform = app.ios ? "ios" : app.android ? "android" : "";
        this.version = new VersionNumber().get();
    },
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
        showDetails(item) {
            this.$showModal(details, {
                props: { item: item },
                fullscreen: true,
            });
        },
    },
    data() {
        return {
            width: 0,
            height: 0,
            platform: "",
            version: null,
        }
    }
};
export default common;