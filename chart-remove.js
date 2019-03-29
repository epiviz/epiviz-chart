/* External Polymer Styles/elements dependency */
/* Epiviz element dependency */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-icons/iron-icons.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
/**
 * `ChartRemoveBehavior` object manages the `<epiviz-chart-remove>` element for each chart. 
 * All charts inherit this behavior to remove itself from DOM.
 *
 * @polymerBehavior
**/
EpivizChartRemoveBehavior = function (superClass) {
    return class extends superClass {
        constructor() {
            super();
        }

        static get properties() {
            return {};
        }

        /**
        * Shows the remove element
        */
        _showRemoveDialog() {
            var self = this;

            if (self._parentContainer) {
                self._parentContainer.removeChild(self);

                let navChildren =
                    FlattenedNodesObserver.getFlattenedNodes(self._parentContainer).filter(n => n.nodeType === Node.ELEMENT_NODE)
                for (var nindex = 0; nindex < navChildren.length; nindex++) {
                    var child = navChildren[nindex];
                    if (child.plotId == self.plotId) {
                        this.shadowRoot.querySelector(child).remove();
                        this.shadowRoot.querySelector("[plot-id=" + self.plotId + "]").remove();
                    }
                }
            }
            else {
                this.shadowRoot.querySelector(self.root).remove();
                this.shadowRoot.querySelector("[plot-id=" + self.plotId + "]").remove();
            }
        }

        /**
        * Initializes the `<epiviz-chart-remove>` element
        */
        _initializeRemoveDialog() {
            var chartSettingsContainer = this.shadowRoot.querySelector('#chartSettingsContainer');
            var chartContainer = this.shadowRoot.querySelector('#' + this.plotId);
            var currSettingIcon = this.shadowRoot.querySelector('#chartRemoveIcon');

            if (currSettingIcon == null) {
                var iconElem = document.createElement('paper-icon-button');
                iconElem.id = "chartRemoveIcon";
                iconElem.icon = "icons:remove-circle";

                iconElem.addEventListener("click", this._showRemoveDialog.bind(this));

                chartSettingsContainer.appendChild(iconElem);
            }
        }
    };
}
