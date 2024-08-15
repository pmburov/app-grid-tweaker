import Gtk from "gi://Gtk?version=4.0"
import Adw from "gi://Adw"
import Gio from "gi://Gio"

import {
  ExtensionPreferences,
  gettext as _
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

import { appIconsSizesValues } from "./consts.js"

export default class TweakerPreferences extends ExtensionPreferences {
  constructor(metadata) {
    super(metadata)
  }

  getPreferencesWidget() {
    return new Gtk.Label({
      label: this.metadata.name
    })
  }

  fillPreferencesWindow(window) {
    /* Initialize settings */
    window._settings = this.getSettings()
    /* Create page */
    const page = new Adw.PreferencesPage({
      title: _("General"),
      icon_name: "dialog-information-symbolic"
    })
    /* Append page to window */
    window.add(page)
    /* Create a group */
    const appGridGroup = new Adw.PreferencesGroup({
      title: _("Apps Grid"),
      description: _("Configure number of rows and columns for apps grid")
    })
    /* Append group to page */
    page.add(appGridGroup)
    /* Create numeric input with + and - buttons */
    const appGridCols = new Adw.SpinRow({
      title: _("Apps Grid Columns"),
      adjustment: new Gtk.Adjustment({
        lower: 6,
        upper: 20,
        stepIncrement: 1,
        value: 6
      })
    })
    /* Append input to group */
    appGridGroup.add(appGridCols)
    /* Bind schema settings to input value */
    window._settings.bind(
      "appgrid-max-columns",
      appGridCols,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    )
    /* Create numeric input with + and - buttons */
    const appGridRows = new Adw.SpinRow({
      title: _("Apps Grid Rows"),
      adjustment: new Gtk.Adjustment({
        lower: 4,
        upper: 20,
        stepIncrement: 1,
        value: 4
      })
    })
    /* Append input to group */
    appGridGroup.add(appGridRows)
    /* Bind schema settings to input value */
    window._settings.bind(
      "appgrid-max-rows",
      appGridRows,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    )

    const appIconsSizesList = new Gtk.StringList()
    appIconsSizesValues.forEach((choice) => appIconsSizesList.append(choice))

    const appIconsSizes = new Adw.ComboRow({
      title: _("Apps Grid Icons Size"),
      model: appIconsSizesList,
      selected:
        appIconsSizesValues[window._settings.get_int("appgrid-icon-size")]
    })
    /* Append input to group */
    appGridGroup.add(appIconsSizes)
    /* Bind schema settings to input value */
    window._settings.bind(
      "appgrid-icon-size",
      appIconsSizes,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    )

    /* Create a group */
    const folderGroup = new Adw.PreferencesGroup({
      title: _("Folder Grid"),
      description: _("Configure number of rows and columns for folder grid")
    })
    /* Append group to page */
    page.add(folderGroup)
    /* Create numeric input with + and - buttons */
    const folderGridCols = new Adw.SpinRow({
      title: _("Folder Grid Columns"),
      adjustment: new Gtk.Adjustment({
        lower: 3,
        upper: 20,
        stepIncrement: 1,
        value: 3
      })
    })
    /* Append input to group */
    folderGroup.add(folderGridCols)
    /* Bind schema settings to input value */
    window._settings.bind(
      "folder-max-columns",
      folderGridCols,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    )
    /* Create numeric input with + and - buttons */
    const folderGridRows = new Adw.SpinRow({
      title: _("Folder Grid Rows"),
      adjustment: new Gtk.Adjustment({
        lower: 3,
        upper: 20,
        stepIncrement: 1,
        value: 3
      })
    })
    /* Append input to group */
    folderGroup.add(folderGridRows)
    /* Bind schema settings to input value */
    window._settings.bind(
      "folder-max-rows",
      folderGridRows,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    )

    const folderIconsSizesList = new Gtk.StringList()
    appIconsSizesValues.forEach((choice) => folderIconsSizesList.append(choice))

    const folderIconsSizes = new Adw.ComboRow({
      title: _("Folder Grid Icons Size"),
      model: folderIconsSizesList,
      selected:
        appIconsSizesValues[window._settings.get_int("appgrid-icon-size")]
    })
    /* Append input to group */
    folderGroup.add(folderIconsSizes)
    /* Bind schema settings to input value */
    window._settings.bind(
      "folder-icon-size",
      folderIconsSizes,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    )
  }
}
