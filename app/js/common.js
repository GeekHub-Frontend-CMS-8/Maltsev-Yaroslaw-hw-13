let
todoDescList = [],
indexList = 0,
list = $('.todos__list'),
todoObject = {
	desc: todoDescList
};

function createWindowOpen (button) {
	$(button).on('click', function(){
		$('.todos__create textarea').val('');
		$('.todos__create *').css('display', 'flex');
	})
}

function createWindowClose(button) {
	$(button).on('click', function(){
		$('.todos__create textarea').val('');
		$('.todos__create *').css('display', 'none');
	})
};

createWindowOpen('.button__new');
createWindowClose('#button__cancel');

function render() {
	$('.todos__list').empty();

	$.each(todoDescList, function(indexDel, indexEdit) {
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
	});
}

$('#create-new').on('click', function(){
	let	text = $('#todoDescNew');
	$('.todos__list').empty();
	todoDescList.push(text[0].value);
	text.val('');

	render();
	createWindowClose(this);
})

function remove(index) {
	todoDescList.splice(index, 1);
	render();
};

let edit = false,
		doc = $(document);

doc.on('click', '.todos__item .button__edit', function(){
	if (edit == false){
		$(this).html('Save');
		$(this).siblings('.todos__desc').css('border', '1px solid #ededed').removeAttr('readonly');
		edit = true;
	}
	else if (edit == true){
		let index = $(this).siblings('.button__del').data('index'),		
				value = $(this).siblings('.todos__desc').val();

		$(this).html('Edit');

		todoDescList.push(value)
		todoDescList.splice(index, 1);
		render();

		edit = false;
		$(this).siblings('.todos__desc').css('border', '0').attr('readonly');
	};
});


doc.on('click', '.todos__item .button__del', function() {
	let index = $(this).data('index')
	remove(index)
});

let done;
done = false;

doc.on('click', '.todos__item .button__done', function(){
	if (done == false){
		done = true
		$(this).siblings('.todos__desc').css('text-decoration', 'line-through');
		$(this).html('Not done')
	}
	else if (done == true){
		done = false
		$(this).siblings('.todos__desc').css('text-decoration', 'none');
		$(this).html('Done')
	}	
})