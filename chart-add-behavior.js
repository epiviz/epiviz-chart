/* External Polymer Styles/elements dependency */
/*<link rel="import" href="../iron-icons/iron-icons.html">*/
/* Epiviz element dependency */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/paper-icon-button/paper-icon-button.js';

import './epiviz-add-chart.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
/**
 * `ChartAddBehavior` object manages the `<epiviz-add-chart>` element. 
 * Environment and Navigation elements inherit this behavior to add a new chart.
 *
 * @polymerBehavior
**/

EpivizChartAddBehavior = function (superClass) {
    return class extends superClass {
        constructor() {
            super();
        }

        static get properties() {
            return {};
        }

        /**
         * Shows the `<epiviz-add-chart>` element
         */
        _showAddDialog() { }

        /**
         * Initializes the `<epiviz-add-chart>` element
         */
        _initializeAddDialog() {
            var chartContainer = this.$.header;
            var currAddElem = this.shadowRoot.querySelector('epiviz-add-chart');

            if (currAddElem) {
                var dataManagerElem = document.querySelector('epiviz-data-source');
                if (dataManagerElem) {
                    dom(currAddElem).measurements = dataManagerElem.measurementSet;
                }
            }
        }

        /**
         * Intializes chart container DOM element for settings and colors elements.
         */
        _initializeDialogContainer() { }

        ready() {
            super.ready();
            this._initializeDialogContainer();
        }
    };
}
