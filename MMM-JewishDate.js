/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: MMM-JewishDate
 *
 * By Yohay Cohen
 * MIT Licensed.
 */
Module.register("MMM-JewishDate", {
    // Module config defaults.
    defaults: {

    },
    // Define required scripts.
    getScripts: function () {
        return ["moment.js", "moment-timezone.js"];
    },
    // Define styles.
    getStyles: function () {
        return ["jewishDate.css"];
    },
    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.hebDate = null;
        // Schedule update interval.
        var self = this;
        setInterval(function () {
            self.updateDom();
        }, 1000 * 60 * 60);
        this.getDate();

    },
    processDate(data) {

        if (!data || !data.hebrew) {
            // Did not receive usable new data.
            // Maybe this needs a better check?
            return;
        }
        this.hebDate = data.hebrew;
        this.updateDom();

    },
    /* Requests new data from hebcal.com.
	 * Calls processDate on succesfull response.
	 */
    getDate: function () {
        var url = 'https://www.hebcal.com/converter/?cfg=json&gy=' + moment().year() + '&gm=' + moment().month() + '&gd=' + moment().date() + '&g2h=1';
        var self = this;
   
        var hebcalRequest = new XMLHttpRequest();
        hebcalRequest.open("GET", url, true);
        hebcalRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processDate(JSON.parse(this.response));
                } else {
                    Log.error(self.name + ": Could not load date from hebcal.");
                }
            }
        };
        hebcalRequest.send();
    },

    // Override dom generator.
    getDom: function () {

        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var dateWrapper = document.createElement("div");
        dateWrapper.className = "date normal medium";
        dateWrapper.innerHTML = this.hebDate;

        wrapper.appendChild(dateWrapper);

        // Return the wrapper to the dom.
        return wrapper;
    }
});