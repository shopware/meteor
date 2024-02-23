#! /usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Missing working directory argument" && exit 1

DIR=$1
SRC=$1/packages/component-library

reverse() {
    declare -n arr="$1" rev="$2"
    for i in "${arr[@]}"
    do
        rev=("$i" "${rev[@]}")
    done
}

echo "Creating Storybook docs dir"
mkdir -p $DIR/docs/preview

echo "Discovering Storybook stories"
find $DIR -type f -name "*.stories.js" -print0 | while read -d $'\0' file
do
  if [[ $file == *".interactive."* ]]; then
    # ./src/components/icons-media/sw-icon/sw-icon.interactive.stories.js
    echo "$file is interactive"

  # ./src/components/icons-media/sw-icon/sw-icon.stories.js
  elif [[ $file == *"/components/"* ]]; then
    # split to array
    split=($(echo "$file" | tr '/' ' '))
    reverse split reversed
    component="${reversed[1]//.stories.js/''}"
    identifier="${reversed[3]}-${reversed[2]}-${reversed[1]}--docs"

    # create dir
    if [[ ! -d "$SRC/docs/component" ]]; then
      echo "Creating dir docs/component"
      mkdir -p $SRC/docs/component

      cat <<EOT > $SRC/docs/component/index.md
---
sidebar: true
---

# Components

EOT
    fi

    # components-navigation-sw-tabs--default
    # create file
    echo "Creating file component/$component.md"
    cat <<EOT > $SRC/docs/component/$component.md
---
sidebar: true
aside: false
nav:
  title: $component
---

<SwagStorybookIframe component="$identifier" />
EOT
  # cat $SRC/docs/component/$component.md

  # ./src/directives/tooltip.stories.js
  elif [[ $file == *"/directives/"* ]]; then

    # split to array
    split=($(echo "$file" | tr '/' ' '))
    reverse split reversed
    component="${reversed[0]//.stories.js/''}"
    identifier="${reversed[1]}-${component}--docs"

    # create dir
    if [[ ! -d "$SRC/docs/directive" ]]; then
      echo "Creating dir docs/directive"
      mkdir -p $SRC/docs/directive

      cat <<EOT > $SRC/docs/directive/index.md
---
sidebar: true
---

# Directives

EOT
    fi

    # create file
    echo "Creating file directive/$component.md"
    cat <<EOT > $SRC/docs/directive/$component.md
---
sidebar: true
aside: false
nav:
  title: $component
---

<SwagStorybookIframe component="$identifier" />
EOT
  # cat $SRC/docs/directive/$component.md

  else
    echo "$file is unknown"
  fi
done