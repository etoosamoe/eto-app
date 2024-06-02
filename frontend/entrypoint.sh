#!/bin/sh

# Generate config.js file
cat <<EOF > /usr/share/nginx/html/config.js
window._env_ = {
  REACT_APP_BACKEND_URL: "$REACT_APP_BACKEND_URL",
  REACT_APP_FRONT_VERSION: "$REACT_APP_FRONT_VERSION"
};
EOF

exec "$@"