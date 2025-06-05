#!/bin/bash
#
# Post-install script for [rv60bible]
# This script changes the access permissions for application
# database files in order to function properly.
#
sudo chmod -R 777 /usr/lib/rv60bible/resources/app/data/sources
echo Updated application database files access permissions...
exit 0
