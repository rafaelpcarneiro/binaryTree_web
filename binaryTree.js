// Important constants
var treeList   = [];
var treeCounter = 0;


// functions

//--------------------- Tree Structure && Boxes --------------------

function add_yes_no_btn(innerHTML, left_right) {
  let new_template;
  let btn_l, btn_r;

  btn_l = `
      <button class='btn btn-success ans_yes'>
          Sim
      </button>
  `
  btn_r = `
      <button class='btn btn-danger ans_no'>
          Não
      </button>
  `

  btn_l = btn_l.trim();
  btn_r = btn_r.trim();


  if (left_right == 'left') {
    new_template = btn_l + '\n' + innerHTML;
  }
  else {
    new_template = btn_r + '\n' + innerHTML;
  }

  return new_template;

}

function templateBox(parentId) {
  const template = `
      <div class='question_type'>
          <ul>
              <li>
                  <a href="#" style='color:white; font-weight:bold'
                    id='the_question' onclick="ask_question('${parentId}')" >
                      Add Pergunta
                  </a>
              </li>
              <li>
                  <a href="#" style='color:white; font-weight:bold'
                    id='the_type' onclick="ask_type('${parentId}')" >
                      Add Tipo
                  </a>
              </li>
          </ul>
      </div>

      <button
            class='btn btn-default btn_add_l btn-xs'
            onclick="add_box('${parentId}', 'left' )">
          +
      </button>
      <button
            class='btn btn-default btn_add_r btn-xs'
            onclick="add_box('${parentId}', 'right')">
          +
      </button>
  `
  return template.trim();
}

function fixLinePosfunc(lines) {
  let out_function;


  out_function = function() {
    for(let i = 0; i < lines.length; i++) {
      lines[i].position();
    }
  };

  //linePosFunctions.push(_function);

  return out_function;
}

function shift_box(node) {
  let pos, pos_new;
  let pos_y;
  const regex = /\d+/g, shift_y = 140;

  pos = window.getComputedStyle(
    node.div_element
  ).getPropertyValue(
    'transform'
  )
  //console.log(pos);

  pos = pos.match(regex);

  pos_y = Number(pos[5]) + shift_y;

  new_pos = 'matrix(1, 0, 0, 1,' + pos[4] + ',' + pos_y + ")";

  //console.log(new_pos)
  return new_pos;
}

function is_btn_disabled(parentId, left_right){
  let parentNode = find_node_of_the_tree(
    find_tree_root(parentId),
    parentId
  )

  let btn = null, flag = false;

  if (left_right == 'left'){
    btn = parentNode.div_element.getElementsByClassName(
      'disabled btn_add_l'
    )[0];

    if  (btn != null) {
      flag = true;
    }
  }
  else{
    btn = parentNode.div_element.getElementsByClassName(
      'disabled btn_add_r'
    )[0];

    if  (btn != null) {
      flag = true;
    }
  }

  console.log(flag);
  return flag;

}

function find_tree_root(id) {
  const regex = /(^root\d+)_/g;
  let treeRootId;

  treeRootId = id.match(regex)[0];

  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].div_element.id == treeRootId){
      return treeList[i];
    }
  }

}

function find_node_of_the_tree(rootTree, id) {
  let node = rootTree;
  let out  = null;

  if (node == null) {
    return null;
  };

  if (node.div_element.id == id){
    return node;
  }

  else {
    if (node.child_left != null) {
      out = find_node_of_the_tree(node.child_left, id);
    }

    if (out != null) {
      return out;
    }

    else {
      if (node.child_right != null) {
        out = find_node_of_the_tree(node.child_right, id);

        return out;

      }
      else {
        return null;
      }
    }

  }
}

function add_root(){
  let graphFrame  = document.getElementById('graphFrame');
  let div_element = document.createElement('DIV');
  let node;

  div_element.id        = 'root' + treeCounter + '_';
  div_element.innerHTML = templateBox(`${div_element.id}`);
  div_element.className = 'rootBox';

  node  = {
    div_element: div_element,
    div_child_left: null,
    div_child_right: null,
    lines: [],
    dragElem: null,
    _question: null,
    _type: null,
  }
  treeCounter += 1;

  graphFrame.appendChild( div_element );

  treeList.push( node );

  return node;
}

