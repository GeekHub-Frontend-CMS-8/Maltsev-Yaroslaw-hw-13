let
todoDescList = [],
ajaxList = [],
list = $('.todos__list'),
findList = '.todos__list',
doc = $(document),
localStorageValue = localStorage.getItem("text");


if (localStorageValue === null) {
	todoDescList = [];
}
else {
	todoDescList = localStorageValue.slice(2, localStorageValue.length - 2).split('","');
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

function render() {
	list.empty();

	$.each(todoDescList, function(indexDel, indexEdit) {
		if (!('' in todoDescList)){
			list.prepend(`
				<li class="todos__item"> 
					<textarea class="todos__desc" readonly>${this}</textarea>
					<button class="button button-item button__edit" data-index="${indexEdit}">
						Edit
					</button>
					<button class="button button-item button__del" data-index="${indexDel}">
						Del
					</button>
					<button class="button button-item button__done">
						Done
					</button>
				</li>`)
		}
	});
}

function addToLocal() {
	localStorage.clear();
	localStorage.setItem("text", JSON.stringify(todoDescList));
}

$('#create-new').on('click', function(){ //Create new ToDo's
	let	text = $('#todoDescNew');
	list.empty();
	if (text[0].value == '') {
		text.attr('placeholder','String is empty!').css('border', '1px solid red')
	}
	else {
		text.attr('placeholder','Name').css('border', '1px solid gray')
		todoDescList.push(text[0].value); //Add value to list
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
		let index = $(this).siblings('.button__del').data('index'), // Index in data-atribute of item 
				value = $(this).siblings('.todos__desc').val();

		$(this).html('Edit');

		todoDescList.push(value)
		todoDescList.splice(index, 1); // Value delete
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

let done = false;

/*
------------Done button--------------
*/

doc.on('click', '.todos__item .button__done', function(){
	if (done == false){
		done = true
		$(this).siblings('.todos__desc').css('text-decoration', 'line-through').css('background', 'green').css('color', 'white');
		$(this).html('Not done')
	}
	else if (done == true){
		done = false
		$(this).siblings('.todos__desc').css('text-decoration', 'none');
		$(this).html('Done')
	}	
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
	let todoNumber, processList, arrr = [];

	processList = data;
	console.log(processList);
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
		todoDescList.push(ajaxList[i].title);
		i++;
	})
	render()
	addToLocal()
}