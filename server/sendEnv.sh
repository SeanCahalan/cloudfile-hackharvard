#!/bin/bash

vars=""
while read line; do
  if [[ $line != *"="* ]]; then
    continue
  fi
  if [[ $varName == "NODE_ENV" ]]; then
    continue
  fi

  vars="$vars $line"
done <.env

devVars="$vars NODE_ENV=development"
heroku config:set $devVars -a cloudfile-harvard
