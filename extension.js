import {
  Extension,
  gettext as _
} from "resource:///org/gnome/shell/extensions/extension.js"

import * as Core from "./core.js"

export default class AppGridTweakerExtension extends Extension {
  enable() {
    this._settings = this.getSettings()
    Core.enable(this._settings)
  }

  disable() {
    Core.disable()
    this._settings = null
  }
}
