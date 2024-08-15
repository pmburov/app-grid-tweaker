##### Debugging prefs.js

```
journalctl -f -o cat /usr/bin/gjs
```

Use this if logging don't show up

```
journalctl -f
```

##### Debugging GSettings

```
dconf watch /org/gnome/shell/extensions/app-grid-tweaker
```

##### Nested desktop session

```
dbus-run-session -- gnome-shell --nested --wayland
```
