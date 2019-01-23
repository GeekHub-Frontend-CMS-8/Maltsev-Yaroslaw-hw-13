let
todoDescList = [],
ajaxList = [],
list = $('.todos__list'),
findList = '.todos__list',
doc = $(document),
localStorageValue = localStorage.getItem("text");

function editedStyle (data) {
	if (data == true) {
		return 'block'
	}
	else {
		return 'none'
	}	
}

if (localStorageValue === null) {
	todoDescList = [];
}
else {
	todoDescList = JSON.parse(localStorageValue);
	render()
}

function createWindowOpen (button) { //Open window to create ToDo's
	$(button).on('click', function(){
		$('.todos__create textarea').val('');
		$('.todos__create *').css('display', 'flex');
	})
}

function createWindowClose(button) { //Close window to create ToDo's
	$(button).on('click', function(){
		$('.todos__create textarea').val('');
		$('.todos__create *').css('display', 'none');
	})
};

createWindowOpen('.button__new');
createWindowClose('#button__cancel');

let indexForRender = 0;

function isDone(data, valueIfFalse, valueIfTrue) {
	if (data == false){
		return valueIfFalse
	}				
	else if (data == true) {
		return valueIfTrue
	}
}

function render() {
	list.empty();
	let i = 0;
	$.each(todoDescList, function(indexDel, indexEdit) {
			list.prepend(`
				<li class="todos__item" style="${isDone(todoDescList[i].completed, "", "background: rgba(0, 128, 0, 0.6)")}"> 
					<textarea class="todos__desc" readonly style="${isDone(todoDescList[i].completed, "", "text-decoration: line-through; background: transparent; color: #fff;")}">${todoDescList[i].title}</textarea>
					<button class="button button-item button__edit" data-index="${indexEdit}">
						Edit
					</button>
					<button class="button button-item button__del" data-index="${indexDel}">
						Del
					</button>
					<button class="button button-item button__done">
						${isDone(todoDescList[i].completed, "Done", "Not Done")}
					</button>
					<p class="edited" style="width: 100%; text-align: left; display: ${editedStyle(todoDescList[i].edited)}; ${isDone(todoDescList[i].completed, "", "color: #fff")}">edited</p>
				</li>`)
			i++;
	});
}

function addToLocal() {
	localStorage.clear();
	localStorage.setItem("text", JSON.stringify(todoDescList));
}

/*
------------Create button--------------
*/

$('#create-new').on('click', function(){ //Create new ToDo's
	let	text = $('#todoDescNew');
	list.empty();
	if (text[0].value == '') {
		text.attr('placeholder','String is empty!').css('border', '1px solid red')
	}
	else {
		text.attr('placeholder','Name').css('border', '1px solid gray')

		todoDescList.push({
				title: text[0].value,
				completed: false,
				edited: false
			}); //Add value to list

		text.val(''); // Clear
		addToLocal()	
	}
	render();
})

/*
------------Edit button--------------
*/

let edit = false;

doc.on('click', '.todos__item .button__edit', function(){ //Edit function
	if (edit == false){
		$(this).html('Save');
		$(this).siblings('.todos__desc').css('border', '1px solid #ededed').removeAttr('readonly'); //Teaxtare view
		edit = true;
	}
	else if (edit == true){
		let index = $(this).siblings('.button__del').data('index'),
				value = $(this).siblings('.todos__desc').val();

		$(this).html('Edit');

		todoDescList[index].title = value;

		// todoDescList[index].completed = false; - reset "done" when saving changes

		todoDescList[index].edited = true;

		render();

		addToLocal();

		edit = false;
		$(this).siblings('.todos__desc').css('border', '0').attr('readonly');
	};
});

/*
------------Delete button--------------
*/

doc.on('click', '.todos__item .button__del', function() { // For delete-button
	let index = $(this).data('index')
	todoDescList.splice(index, 1);
	render();
	addToLocal();
});

/*
------------Done button--------------
*/

doc.on('click', '.todos__item .button__done', function(){

	let done = todoDescList[$(this).siblings('.button__del').data('index')].completed;

	if (done == false){

		todoDescList[$(this).siblings('.button__del').data('index')].completed = true;

	}
	else if (done == true){

		todoDescList[$(this).siblings('.button__del').data('index')].completed = false;

	}
	render()	
	addToLocal();
})

/*
------------Load more button--------------
*/

$('.load-more').on('click', function(){
	$.get('https://jsonplaceholder.typicode.com/todos', '', dataList)
	.complete(function() {
		dataList()
	})
})

function dataList(data) {
	let todoNumber, processList;

	processList = data;
	while (true){
		todoNumber = Number(prompt('How much ToDo\'s? ', ''));
		if (todoNumber > processList.length) {
			alert('To much')
		}
		else if (todoNumber <= 0) {
			alert('To few')
		}
		else {
			break
		}
	}
	ajaxList = processList.slice(0, todoNumber);
	let i = 0;
	$.each(ajaxList, function() {
		todoDescList.unshift(ajaxList[i]);
		i++;
	})
	render()
	addToLocal()
}

/*
------------Clear button--------------
*/

$('.clear').on('click', function() {
	todoDescList = [];
	localStorage.clear();
	render();
})