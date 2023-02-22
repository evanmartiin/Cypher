# Cypher

## Setup

``` bash
nvm use
pnpm i
pnpm dev
```

## Build

``` bash
pnpm staging # build in staging mode
pnpm build # build in production mode
```

## Preview

``` bash
pnpm preview
```

## URLParams

Add params to URL to turn on/off some features.  
Example: `www.url.com/?param1&param2`  

List of params:  
`debug`: Enable debug panes, stats, camera.  
`orbit`: Enable OrbitControls, `debug` must be enabled.  
`skip-screen-record`: Disable video creation.  
`skip-camera`: Disable camera & Tensorflow compute.  

s/o Titou pour le starter