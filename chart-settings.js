/* External Polymer Styles/elements dependency */
/* Epiviz element dependency */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-icons/iron-icons.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import './epiviz-chart-settings.js';
/**
 * `ChartSettingsBehavior` object manages the `<epiviz-chart-settings>` element for each chart. 
 * All charts inherit this behavior to update chart settings.
 *
 * @polymerBehavior
**/
EpivizChartSettingsBehavior = function (superClass) {
    return class extends superClass {
        constructor() {
            super();
        }

        static get properties() {
            return {};
        }

        /**
        * Shows the `<epiviz-chart-settings>` element
        */
        _showSettingsDialog() {
            var self = this;
            var chartContainer = this.shadowRoot.querySelector('#' + this.plotId);
            var currSetting = this.shadowRoot.querySelector('epiviz-chart-settings');

            if (currSetting == null) {
                var currSetting = document.createElement('epiviz-chart-settings');
                currSetting.setAttribute('defs', JSON.stringify(self.chartType.customSettingsDefs()));
                currSetting.setAttribute('vals', JSON.stringify(self.chartSettings));

                chartContainer.appendChild(currSetting);
            }
            else {
                currSetting.setAttribute('vals', JSON.stringify(self.chartSettings));
            }

            currSetting.showSettings(this.shadowRoot, function (newSettings) {
                self.chartSettings = newSettings;
            });
        }

        /**
        * Initializes the `<epiviz-chart-settings>` element
        */
        _initializeSettingsDialog() {
            var chartSettingsContainer = this.shadowRoot.querySelector('#chartSettingsContainer');
            var chartContainer = this.shadowRoot.querySelector('#' + this.plotId);
            var currSettingIcon = this.shadowRoot.querySelector('#chartSettingsIcon');

            if (currSettingIcon == null) {
                var iconElem = document.createElement('paper-icon-button');
                iconElem.id = "chartSettingsIcon";
                iconElem.icon = "settings";

                iconElem.addEventListener("click", this._showSettingsDialog.bind(this));
                chartSettingsContainer.appendChild(iconElem);
            }
        }
    }
}
