#!/bin/bash

exec /usr/bin/flatpak run --branch=stable --arch=x86_64 --command=/app/bin/chrome com.google.Chrome "$@"