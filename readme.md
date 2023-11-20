# Drawing a responsive Binary Tree with JS

This repository is a result of my work trying to draw a web page
that displays an interactive diagram, which later is going to feed a 
REST-API. The only constraint, at the diagram, is that it follows 
a binary tree. In that way, the html+js of this repo gives the user the 
possibility of building a tree step by step, and whose content, 
of each leave, is a text that it is inserted whenever the center 
of the leaves are clicked.

In order to run this repo there are two dependencies:
+ [_leader-line.min.js_](https://anseki.github.io/leader-line/)
+ [_plain-draggable.min.js_](https://anseki.github.io/leader-line/)

Both of these projects are awesome, check them up for more information.
Copy both of these javascript files at this directory then open 
index.html at the web browser.

**Note**: The diagram can be easily adapted, the more difficult part 
was to generate the binary tree objects in javascript.
Later I will insert an example on how to generate the tree.

![example of tree](./img/example_of_tree.png)


