/* External Polymer Styles/elements dependency */
/* Epiviz element dependency */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-icons/image-icons.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import './epiviz-chart-colors.js';
/**
 * `ChartColorsBehavior` manages the `<epiviz-chart-colors>` element for each chart. 
 * All charts inherit this behavior to update chart colors.
 *
 * @polymerBehavior
**/
EpivizChartColorsBehavior = function (superClass) {
    return class extends superClass {
        constructor() {
            super();
        }

        static get properties() {
            return {};
        }

        // static get observers() {
        //     return [ ];
        // }

        /**
        * Shows the `<epiviz-chart-colors>` element
        */
        _showColorsDialog() {
            var self = this;
            var chartContainer = this.shadowRoot.querySelector('#' + this.plotId);
            var currColors = this.shadowRoot.querySelector('epiviz-chart-colors');

            if (currColors == null) {
                var currColors = document.createElement('epiviz-chart-colors');
                currColors.setAttribute('labels', JSON.stringify(self.chart.colorLabels()));
                currColors.palettes = self.config.colorPalettes;
                currColors.selected = self.chart.colors();
                chartContainer.appendChild(currColors);
            }
            else {
                currColors.setAttribute('labels', JSON.stringify(self.chart.colorLabels()));
                currColors.selected = self.chart.colors();
            }

            currColors.showColors(this.shadowRoot, function (newColors) {
                self.chartColors = newColors;
            });
        }

        /**
        * Initializes the `<epiviz-chart-colors>` element
        */
        _initializeColorsDialog() {
            var chartSettingsContainer = this.shadowRoot.querySelector('#chartSettingsContainer');
            var chartContainer = this.shadowRoot.querySelector('#' + this.plotId);
            var currColorIcon = this.shadowRoot.querySelector('#chartColorsIcon');

            if (currColorIcon == null) {
                var iconElem = document.createElement('paper-icon-button');
                iconElem.id = "chartColorsIcon";
                iconElem.icon = "image:color-lens";

                iconElem.addEventListener("click", this._showColorsDialog.bind(this));
                chartSettingsContainer.appendChild(iconElem);
            }
        }
    }
}