function add_node(parentId, left_right) {
  let graphFrame  = document.getElementById('graphFrame');
  let div_element = document.createElement('DIV');
  let node, treeRoot, parentNode;

  treeRoot   = find_tree_root(parentId);
  parentNode = find_node_of_the_tree(treeRoot, parentId);


  if (left_right == 'left') {
    div_element.id        = parentId + '0';
    //div_element.style.borderColor  = 'green';
    div_element.style.backgroundColor  = 'rgba(00,200,0,0.7)';
  }
  else {
    div_element.id        = parentId + '1';
    //div_element.style.borderColor  = 'blue';
    div_element.style.backgroundColor  = 'rgba(200,0,0,0.7)';
  }

  div_element.innerHTML = templateBox(`${div_element.id}`);
  div_element.innerHTML = add_yes_no_btn(div_element.innerHTML, left_right);

  div_element.className = 'box';

  node  = {
    div_element: div_element,
    div_child_left: null,
    div_child_right: null,
    lines: [],
    dragElem: null,
    _question: null,
    _type: null,
  }

  graphFrame.appendChild( div_element );

  if (left_right == 'left'){
    parentNode.child_left = node;
  }
  else {
    parentNode.child_right = node;
  }

  return node;

}

function create_tree() {
  let rootNode = add_root();

  let dragElem = new PlainDraggable(
    rootNode.div_element
  );

  console.log(treeCounter);
  rootNode.dragElem = dragElem;

}

function add_box(parentId, left_right) {
  let parentNode = find_node_of_the_tree(
    find_tree_root(parentId),
    parentId
  )

  let node, btn;

  let line, dragElem;

  if (is_btn_disabled(parentId, left_right)) {
    return 0;
  }


  // disable button
  if (left_right == 'left'){
    btn = parentNode.div_element.getElementsByClassName(
      'btn_add_l'
    )[0];
    btn.className = 'btn btn-default btn_add_l disabled btn-xs';
  }
  else{
    btn = parentNode.div_element.getElementsByClassName(
      'btn_add_r'
    )[0];
    btn.className = 'btn btn-default btn_add_r disabled btn-xs';
  }

  if (left_right == 'left'){
    node = add_node(parentId, 'left');
  }
  else{
    node = add_node(parentId, 'right');

  }


  node.div_element.style.transform = shift_box(parentNode);


  // drawing the arrow as well setting the draggable items
  line = new LeaderLine(
    parentNode.div_element,
    node.div_element,
    {path: 'grid',
     endSocket: 'auto',
     startSocket: 'bottom'
    }
  );

  parentNode.lines.push( line );
  node.lines.push( line );


  node.dragElem = new PlainDraggable(
    node.div_element,
    {onMove: fixLinePosfunc(node.lines)}
  );

  parentNode.dragElem = new PlainDraggable(
    parentNode.div_element,
    {onMove: fixLinePosfunc(parentNode.lines)}
  )
}

function ask_question(nodeId) {
  let question = prompt('Digite a pergunta', ' ');

  let node = find_node_of_the_tree(
    find_tree_root(nodeId),
    nodeId
  );

  node._question = question.trim();
  node._type     = null;

  let question_type = node.div_element.getElementsByClassName(
    'question_type'
  )[0];

  question_type.innerHTML = `
      <span class='broom-clean' onclick="clear_box('${nodeId}')">&#129529</span>
      <p>
          <strong>Pergunta</strong>:  ${question}
      </p>
  `
}

function clear_box(nodeId) {

  let node = find_node_of_the_tree(
    find_tree_root(nodeId),
    nodeId
  );
  node._question = null;
  node._type     = null;



  let question_type = node.div_element.getElementsByClassName(
    'question_type'
  )[0];

  question_type.innerHTML = `
      <ul>
          <li>
              <a href="#" style='color:white; font-weight:bold'
                id='the_question' onclick="ask_question('${nodeId}')" >
                  Add Pergunta
              </a>
          </li>
          <li>
              <a href="#" style='color:white; font-weight:bold'
                id='the_type' onclick="ask_type('${nodeId}')" >
                  Add Tipo
              </a>
          </li>
      </ul>
  `
  //question_type.innerHTML.trim();

}

function ask_type(nodeId) {
  let thetype = prompt('Digite o tipo', ' ');

  let node = find_node_of_the_tree(
    find_tree_root(nodeId),
    nodeId
  );
  node._question = null;
  node._type     = thetype.trim();

  let question_type = node.div_element.getElementsByClassName(
    'question_type'
  )[0];


  question_type.innerHTML = `
      <span class='broom-clean' onclick="clear_box('${nodeId}')">&#129529</span>
      <p>
          <strong>Tipo</strong>:  ${thetype}
      </p>
  `
}
//------------------- END Tree Structure && Boxes ------------------



//-------------------- Asjudt Screen Size --------------------------
function aumenta_tela_d(){
  let graphFrame = document.getElementById('graphFrame');

  console.log(graphFrame.offsetWidth)
  graphFrame.style.width = `${graphFrame.offsetWidth + 300}px`;

}

function aumenta_tela_b(){
  let graphFrame = document.getElementById('graphFrame');

  console.log(graphFrame.offsetHeight)
  graphFrame.style.height = `${graphFrame.offsetHeight + 300}px`;

}
