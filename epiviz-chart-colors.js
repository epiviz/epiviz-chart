/* Polymer dependency */
/* External Polymer Styles/elements dependency */
/*
`<epiviz-chart-colors>` is a view element that manages chart colors. 

All charts implement the `epiviz.ChartColorsBehavior` that manages this element.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-button/paper-button.js';
import 'paper-dropdown-input/paper-dropdown-input.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-swatch-picker/paper-swatch-picker.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-label/iron-label.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

// Extend Polymer.Element base class
class EpivizChartColors extends PolymerElement {
  static get template() {
    return html`
        <style>
            #formSettings {
                min-width: 500px;
            }

            #scrollContent {
                margin-bottom: 10px;
            }

            .color-item {
                display: block;
                text-align: center;
            }

            .container {
                display: grid;
                grid-auto-flow: column dense;
            }
        </style>

        <!-- local DOM goes here -->
        <div id="settings">
            <!--no-overlap horizontal-align="left" vertical-align="top"-->
            <paper-dialog id="modal" modal="">
                <h2>Chart Color Settings</h2>
                <iron-form id="formSettings">
                    <form>
                        <div class="container">
                            <template id="colorPickers" is="dom-repeat" items="{{labels}}">
                                <div class="color-item">
                                    <paper-swatch-picker id="[[_getId(item)]]" name="{{item}}" color="[[_getColor(item)]]"></paper-swatch-picker>
                                    <iron-label for="{{_getId(item)}}">{{item}}</iron-label>
                                </div>
                            </template>
                        </div>

                        <div class="buttons container flex-end-justified">
                            <paper-button id="submit" on-tap="_submit" raised="">Apply</paper-button>
                            <paper-button id="cancel" on-tap="_cancel" raised="">Cancel</paper-button>
                        </div>
                    </form>
                </iron-form>
            </paper-dialog>
        </div>
`;
  }

  static get is() { return 'epiviz-chart-colors'; }

  static get properties() {
      return {
          /**
          * Default chart color labels.
          *
          * @type {Object<string, string>}
          */
          labels: {
              type: Object,
              notify: true
          },

          /**
          * Default chart color palettes.
          *
          * @type {Array<epiviz.ui.charts.ColorPalette>}
          */
          palettes: {
              type: Array,
              notify: true
          },

          /**
          * currently selected chart colors.
          *
          * @type {Object<string, string>}
          */
          selected: {
              type: Object,
              notify: true
          }
      }
  }

  static get observers() {
      return [
          /* observer array just like 1.x */
      ]
  }

  constructor() {
      super();
      // this.addEventListener('submit.click', e => this._submit(e));
      // this.addEventListener('cancel.click', e => this._cancel(e));
  }

  connectedCallback() {
      var self = this;
      super.connectedCallback();

      this.$.formSettings.addEventListener('iron-form-submit', this._form_submit.bind(this));
      var colorPickers = this.$.colorPickers;
      colorPickers.addEventListener('dom-change', function(e) {
          // auto-binding template is ready.
          var labels = self.$.colorPickers.items;
          var colorSwatch = self.shadowRoot.querySelectorAll("paper-swatch-picker");
          colorSwatch.forEach(function(item, index) {
              var defaultColors = item.defaultColors();
              defaultColors[0] = self._getColor(labels[index]);
              item.set('colorList', defaultColors);
              item.set('color', self._getColor(labels[index]));
          });
      });
  }

  disconnectedCallback() {
      super.connectedCallback();
  }

  /**
   * Get Color for a given label/Key.
   *
   * @param {string} label label/key to search for.
   *
   * @return {Object} color set for the given label
   */
  _getColor(label) { 
      return this.selected.getByKey(label);
  }

  /**
   * UI Helper function to find group
   *
   * @param {string} value index number
   * @param {number} expeced expected group
   * @return {boolean} returns True if value in expected
   */
  _isIndexGroup(value, expected) {
      if (value % 3 == expected) {
          return true;
      }

      return false;
  }

  /**
   * UI Helper function to create Id for a given label (ignore spaces)
   *
   * @param {string} label string
   * 
   * @return {string} return label ignoring white spaces
   */
  _getId(label) {
      return label.split(' ').join('');
  }

  /**
   * handles form submit action
   */
  _submit(event) {
      this.$.formSettings.submit();
  }

  /**
   * handles form submit action
   */
  _form_submit(event) {
      var self = this;

      //collect all colors set
      var colors = [];
      for (var i = 0; i < this.labels.length; i++) {
          var swatch = self.shadowRoot.querySelector('#' + this._getId(this.labels[i]));
          colors.push(swatch.color);
      }

      self.selected = new epiviz.ui.charts.ColorPalette(colors, undefined, undefined, self.selected.keyIndices());

      // this.vals = event.detail;
      this.callback(colors);
      this.closeColors();
  }

  /**
   * handles form cancel action
   */
  _cancel(event) {
      this.closeColors();
  }

  /**
   * handles element modal show action
   */
  showColors(target, callback) {
      var self = this;
      // this.$.scrollContent.dialogElement = this.$.modal;
      this.callback = callback;
      this.$.modal.positionTarget = target;
      this.$.modal.open();
  }

  /**
   * handles element modal close action
   */
  closeColors() {
      this.$.modal.close();
  }
}

customElements.define(EpivizChartColors.is, EpivizChartColors);
