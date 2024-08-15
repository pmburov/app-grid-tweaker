NAME = app-grid-tweaker
DOMAIN = pmburov.github.com
UUID = $(NAME)@$(DOMAIN)

# These commands can be run by the user.
.PHONY: build install uninstall pot remove clean

build: clean
	mkdir -p build/
	gnome-extensions pack -f --podir=po --extra-source=core.js --extra-source=consts.js -o build

install: build remove
	gnome-extensions install -f build/$(UUID).shell-extension.zip

uninstall:
	gnome-extensions uninstall "$(UUID)"

pot:
	@xgettext --from-code=UTF-8 --output=po/$(UUID).pot *.js

remove:
	rm -rf $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

clean:
	rm -rf build/ po/*.mo

schemas:
	@glib-compile-schemas schemas


