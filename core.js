import * as Main from "resource:///org/gnome/shell/ui/main.js"

import { appIconsSizesValues } from "./consts.js"

const MainAppDisplay = Main.overview._overview._controls._appDisplay

let appGridTweaker = null

export function enable(props) {
  appGridTweaker = new AppGridTweaker(props)
  appGridTweaker.startAppGridTweaker()
  appGridTweaker.reloadSignal = appGridTweaker._settings.connect(
    "changed::reload-signal",
    () => {
      appGridTweaker.undoChanges()
      appGridTweaker.startAppGridTweaker()
    }
  )
}

export function disable() {
  appGridTweaker.undoChanges()
  appGridTweaker._settings.run_dispose()
}

export class AppGridTweaker {
  constructor(props) {
    this._settings = props
    this._settings.connect("changed::appgrid-max-columns", () => {
      this.startAppGridTweaker()
    })
    this._settings.connect("changed::appgrid-max-rows", () => {
      this.startAppGridTweaker()
    })
    this._settings.connect("changed::appgrid-icon-size", () => {
      this.startAppGridTweaker()
    })
    this._settings.connect("changed::folder-max-columns", () => {
      this.applyFolderViewChanges()
    })
    this._settings.connect("changed::folder-max-rows", () => {
      this.applyFolderViewChanges()
    })
    this._settings.connect("changed::folder-icon-size", () => {
      this.applyFolderViewChanges()
    })
  }

  applyFolderViewChanges() {
    const rows = this._settings.get_int("folder-max-rows")
    const columns = this._settings.get_int("folder-max-columns")
    const folderIconSize =
      appIconsSizesValues[this._settings.get_int("folder-icon-size")]

    MainAppDisplay._folderIcons.forEach((icon) => {
      // const length = icon.getAppIds().length
      const folderGrid = icon.view._grid

      folderGrid.layout_manager._iconSize = folderIconSize
      folderGrid.layout_manager.fixedIconSize = folderIconSize

      folderGrid._gridModes[0].rows = rows
      folderGrid._gridModes[0].columns = columns

      folderGrid.layout_manager.rows_per_page = rows
      folderGrid.layout_manager.rowsPerPage = rows
      folderGrid.layout_manager.columns_per_page = columns
      folderGrid.layout_manager.columnsPerPage = columns
      icon._ensureFolderDialog()
      icon._dialog._popdownCallbacks = []
      icon.view._redisplay()
    })
  }

  startAppGridTweaker() {
    const appGrid = MainAppDisplay._grid
    const rows = this._settings.get_int("appgrid-max-rows")
    const columns = this._settings.get_int("appgrid-max-columns")
    const appGridIconSize =
      appIconsSizesValues[this._settings.get_int("appgrid-icon-size")]

    appGrid._gridModes[0].rows = rows
    appGrid._gridModes[0].columns = columns

    if (MainAppDisplay._folderIcons?.length > 0) {
      this.applyFolderViewChanges()
    }

    this.reloadingSig = MainAppDisplay.connect("view-loaded", () => {
      this.applyFolderViewChanges()
      this.updatePages()
    })

    appGrid._currentMode = 0
    appGrid.layout_manager.rows_per_page = rows
    appGrid.layout_manager.columns_per_page = columns
    appGrid.layout_manager.rowsPerPage = rows
    appGrid.layout_manager.columnsPerPage = columns
    appGrid.layout_manager._iconSize = appGridIconSize
    appGrid.layout_manager.fixedIconSize = appGridIconSize

    appGrid.layout_manager.ensureIconSizeUpdated()

    this.updatePages()
    MainAppDisplay._redisplay()
  }

  updatePages() {
    for (
      let i = 0;
      i < MainAppDisplay._grid.layout_manager._pages.length;
      i++
    ) {
      MainAppDisplay._grid.layout_manager._fillItemVacancies(i)
      MainAppDisplay._grid.layout_manager._updateVisibleChildrenForPage(i)
    }
    MainAppDisplay._grid.layout_manager._updatePages()
    for (
      let i = 0;
      i < MainAppDisplay._grid.layout_manager._pages.length;
      i++
    ) {
      MainAppDisplay._grid.layout_manager._fillItemVacancies(i)
      MainAppDisplay._grid.layout_manager._updateVisibleChildrenForPage(i)
    }
  }

  undoChanges() {
    const appGrid = MainAppDisplay._grid
    appGrid.layout_manager._pageWidth--
    MainAppDisplay.disconnect(this.reloadingSig)

    appGrid.layout_manager.rows_per_page = 4
    appGrid.layout_manager.columns_per_page = 6
    appGrid.layout_manager.rowsPerPage = 4
    appGrid.layout_manager.columnsPerPage = 6
    appGrid.layout_manager._iconSize = 96
    appGrid.layout_manager.fixedIconSize = 96

    MainAppDisplay._folderIcons.forEach((icon) => {
      icon.view._grid.layout_manager.rows_per_page = 3
      icon.view._grid.layout_manager.columns_per_page = 3
      icon.view._grid.layout_manager.rowsPerPage = 3
      icon.view._grid.layout_manager.columnsPerPage = 3
      icon.view._grid.layout_manager.fixedIconSize = 96
      icon._ensureFolderDialog()
      icon._dialog._popdownCallbacks = []
      icon.view._redisplay()
    })

    this.updatePages()
    MainAppDisplay._redisplay()
  }
}
